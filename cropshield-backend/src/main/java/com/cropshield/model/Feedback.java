package com.cropshield.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
