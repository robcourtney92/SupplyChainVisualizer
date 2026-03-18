import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { FaInfoCircle, FaFilter } from 'react-icons/fa';
import L from 'leaflet';
import NodeService from '../services/node.service';
import ConnectionService from '../services/connection.service';
import PageHeader from '../components/common/PageHeader';
import MapLegend from '../components/map/MapLegend';
import './SupplyChainMap.css';

// Fix for the marker icons in Leaflet with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different node types
const nodeIcons = {
  factory: new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2942/2942076.png',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  }),
  warehouse: new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1554/1554401.png',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  }),
  store: new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  }),
  supplier: new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1198/1198420.png',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  }),
  default: new L.Icon.Default(),
};

// Colors for connection status
const connectionColors = {
  active: '#3388ff',
  inactive: '#999999',
  delayed: '#ff6b6b',
};

const SupplyChainMap = () => {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([20, 0]); // Default world view
  const [mapZoom, setMapZoom] = useState(2);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    nodeType: '',
    nodeStatus: '',
    connectionType: '',
    connectionStatus: '',
  });
  const [selectedNode, setSelectedNode] = useState(null);
  const [viewMode, setViewMode] = useState('normal'); // Options: normal, risk, performance

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const nodesResponse = await NodeService.getAllNodes();
        const connectionsResponse = await ConnectionService.getAllConnections();
        
        setNodes(nodesResponse.data);
        setConnections(connectionsResponse.data);
        setLoading(false);
        
        // Set map center to the average of all node locations
        if (nodesResponse.data.length > 0) {
          const avgLat = nodesResponse.data.reduce((sum, node) => sum + node.latitude, 0) / nodesResponse.data.length;
          const avgLng = nodesResponse.data.reduce((sum, node) => sum + node.longitude, 0) / nodesResponse.data.length;
          setMapCenter([avgLat, avgLng]);
          setMapZoom(4); // Zoom in a bit after centering
        }
      } catch (err) {
        console.error('Error details:', err);
        if (err.response && err.response.status === 401) {
          setError('Authentication failed. Please login again.');
          // Redirect to login page
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
        } else {
          setError('Failed to load map data. Please try again later.');
        }
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      nodeType: '',
      nodeStatus: '',
      connectionType: '',
      connectionStatus: '',
    });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleViewModeChange = (e) => {
    setViewMode(e.target.value);
  };

  const openNodeDetails = (node) => {
    setSelectedNode(node);
  };

  const closeNodeDetails = () => {
    setSelectedNode(null);
  };

  // Apply filters to nodes and connections
  const filteredNodes = nodes.filter((node) => {
    if (filters.nodeType && node.type !== filters.nodeType) return false;
    if (filters.nodeStatus && node.status !== filters.nodeStatus) return false;
    return true;
  });

  const filteredConnections = connections.filter((connection) => {
    // Check if both source and target nodes pass the node filters
    const sourceNode = nodes.find((node) => node.id === connection.sourceId);
    const targetNode = nodes.find((node) => node.id === connection.targetId);
    
    if (!sourceNode || !targetNode) return false;
    
    if (filters.nodeType) {
      if (sourceNode.type !== filters.nodeType && targetNode.type !== filters.nodeType) {
        return false;
      }
    }
    
    if (filters.nodeStatus) {
      if (sourceNode.status !== filters.nodeStatus && targetNode.status !== filters.nodeStatus) {
        return false;
      }
    }

    if (filters.connectionType && connection.transportationType !== filters.connectionType) {
      return false;
    }

    if (filters.connectionStatus && connection.status !== filters.connectionStatus) {
      return false;
    }

    return true;
  });

  // Get connection color based on viewMode
  const getConnectionColor = (connection) => {
    if (viewMode === 'risk') {
      const riskLevel = connection.riskLevel || 'low';
      return riskLevel === 'high' ? '#ff6b6b' : riskLevel === 'medium' ? '#ffa502' : '#2ecc71';
    } else if (viewMode === 'performance') {
      const perfLevel = connection.performanceLevel || 'medium';
      return perfLevel === 'low' ? '#ff6b6b' : perfLevel === 'medium' ? '#ffa502' : '#2ecc71';
    } else {
      return connectionColors[connection.status] || connectionColors.active;
    }
  };

  // Loading state
  if (loading) {
    return (
      <Container>
        <PageHeader title="Supply Chain Map" />
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading map data...</p>
        </div>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container>
        <PageHeader title="Supply Chain Map" />
        <div className="alert alert-danger my-5" role="alert">
          {error}
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      <PageHeader 
        title="Supply Chain Map" 
        buttonText={showFilters ? "Hide Filters" : "Show Filters"}
        buttonIcon={<FaFilter />}
        onButtonClick={toggleFilters}
      />

      {showFilters && (
        <Card className="mb-4 filters-card">
          <Card.Body className="p-3">
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Node Type</Form.Label>
                  <Form.Select
                    name="nodeType"
                    value={filters.nodeType}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Types</option>
                    <option value="factory">Factory</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="store">Store</option>
                    <option value="supplier">Supplier</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Node Status</Form.Label>
                  <Form.Select
                    name="nodeStatus"
                    value={filters.nodeStatus}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Connection Type</Form.Label>
                  <Form.Select
                    name="connectionType"
                    value={filters.connectionType}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Types</option>
                    <option value="truck">Truck</option>
                    <option value="train">Train</option>
                    <option value="ship">Ship</option>
                    <option value="plane">Plane</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Connection Status</Form.Label>
                  <Form.Select
                    name="connectionStatus"
                    value={filters.connectionStatus}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="delayed">Delayed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>View Mode</Form.Label>
                  <Form.Select
                    name="viewMode"
                    value={viewMode}
                    onChange={handleViewModeChange}
                  >
                    <option value="normal">Normal View</option>
                    <option value="risk">Risk Analysis</option>
                    <option value="performance">Performance Metrics</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={9} className="d-flex align-items-end justify-content-end">
                <Button variant="secondary" onClick={resetFilters} className="me-2">
                  Reset Filters
                </Button>
                <Button variant="primary" onClick={toggleFilters}>
                  Apply Filters
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      <Card>
        <Card.Body style={{ padding: 0 }}>
          <div className="map-container">
            <MapContainer 
              center={mapCenter} 
              zoom={mapZoom} 
              style={{ height: '100%', width: '100%' }}
              whenCreated={(mapInstance) => {
                // Optional: Store map instance if you need to access it later
                // setMap(mapInstance);
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* Render connections */}
              {filteredConnections.map((connection) => {
                const sourceNode = nodes.find(node => node.id === connection.sourceId);
                const targetNode = nodes.find(node => node.id === connection.targetId);
                
                if (!sourceNode || !targetNode) return null;
                
                const positions = [
                  [sourceNode.latitude, sourceNode.longitude],
                  [targetNode.latitude, targetNode.longitude]
                ];
                
                const color = getConnectionColor(connection);
                
                return (
                  <Polyline
                    key={connection.id}
                    positions={positions}
                    color={color}
                    weight={3}
                    opacity={0.7}
                  />
                );
              })}
              
              {/* Render nodes */}
              {filteredNodes.map((node) => (
                <Marker
                  key={node.id}
                  position={[node.latitude, node.longitude]}
                  icon={nodeIcons[node.type.toLowerCase()] || nodeIcons.default}
                  eventHandlers={{
                    click: () => {
                      openNodeDetails(node);
                    },
                  }}
                >
                  <Popup>
                    <div>
                      <h6>{node.name}</h6>
                      <p>Type: {node.type}</p>
                      <p>Status: {node.status}</p>
                      <Button 
                        size="sm" 
                        variant="info" 
                        onClick={(e) => {
                          e.stopPropagation();
                          openNodeDetails(node);
                        }}
                      >
                        <FaInfoCircle className="me-1" /> Details
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {/* Add Map Legend */}
              <MapLegend viewMode={viewMode} />
            </MapContainer>
          </div>
        </Card.Body>
      </Card>

      {/* Node Details Modal */}
      <Modal show={!!selectedNode} onHide={closeNodeDetails} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedNode?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNode && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <p><strong>Type:</strong> {selectedNode.type}</p>
                  <p><strong>Status:</strong> {selectedNode.status}</p>
                  <p><strong>Capacity:</strong> {selectedNode.capacity || 'N/A'}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Latitude:</strong> {selectedNode.latitude}</p>
                  <p><strong>Longitude:</strong> {selectedNode.longitude}</p>
                  <p><strong>Created At:</strong> {new Date(selectedNode.createdAt).toLocaleString()}</p>
                </Col>
              </Row>
              <hr />
              <h5>Connections</h5>
              <p>Coming from this node:</p>
              {connections.filter(conn => conn.sourceId === selectedNode.id).length > 0 ? (
                <ul>
                  {connections.filter(conn => conn.sourceId === selectedNode.id).map(conn => {
                    const targetNode = nodes.find(n => n.id === conn.targetId);
                    return (
                      <li key={`outgoing-${conn.id}`}>
                        To {targetNode?.name} via {conn.transportationType} ({conn.status})
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-muted">No outgoing connections</p>
              )}
              
              <p>Coming to this node:</p>
              {connections.filter(conn => conn.targetId === selectedNode.id).length > 0 ? (
                <ul>
                  {connections.filter(conn => conn.targetId === selectedNode.id).map(conn => {
                    const sourceNode = nodes.find(n => n.id === conn.sourceId);
                    return (
                      <li key={`incoming-${conn.id}`}>
                        From {sourceNode?.name} via {conn.transportationType} ({conn.status})
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-muted">No incoming connections</p>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeNodeDetails}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              closeNodeDetails();
              window.location.href = `/nodes/${selectedNode.id}`;
            }}
          >
            View Full Details
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SupplyChainMap;
