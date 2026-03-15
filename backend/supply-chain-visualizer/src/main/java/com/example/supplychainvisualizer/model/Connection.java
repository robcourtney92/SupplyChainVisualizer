package com.example.supplychainvisualizer.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "connections")
@EntityListeners(AuditingEntityListener.class)
public class Connection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "source_id", nullable = false)
    private Node source;

    @ManyToOne
    @JoinColumn(name = "target_id", nullable = false)
    private Node target;

    private String transportationType; // truck, train, ship, etc.

    private Double distance; // in kilometers

    private Integer travelTime; // in hours

    private Double costPerUnit;

    @Column(nullable = false)
    private String status = "active";

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
