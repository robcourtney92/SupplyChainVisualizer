package com.example.supplychainvisualizer.service.impl;

import com.example.supplychainvisualizer.dto.InventoryDto;
import com.example.supplychainvisualizer.model.Inventory;
import com.example.supplychainvisualizer.model.Node;
import com.example.supplychainvisualizer.model.Product;
import com.example.supplychainvisualizer.repository.InventoryRepository;
import com.example.supplychainvisualizer.repository.NodeRepository;
import com.example.supplychainvisualizer.repository.ProductRepository;
import com.example.supplychainvisualizer.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InventoryServiceImpl implements InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private NodeRepository nodeRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<InventoryDto> getAllInventory() {
        return inventoryRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<InventoryDto> getInventoryById(Long id) {
        return inventoryRepository.findById(id).map(this::convertToDto);
    }

    @Override
    public InventoryDto createOrUpdateInventory(InventoryDto inventoryDto) {
        Optional<Node> nodeOpt = nodeRepository.findById(inventoryDto.getNodeId());
        Optional<Product> productOpt = productRepository.findById(inventoryDto.getProductId());
        
        if (nodeOpt.isPresent() && productOpt.isPresent()) {
            Node node = nodeOpt.get();
            Product product = productOpt.get();
            
            // Check if inventory record already exists
            Optional<Inventory> existingInventory = inventoryRepository
                .findByNodeAndProduct(node, product);
            
            Inventory inventory;
            if (existingInventory.isPresent()) {
                // Update existing inventory
                inventory = existingInventory.get();
                inventory.setQuantity(inventoryDto.getQuantity());
                inventory.setMinThreshold(inventoryDto.getMinThreshold());
                inventory.setMaxThreshold(inventoryDto.getMaxThreshold());
                inventory.setStatus(inventoryDto.getStatus());
            } else {
                // Create new inventory
                inventory = new Inventory();
                inventory.setNode(node);
                inventory.setProduct(product);
                inventory.setQuantity(inventoryDto.getQuantity());
                inventory.setMinThreshold(inventoryDto.getMinThreshold());
                inventory.setMaxThreshold(inventoryDto.getMaxThreshold());
                inventory.setStatus(inventoryDto.getStatus());
            }
            
            Inventory savedInventory = inventoryRepository.save(inventory);
            return convertToDto(savedInventory);
        }
        
        return inventoryDto; // Return original DTO if node or product not found
    }

    @Override
    public Optional<InventoryDto> updateInventoryById(Long id, InventoryDto inventoryDto) {
        return inventoryRepository.findById(id).map(inventory -> {
            inventory.setQuantity(inventoryDto.getQuantity());
            inventory.setMinThreshold(inventoryDto.getMinThreshold());
            inventory.setMaxThreshold(inventoryDto.getMaxThreshold());
            inventory.setStatus(inventoryDto.getStatus());
            Inventory savedInventory = inventoryRepository.save(inventory);
            return convertToDto(savedInventory);
        });
    }

    @Override
    public boolean deleteInventory(Long id) {
        return inventoryRepository.findById(id).map(inventory -> {
            inventoryRepository.delete(inventory);
            return true;
        }).orElse(false);
    }

    @Override
    public List<InventoryDto> getInventoryByNode(Long nodeId) {
        return nodeRepository.findById(nodeId)
                .map(node -> inventoryRepository.findByNode(node).stream()
                        .map(this::convertToDto)
                        .collect(Collectors.toList()))
                .orElse(List.of());
    }

    @Override
    public List<InventoryDto> getInventoryByProduct(Long productId) {
        return productRepository.findById(productId)
                .map(product -> inventoryRepository.findByProduct(product).stream()
                        .map(this::convertToDto)
                        .collect(Collectors.toList()))
                .orElse(List.of());
    }

    @Override
    public List<InventoryDto> getLowStockInventory() {
        return inventoryRepository.findLowStock().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    private InventoryDto convertToDto(Inventory inventory) {
        InventoryDto inventoryDto = new InventoryDto();
        inventoryDto.setId(inventory.getId());
        inventoryDto.setNodeId(inventory.getNode().getId());
        inventoryDto.setNodeName(inventory.getNode().getName());  
        inventoryDto.setProductId(inventory.getProduct().getId());
        inventoryDto.setProductName(inventory.getProduct().getName());  
        inventoryDto.setQuantity(inventory.getQuantity());
        inventoryDto.setMinThreshold(inventory.getMinThreshold());
        inventoryDto.setMaxThreshold(inventory.getMaxThreshold());
        inventoryDto.setStatus(inventory.getStatus());
        inventoryDto.setUpdatedAt(inventory.getUpdatedAt());
        return inventoryDto;
    }
}
