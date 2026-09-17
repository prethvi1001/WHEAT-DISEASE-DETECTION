package com.cropshield.repository;

import com.cropshield.model.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    List<Prediction> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Prediction> findAllByOrderByCreatedAtDesc();
    
    // Count utilities for analytics
    long countByDiseaseName(String name);
    long countByDiseaseNameNot(String name);
    
    // Count utilities for specific farmer
    long countByUserId(Long userId);
    long countByUserIdAndDiseaseName(Long userId, String name);
    long countByUserIdAndDiseaseNameNot(Long userId, String name);
}
