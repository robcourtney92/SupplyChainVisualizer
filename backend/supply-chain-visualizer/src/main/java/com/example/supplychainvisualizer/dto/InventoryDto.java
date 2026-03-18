package com.example.supplychainvisualizer.dto;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class InventoryDto {
    private Long id;
    
    @NotNull
    private Long nodeId;
    
    private String nodeName;
    
    @NotNull
    private Long productId;
    
    private String productName;
    
    @NotNull
    private Integer quantity;
    
    private Integer minThreshold;
    
    private Integer maxThreshold;
    
    private String status;
    
    private LocalDateTime updatedAt;
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getNodeId() {
        return nodeId;
    }
    
    public void setNodeId(Long nodeId) {
        this.nodeId = nodeId;
    }
    
    public String getNodeName() {
        return nodeName;
    }
    
    public void setNodeName(String nodeName) {
        this.nodeName = nodeName;
    }
    
    public Long getProductId() {
        return productId;
    }
    
    public void setProductId(Long productId) {
        this.productId = productId;
    }
    
    public String getProductName() {
        return productName;
    }
    
    public void setProductName(String productName) {
        this.productName = productName;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public Integer getMinThreshold() {
        return minThreshold;
    }
    
    public void setMinThreshold(Integer minThreshold) {
        this.minThreshold = minThreshold;
    }
    
    public Integer getMaxThreshold() {
        return maxThreshold;
    }
    
    public void setMaxThreshold(Integer maxThreshold) {
        this.maxThreshold = maxThreshold;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
