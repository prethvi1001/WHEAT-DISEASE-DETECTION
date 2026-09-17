package com.cropshield.controller;

import com.cropshield.model.Prediction;
import com.cropshield.repository.PredictionRepository;
import com.cropshield.service.PDFReportService;
import com.cropshield.service.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/predictions")
@CrossOrigin(origins = "*")
public class PredictionController {

    @Autowired
    private PredictionService predictionService;

    @Autowired
    private PredictionRepository predictionRepository;

    @Autowired
    private PDFReportService pdfReportService;

    @PostMapping("/predict")
    public ResponseEntity<?> predict(@RequestParam("image") MultipartFile file,
                                     @RequestParam(value = "userId", required = false) Long userId) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Please upload a valid wheat leaf image."));
        }
        try {
            Prediction prediction = predictionService.predictDisease(file, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(prediction);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Image saving failed: " + e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<Prediction>> getHistory(@RequestParam(value = "userId", required = false) Long userId) {
        if (userId != null) {
            return ResponseEntity.ok(predictionRepository.findByUserIdOrderByCreatedAtDesc(userId));
        } else {
            return ResponseEntity.ok(predictionRepository.findAllByOrderByCreatedAtDesc());
        }
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics(@RequestParam(value = "userId", required = false) Long userId) {
        Map<String, Object> stats = new HashMap<>();
        
        long total;
        long healthy;
        long diseased;
        
        if (userId != null) {
            total = predictionRepository.countByUserId(userId);
            healthy = predictionRepository.countByUserIdAndDiseaseName(userId, "Healthy Wheat");
            diseased = predictionRepository.countByUserIdAndDiseaseNameNot(userId, "Healthy Wheat");
        } else {
            total = predictionRepository.count();
            healthy = predictionRepository.countByDiseaseName("Healthy Wheat");
            diseased = predictionRepository.countByDiseaseNameNot("Healthy Wheat");
        }
        
        stats.put("totalPredictions", total);
        stats.put("healthyPlants", healthy);
        stats.put("diseasedPlants", diseased);

        // Disease distribution counts
        String[] diseaseList = {
            "Leaf Rust", "Stripe Rust", "Stem Rust", 
            "Powdery Mildew", "Leaf Blight", "Septoria Leaf Blotch"
        };
        
        Map<String, Long> distribution = new HashMap<>();
        for (String disease : diseaseList) {
            long count = (userId != null) 
                    ? predictionRepository.countByUserIdAndDiseaseName(userId, disease)
                    : predictionRepository.countByDiseaseName(disease);
            distribution.put(disease, count);
        }
        stats.put("diseaseDistribution", distribution);
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{id}/report")
    public ResponseEntity<byte[]> downloadReport(@PathVariable Long id) {
        Optional<Prediction> predictionOpt = predictionRepository.findById(id);
        if (predictionOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        try {
            Prediction prediction = predictionOpt.get();
            byte[] pdfBytes = pdfReportService.generatePredictionReport(prediction);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            String filename = "CropShield_Report_" + prediction.getId() + ".pdf";
            headers.setContentDisposition(ContentDisposition.attachment().filename(filename).build());

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Status field is required"));
        }
        
        return predictionRepository.findById(id).map(prediction -> {
            prediction.setStatus(status);
            Prediction updated = predictionRepository.save(prediction);
            return ResponseEntity.ok(updated);
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Prediction not found")));
    }

    // Serve prediction images directly
    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<byte[]> getPredictionImage(@PathVariable String filename) {
        try {
            java.nio.file.Path imagePath = java.nio.file.Paths.get("uploads").resolve(filename);
            if (Files.exists(imagePath)) {
                byte[] imageBytes = Files.readAllBytes(imagePath);
                String contentType = Files.probeContentType(imagePath);
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType != null ? contentType : "image/jpeg"))
                        .body(imageBytes);
            }
        } catch (Exception e) {
            // Log error
        }
        return ResponseEntity.notFound().build();
    }
}
