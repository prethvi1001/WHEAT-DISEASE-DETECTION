package com.cropshield.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "disease_id")
    private Disease disease;

    @Column(nullable = false)
    private Double confidence;

    @Column(name = "image_path", nullable = false)
    private String imagePath;

    @Column(name = "expected_recovery")
    private String expectedRecovery;

    @Column(nullable = false)
    private String status = "PENDING"; // "PENDING", "RESOLVED"

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
