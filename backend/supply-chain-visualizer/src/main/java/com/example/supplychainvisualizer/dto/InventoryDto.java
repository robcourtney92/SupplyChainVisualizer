package com.example.supplychainvisualizer.dto;

import jakarta.validation.constraints.NotNull;

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
}