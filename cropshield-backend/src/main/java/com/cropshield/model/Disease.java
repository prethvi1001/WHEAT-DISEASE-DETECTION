package com.cropshield.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "diseases")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Disease {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "scientific_name")
    private String scientificName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String symptoms;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String causes;

    @Column(nullable = false)
    private String severity; // "LOW", "MEDIUM", "HIGH"

    @Column(columnDefinition = "TEXT", nullable = false)
    private String prevention;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String treatment;

    private String fungicide;

    @Column(name = "image_url")
    private String imageUrl;
}
