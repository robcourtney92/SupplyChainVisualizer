package com.example.supplychainvisualizer.service;

import com.example.supplychainvisualizer.dto.InventoryDto;

import java.util.List;
import java.util.Optional;

public interface InventoryService {
    List<InventoryDto> getAllInventory();
    Optional<InventoryDto> getInventoryById(Long id);
    InventoryDto createOrUpdateInventory(InventoryDto inventoryDto);
    Optional<InventoryDto> updateInventoryById(Long id, InventoryDto inventoryDto);
    boolean deleteInventory(Long id);
    List<InventoryDto> getInventoryByNode(Long nodeId);
    List<InventoryDto> getInventoryByProduct(Long productId);
    List<InventoryDto> getLowStockInventory();
}
