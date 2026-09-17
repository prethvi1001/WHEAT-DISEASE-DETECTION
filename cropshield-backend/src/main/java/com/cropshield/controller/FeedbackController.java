package com.cropshield.controller;

import com.cropshield.model.Feedback;
import com.cropshield.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @PostMapping
    public ResponseEntity<Feedback> submitFeedback(@RequestBody Feedback feedback) {
        Feedback saved = feedbackRepository.save(feedback);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        return ResponseEntity.ok(feedbackRepository.findAll());
    }
}
