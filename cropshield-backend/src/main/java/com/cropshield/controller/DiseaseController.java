package com.cropshield.controller;

import com.cropshield.model.Disease;
import com.cropshield.repository.DiseaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/diseases")
@CrossOrigin(origins = "*")
public class DiseaseController {

    @Autowired
    private DiseaseRepository diseaseRepository;

    @GetMapping
    public ResponseEntity<List<Disease>> getAllDiseases() {
        return ResponseEntity.ok(diseaseRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDiseaseById(@PathVariable Long id) {
        Optional<Disease> diseaseOpt = diseaseRepository.findById(id);
        if (diseaseOpt.isPresent()) {
            return ResponseEntity.ok(diseaseOpt.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Disease not found");
    }

    @PostMapping
    public ResponseEntity<Disease> createDisease(@RequestBody Disease disease) {
        Disease saved = diseaseRepository.save(disease);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDisease(@PathVariable Long id, @RequestBody Disease diseaseDetails) {
        return diseaseRepository.findById(id).map(disease -> {
            disease.setName(diseaseDetails.getName());
            disease.setScientificName(diseaseDetails.getScientificName());
            disease.setSymptoms(diseaseDetails.getSymptoms());
            disease.setCauses(diseaseDetails.getCauses());
            disease.setSeverity(diseaseDetails.getSeverity());
            disease.setPrevention(diseaseDetails.getPrevention());
            disease.setTreatment(diseaseDetails.getTreatment());
            disease.setFungicide(diseaseDetails.getFungicide());
            disease.setImageUrl(diseaseDetails.getImageUrl());
            Disease updated = diseaseRepository.save(disease);
            return ResponseEntity.ok(updated);
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Disease not found"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDisease(@PathVariable Long id) {
        return diseaseRepository.findById(id).map(disease -> {
            diseaseRepository.delete(disease);
            return ResponseEntity.ok().build();
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Disease not found"));
    }
}
