package com.example.supplychainvisualizer.controller;

import com.example.supplychainvisualizer.dto.ConnectionDto;
import com.example.supplychainvisualizer.service.ConnectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/connections")
public class ConnectionController {
    
    @Autowired
    private ConnectionService connectionService;
    
    @GetMapping
    public ResponseEntity<List<ConnectionDto>> getAllConnections() {
        return ResponseEntity.ok(connectionService.getAllConnections());
    }
    
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<ConnectionDto> getConnectionById(@PathVariable Long id) {
        return connectionService.getConnectionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ConnectionDto> createConnection(@Valid @RequestBody ConnectionDto connectionDto) {
        return ResponseEntity.ok(connectionService.createConnection(connectionDto));
    }
    
    @PutMapping("/{id:\\d+}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ConnectionDto> updateConnection(@PathVariable Long id, @Valid @RequestBody ConnectionDto connectionDto) {
        return connectionService.updateConnection(id, connectionDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id:\\d+}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> deleteConnection(@PathVariable Long id) {
        return connectionService.deleteConnection(id)
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }
    
    @GetMapping("/source/{sourceId}")
    public ResponseEntity<List<ConnectionDto>> getConnectionsBySource(@PathVariable Long sourceId) {
        return ResponseEntity.ok(connectionService.getConnectionsBySource(sourceId));
    }
    
    @GetMapping("/target/{targetId}")
    public ResponseEntity<List<ConnectionDto>> getConnectionsByTarget(@PathVariable Long targetId) {
        return ResponseEntity.ok(connectionService.getConnectionsByTarget(targetId));
    }
    
    @GetMapping("/nodes")
    public ResponseEntity<List<ConnectionDto>> getConnectionsBySourceAndTarget(
            @RequestParam Long sourceId, @RequestParam Long targetId) {
        return ResponseEntity.ok(connectionService.getConnectionsBySourceAndTarget(sourceId, targetId));
    }
}