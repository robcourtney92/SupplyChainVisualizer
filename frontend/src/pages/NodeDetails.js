import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Spinner, Alert, Tabs, Tab } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaSyncAlt, FaArrowLeft, FaPlus, FaBoxOpen, FaTruck } from 'react-icons/fa';
import { useParams, useNavigate, Link } from 'react-router-dom';
import NodeService from '../services/node.service';
import InventoryService from '../services/inventory.service';
import ConnectionService from '../services/connection.service';
import ShipmentService from '../services/shipment.service';
import PageHeader from '../components/common/PageHeader';
import NodeModal from '../components/map/NodeModal';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';
import './NodeDetails.css';

const NodeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [node, setNode] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [connections, setConnections] = useState([]);
  const [incomingShipments, setIncomingShipments] = useState([]);
  const [outgoingShipments, setOutgoingShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadNodeData();
  }, [id]);

  const loadNodeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch node details
      const nodeResponse = await NodeService.getNodeById(id);
      setNode(nodeResponse.data);
      
      // Fetch related data
      const inventoryResponse = await InventoryService.getInventoryByNode(id);
      setInventory(inventoryResponse.data);
      
      const connectionsResponse = await ConnectionService.getAllConnections();
      // Filter connections related to this node
      const nodeConnections = connectionsResponse.data.filter(
        connection => connection.sourceId.toString() === id || connection.targetId.toString() === id
      );
      setConnections(nodeConnections);
      
      // Fetch shipments
      const shipmentsResponse = await ShipmentService.getAllShipments();
      // Filter shipments related to this node
      const incoming = shipmentsResponse.data.filter(
        shipment => shipment.destinationId.toString() === id
      );
      const outgoing = shipmentsResponse.data.filter(
        shipment => shipment.sourceId.toString() === id
      );
      setIncomingShipments(incoming);
      setOutgoingShipments(outgoing);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load node details');
      setLoading(false);
      console.error(err);
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleUpdateNode = async (updatedNode) => {
    try {
      await NodeService.updateNode(id, updatedNode);
      
      // Update local state
      setNode(updatedNode);
      
      // Close modal
      setShowEditModal(false);
    } catch (err) {
      console.error('Failed to update node:', err);
      alert('Failed to update node. Please try again.');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await NodeService.deleteNode(id);
      
      // Navigate back to nodes list
      navigate('/nodes');
    } catch (err) {
      console.error('Failed to delete node:', err);
      alert('Failed to delete node. Please try again.');
    }
  };

  const getNodeTypeName = (type) => {
    switch (type) {
      case 'factory':
        return 'Factory';
      case 'warehouse':
        return 'Warehouse';
      case 'store':
        return 'Store';
      case 'supplier':
        return 'Supplier';
      default:
        return type;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Active</Badge>;
      case 'warning':
        return <Badge bg="warning">Warning</Badge>;
      case 'critical':
        return <Badge bg="danger">Critical</Badge>;
      case 'inactive':
        return <Badge bg="secondary">Inactive</Badge>;
      default:
        return <Badge bg="info">{status}</Badge>;
    }
  };

  const getConnectionDirection = (connection) => {
    if (connection.sourceId.toString() === id) {
      return 'outgoing';
    } else {
      return 'incoming';
    }
  };

  const getShipmentStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'in_transit':
        return <Badge bg="info">In Transit</Badge>;
      case 'delivered':
        return <Badge bg="success">Delivered</Badge>;
      case 'delayed':
        return <Badge bg="danger">Delayed</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getInventoryStatusBadge = (status) => {
    switch (status) {
      case 'optimal':
        return <Badge bg="success">Optimal</Badge>;
      case 'low':
        return <Badge bg="warning">Low</Badge>;
      case 'critical':
        return <Badge bg="danger">Critical</Badge>;
      case 'excess':
        return <Badge bg="info">Excess</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  // Show loading spinner
  if (loading && !node) {
    return (
      <Container>
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading node details...</p>
        </div>
      </Container>
    );
  }

  // Show error message
  if (error) {
    return (
      <Container>
        <div className="my-5">
          <Alert variant="danger">
            <Alert.Heading>Error Loading Node Details</Alert.Heading>
            <p>{error}</p>
            <div>
              <Button variant="outline-danger" onClick={loadNodeData} className="me-2">
                Try Again
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate('/nodes')}>
                Back to Nodes
              </Button>
            </div>
          </Alert>
        </div>
      </Container>
    );
  }

  if (!node) {
    return (
      <Container>
        <div className="my-5">
          <Alert variant="warning">
            <Alert.Heading>Node Not Found</Alert.Heading>
            <p>The node you're looking for could not be found.</p>
            <Button variant="outline-secondary" onClick={() => navigate('/nodes')}>
              Back to Nodes
            </Button>
          </Alert>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      <PageHeader title={node.name}>
        <Button 
          variant="outline-secondary" 
          onClick={() => navigate('/nodes')}
          className="me-2"
        >
          <FaArrowLeft /> Back to Nodes
        </Button>
        <Button 
          variant="outline-primary" 
          onClick={handleEdit}
          className="me-2"
        >
          <FaEdit /> Edit
        </Button>
        <Button 
          variant="outline-danger" 
          onClick={handleDelete}
        >
          <FaTrashAlt /> Delete
        </Button>
      </PageHeader>
      
      <Row className="mb-4">
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Node Information</h5>
            </Card.Header>
            <Card.Body>
              <table className="table table-details">
                <tbody>
                  <tr>
                    <th>ID</th>
                    <td>{node.id}</td>
                  </tr>
                  <tr>
                    <th>Name</th>
                    <td>{node.name}</td>
                  </tr>
                  <tr>
                    <th>Type</th>
                    <td>{getNodeTypeName(node.type)}</td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>{getStatusBadge(node.status)}</td>
                  </tr>
                  <tr>
                    <th>Capacity</th>
                    <td>{node.capacity || 'Not specified'}</td>
                  </tr>
                  <tr>
                    <th>Location</th>
                    <td>
                      {node.latitude}, {node.longitude}
                      <div className="text-muted small">
                        <a 
                          href={`https://www.google.com/maps?q=${node.latitude},${node.longitude}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View on Google Maps
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>Created</th>
                    <td>{new Date(node.createdAt).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th>Last Updated</th>
                    <td>{new Date(node.updatedAt).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Connections</h5>
              <Link to="/connections" className="btn btn-sm btn-outline-primary">
                <FaPlus /> Add Connection
              </Link>
            </Card.Header>
            <Card.Body className="p-0">
              {connections.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No connections found</p>
                </div>
              ) : (
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Direction</th>
                      <th>Connected To</th>
                      <th>Transport</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {connections.map(connection => {
                      const direction = getConnectionDirection(connection);
                      const connectedNodeId = direction === 'outgoing' 
                        ? connection.targetId 
                        : connection.sourceId;
                      const connectedNodeName = direction === 'outgoing' 
                        ? connection.targetName 
                        : connection.sourceName;
                        
                      return (
                        <tr key={connection.id}>
                          <td>
                            {direction === 'outgoing' ? 'Outgoing →' : '← Incoming'}
                          </td>
                          <td>
                            <Link to={`/nodes/${connectedNodeId}`}>
                              {connectedNodeName || `Node ${connectedNodeId}`}
                            </Link>
                          </td>
                          <td>{connection.transportationType}</td>
                          <td>{connection.travelTime} hrs</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card>
            <Card.Header>
              <Tabs defaultActiveKey="inventory" className="mb-0 card-tabs">
                <Tab eventKey="inventory" title="Inventory">
                  <div className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Current Inventory</h5>
                      <Link to="/inventory" className="btn btn-sm btn-outline-primary">
                        <FaPlus /> Add Inventory
                      </Link>
                    </div>
                    
                    {inventory.length === 0 ? (
                      <Alert variant="info">
                        No inventory data available for this node.
                      </Alert>
                    ) : (
                      <Table responsive hover>
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Min Threshold</th>
                            <th>Max Threshold</th>
                            <th>Status</th>
                            <th>Last Updated</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inventory.map(item => (
                            <tr key={item.id}>
                              <td>
                                <Link to={`/products/${item.productId}`}>
                                  {item.productName}
                                </Link>
                              </td>
                              <td>{item.quantity}</td>
                              <td>{item.minThreshold || '-'}</td>
                              <td>{item.maxThreshold || '-'}</td>
                              <td>{getInventoryStatusBadge(item.status)}</td>
                              <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </div>
                </Tab>
                <Tab eventKey="incoming" title="Incoming Shipments">
                  <div className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Incoming Shipments</h5>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={loadNodeData}
                      >
                        <FaSyncAlt /> Refresh
                      </Button>
                    </div>
                    
                    {incomingShipments.length === 0 ? (
                      <Alert variant="info">
                        No incoming shipments for this node.
                      </Alert>
                    ) : (
                      <Table responsive hover>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>From</th>
                            <th>Status</th>
                            <th>Departure</th>
                            <th>Expected Arrival</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {incomingShipments.map(shipment => (
                            <tr key={shipment.id}>
                              <td>#{shipment.id}</td>
                              <td>
                                <Link to={`/nodes/${shipment.sourceId}`}>
                                  {shipment.sourceName}
                                </Link>
                              </td>
                              <td>{getShipmentStatusBadge(shipment.status)}</td>
                              <td>
                                {shipment.departureDate 
                                  ? new Date(shipment.departureDate).toLocaleDateString() 
                                  : '-'}
                              </td>
                              <td>
                                {shipment.estimatedArrival 
                                  ? new Date(shipment.estimatedArrival).toLocaleDateString() 
                                  : '-'}
                              </td>
                              <td>
                                <Link to={`/shipments/${shipment.id}`} className="btn btn-sm btn-outline-info">
                                  Details
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </div>
                </Tab>
                <Tab eventKey="outgoing" title="Outgoing Shipments">
                  <div className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Outgoing Shipments</h5>
                      <div>
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={loadNodeData}
                          className="me-2"
                        >
                          <FaSyncAlt /> Refresh
                        </Button>
                        <Link to="/shipments/new" className="btn btn-sm btn-outline-primary">
                          <FaPlus /> New Shipment
                        </Link>
                      </div>
                    </div>
                    
                    {outgoingShipments.length === 0 ? (
                      <Alert variant="info">
                        No outgoing shipments from this node.
                      </Alert>
                    ) : (
                      <Table responsive hover>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>To</th>
                            <th>Status</th>
                            <th>Departure</th>
                            <th>Expected Arrival</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {outgoingShipments.map(shipment => (
                            <tr key={shipment.id}>
                              <td>#{shipment.id}</td>
                              <td>
                                <Link to={`/nodes/${shipment.destinationId}`}>
                                  {shipment.destinationName}
                                </Link>
                              </td>
                              <td>{getShipmentStatusBadge(shipment.status)}</td>
                              <td>
                                {shipment.departureDate 
                                  ? new Date(shipment.departureDate).toLocaleDateString() 
                                  : '-'}
                              </td>
                              <td>
                                {shipment.estimatedArrival 
                                  ? new Date(shipment.estimatedArrival).toLocaleDateString() 
                                  : '-'}
                              </td>
                              <td>
                                <Link to={`/shipments/${shipment.id}`} className="btn btn-sm btn-outline-info">
                                  Details
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </div>
                </Tab>
              </Tabs>
            </Card.Header>
          </Card>
        </Col>
      </Row>
      
      {/* Edit Node Modal */}
      <NodeModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        node={node}
        onSave={handleUpdateNode}
        isNew={false}
      />
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Node"
        message={`Are you sure you want to delete the node "${node.name}"? This action will also remove all associated connections, inventory records, and references in shipments. This cannot be undone.`}
      />
    </Container>
  );
};

export default NodeDetails;
