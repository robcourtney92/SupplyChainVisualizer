package com.example.supplychainvisualizer.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class ShipmentDto {
    private Long id;
    
    @NotNull
    private Long sourceId;
    
    @NotNull
    private Long destinationId;
    
    private String status = "pending";
    
    private LocalDate departureDate;
    
    private LocalDate estimatedArrival;
    
    private LocalDate actualArrival;
    
    private List<ShipmentItemDto> items;
    
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
    
    public Long getDestinationId() {
        return destinationId;
    }
    
    public void setDestinationId(Long destinationId) {
        this.destinationId = destinationId;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public LocalDate getDepartureDate() {
        return departureDate;
    }
    
    public void setDepartureDate(LocalDate departureDate) {
        this.departureDate = departureDate;
    }
    
    public LocalDate getEstimatedArrival() {
        return estimatedArrival;
    }
    
    public void setEstimatedArrival(LocalDate estimatedArrival) {
        this.estimatedArrival = estimatedArrival;
    }
    
    public LocalDate getActualArrival() {
        return actualArrival;
    }
    
    public void setActualArrival(LocalDate actualArrival) {
        this.actualArrival = actualArrival;
    }
    
    public List<ShipmentItemDto> getItems() {
        return items;
    }
    
    public void setItems(List<ShipmentItemDto> items) {
        this.items = items;
    }
    private String sourceName;
    private String destinationName;

    public String getSourceName() {
        return sourceName;
    }

    public void setSourceName(String sourceName) {
        this.sourceName = sourceName;
    }

    public String getDestinationName() {
        return destinationName;
    }

    public void setDestinationName(String destinationName) {
        this.destinationName = destinationName;
    }
}