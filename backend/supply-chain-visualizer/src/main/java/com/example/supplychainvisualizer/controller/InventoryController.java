package com.example.supplychainvisualizer.controller;

import com.example.supplychainvisualizer.dto.InventoryDto;
import com.example.supplychainvisualizer.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    
    @Autowired
    private InventoryService inventoryService;
    
    @GetMapping
    public ResponseEntity<List<InventoryDto>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }
    
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<InventoryDto> getInventoryById(@PathVariable Long id) {
        return inventoryService.getInventoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<InventoryDto> createOrUpdateInventory(@Valid @RequestBody InventoryDto inventoryDto) {
        return ResponseEntity.ok(inventoryService.createOrUpdateInventory(inventoryDto));
    }
    
    @DeleteMapping("/{id:\\d+}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> deleteInventory(@PathVariable Long id) {
        return inventoryService.deleteInventory(id)
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }
    
    @GetMapping("/node/{nodeId}")
    public ResponseEntity<List<InventoryDto>> getInventoryByNode(@PathVariable Long nodeId) {
        return ResponseEntity.ok(inventoryService.getInventoryByNode(nodeId));
    }
    
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<InventoryDto>> getInventoryByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(inventoryService.getInventoryByProduct(productId));
    }
    
    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryDto>> getLowStockInventory() {
        return ResponseEntity.ok(inventoryService.getLowStockInventory());
    }
}