package com.example.supplychainvisualizer.service.impl;

import com.example.supplychainvisualizer.dto.ConnectionDto;
import com.example.supplychainvisualizer.model.Connection;
import com.example.supplychainvisualizer.model.Node;
import com.example.supplychainvisualizer.repository.ConnectionRepository;
import com.example.supplychainvisualizer.repository.NodeRepository;
import com.example.supplychainvisualizer.service.ConnectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ConnectionServiceImpl implements ConnectionService {

    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private NodeRepository nodeRepository;

    @Override
    public List<ConnectionDto> getAllConnections() {
        return connectionRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ConnectionDto> getConnectionById(Long id) {
        return connectionRepository.findById(id).map(this::convertToDto);
    }

    @Override
    public ConnectionDto createConnection(ConnectionDto connectionDto) {
        Connection connection = convertToEntity(connectionDto);
        Connection savedConnection = connectionRepository.save(connection);
        return convertToDto(savedConnection);
    }

    @Override
    public Optional<ConnectionDto> updateConnection(Long id, ConnectionDto connectionDto) {
        return connectionRepository.findById(id).map(existingConnection -> {
            Node source = nodeRepository.findById(connectionDto.getSourceId())
                    .orElseThrow(() -> new IllegalArgumentException("Source node not found with id: " + connectionDto.getSourceId()));
            Node target = nodeRepository.findById(connectionDto.getTargetId())
                    .orElseThrow(() -> new IllegalArgumentException("Target node not found with id: " + connectionDto.getTargetId()));

            existingConnection.setSource(source);
            existingConnection.setTarget(target);

            existingConnection.setTransportationType(connectionDto.getTransportationType());
            existingConnection.setDistance(connectionDto.getDistance());
            existingConnection.setTravelTime(connectionDto.getTravelTime());
            existingConnection.setCostPerUnit(connectionDto.getCostPerUnit());
            existingConnection.setStatus(connectionDto.getStatus());

            Connection updatedConnection = connectionRepository.save(existingConnection);
            return convertToDto(updatedConnection);
        });
    }

    @Override
    public boolean deleteConnection(Long id) {
        return connectionRepository.findById(id).map(connection -> {
            connectionRepository.delete(connection);
            return true;
        }).orElse(false);
    }

    @Override
    public List<ConnectionDto> getConnectionsBySource(Long sourceId) {
        return nodeRepository.findById(sourceId)
                .map(node -> connectionRepository.findBySource(node).stream()
                        .map(this::convertToDto)
                        .collect(Collectors.toList()))
                .orElse(List.of());
    }

    @Override
    public List<ConnectionDto> getConnectionsByTarget(Long targetId) {
        return nodeRepository.findById(targetId)
                .map(node -> connectionRepository.findByTarget(node).stream()
                        .map(this::convertToDto)
                        .collect(Collectors.toList()))
                .orElse(List.of());
    }

    @Override
    public List<ConnectionDto> getConnectionsBySourceAndTarget(Long sourceId, Long targetId) {
        Optional<Node> sourceOpt = nodeRepository.findById(sourceId);
        Optional<Node> targetOpt = nodeRepository.findById(targetId);

        if (sourceOpt.isPresent() && targetOpt.isPresent()) {
            return connectionRepository.findBySourceAndTarget(sourceOpt.get(), targetOpt.get()).stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        }
        return List.of();
    }

    private ConnectionDto convertToDto(Connection connection) {
        ConnectionDto dto = new ConnectionDto();
        dto.setId(connection.getId());
        dto.setSourceId(connection.getSource().getId());
        dto.setTargetId(connection.getTarget().getId());
        dto.setTransportationType(connection.getTransportationType());
        dto.setDistance(connection.getDistance());
        dto.setTravelTime(connection.getTravelTime());
        dto.setCostPerUnit(connection.getCostPerUnit());
        dto.setStatus(connection.getStatus());
        return dto;
    }

    private Connection convertToEntity(ConnectionDto dto) {
        Connection connection = new Connection();
        Node source = nodeRepository.findById(dto.getSourceId())
                .orElseThrow(() -> new IllegalArgumentException("Source node not found with id: " + dto.getSourceId()));
        Node target = nodeRepository.findById(dto.getTargetId())
                .orElseThrow(() -> new IllegalArgumentException("Target node not found with id: " + dto.getTargetId()));

        connection.setSource(source);
        connection.setTarget(target);

        connection.setTransportationType(dto.getTransportationType());
        connection.setDistance(dto.getDistance());
        connection.setTravelTime(dto.getTravelTime());
        connection.setCostPerUnit(dto.getCostPerUnit());
        connection.setStatus(dto.getStatus());
        return connection;
    }
}
