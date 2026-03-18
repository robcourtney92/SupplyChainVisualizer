package com.example.supplychainvisualizer.controller;

import com.example.supplychainvisualizer.dto.ShipmentDto;
import com.example.supplychainvisualizer.service.ShipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/shipments")
public class ShipmentController {
    
    @Autowired
    private ShipmentService shipmentService;
    
    @GetMapping
    public ResponseEntity<List<ShipmentDto>> getAllShipments() {
        return ResponseEntity.ok(shipmentService.getAllShipments());
    }
    
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<ShipmentDto> getShipmentById(@PathVariable Long id) {
        return shipmentService.getShipmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ShipmentDto> createShipment(@Valid @RequestBody ShipmentDto shipmentDto) {
        return ResponseEntity.ok(shipmentService.createShipment(shipmentDto));
    }
    
    @PutMapping("/{id:\\d+}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ShipmentDto> updateShipment(@PathVariable Long id, @Valid @RequestBody ShipmentDto shipmentDto) {
        return shipmentService.updateShipment(id, shipmentDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id:\\d+}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> deleteShipment(@PathVariable Long id) {
        return shipmentService.deleteShipment(id)
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }
    
    @PutMapping("/status/{id:\\d+}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ShipmentDto> updateShipmentStatus(
            @PathVariable Long id, @RequestParam String status) {
        return shipmentService.updateShipmentStatus(id, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/source/{sourceId}")
    public ResponseEntity<List<ShipmentDto>> getShipmentsBySource(@PathVariable Long sourceId) {
        return ResponseEntity.ok(shipmentService.getShipmentsBySource(sourceId));
    }
    
    @GetMapping("/destination/{destinationId}")
    public ResponseEntity<List<ShipmentDto>> getShipmentsByDestination(@PathVariable Long destinationId) {
        return ResponseEntity.ok(shipmentService.getShipmentsByDestination(destinationId));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ShipmentDto>> getShipmentsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(shipmentService.getShipmentsByStatus(status));
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<ShipmentDto>> getShipmentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "departure") String dateType) {
        
        return ResponseEntity.ok(shipmentService.getShipmentsByDateRange(startDate, endDate, dateType));
    }
}