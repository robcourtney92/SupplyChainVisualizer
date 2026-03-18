package com.example.supplychainvisualizer.controller;

import com.example.supplychainvisualizer.dto.NodeDto;
//import com.example.supplychainvisualizer.model.Node;
import com.example.supplychainvisualizer.service.NodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/nodes")
public class NodeController {
    
    @Autowired
    private NodeService nodeService;
    
    @GetMapping
    public ResponseEntity<List<NodeDto>> getAllNodes() {
        return ResponseEntity.ok(nodeService.getAllNodes());
    }
    
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<NodeDto> getNodeById(@PathVariable Long id) {
        return nodeService.getNodeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<NodeDto> createNode(@Valid @RequestBody NodeDto nodeDto) {
        return ResponseEntity.ok(nodeService.createNode(nodeDto));
    }
    
    @PutMapping("/{id:\\d+}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<NodeDto> updateNode(@PathVariable Long id, @Valid @RequestBody NodeDto nodeDto) {
        return nodeService.updateNode(id, nodeDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id:\\d+}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> deleteNode(@PathVariable Long id) {
        return nodeService.deleteNode(id)
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<NodeDto>> getNodesByType(@PathVariable String type) {
        return ResponseEntity.ok(nodeService.getNodesByType(type));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<NodeDto>> getNodesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(nodeService.getNodesByStatus(status));
    }
}
