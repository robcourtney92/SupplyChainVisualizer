package com.example.supplychainvisualizer.dto;

import jakarta.validation.constraints.NotNull;

public class ConnectionDto {
    private Long id;
    
    @NotNull
    private Long sourceId;
    
    @NotNull
    private Long targetId;
    
    private String transportationType;
    
    private Double distance;
    
    private Integer travelTime;
    
    private Double costPerUnit;
    
    private String status = "active";
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getSourceId() {
        return sourceId;
    }
    
    public void setSourceId(Long sourceId) {
        this.sourceId = sourceId;
    }
    
    public Long getTargetId() {
        return targetId;
    }
    
    public void setTargetId(Long targetId) {
        this.targetId = targetId;
    }
    
    public String getTransportationType() {
        return transportationType;
    }
    
    public void setTransportationType(String transportationType) {
        this.transportationType = transportationType;
    }
    
    public Double getDistance() {
        return distance;
    }
    
    public void setDistance(Double distance) {
        this.distance = distance;
    }
    
    public Integer getTravelTime() {
        return travelTime;
    }
    
    public void setTravelTime(Integer travelTime) {
        this.travelTime = travelTime;
    }
    
    public Double getCostPerUnit() {
        return costPerUnit;
    }
    
    public void setCostPerUnit(Double costPerUnit) {
        this.costPerUnit = costPerUnit;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}