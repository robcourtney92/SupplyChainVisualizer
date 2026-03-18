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
            Optional<Node> sourceOpt = nodeRepository.findById(connectionDto.getSourceId());
            Optional<Node> targetOpt = nodeRepository.findById(connectionDto.getTargetId());

            sourceOpt.ifPresent(existingConnection::setSource);
            targetOpt.ifPresent(existingConnection::setTarget);

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
        Optional<Node> sourceOpt = nodeRepository.findById(dto.getSourceId());
        Optional<Node> targetOpt = nodeRepository.findById(dto.getTargetId());

        sourceOpt.ifPresent(connection::setSource);
        targetOpt.ifPresent(connection::setTarget);

        connection.setTransportationType(dto.getTransportationType());
        connection.setDistance(dto.getDistance());
        connection.setTravelTime(dto.getTravelTime());
        connection.setCostPerUnit(dto.getCostPerUnit());
        connection.setStatus(dto.getStatus());
        return connection;
    }
}
