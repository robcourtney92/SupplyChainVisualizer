import React, { useState } from 'react';
import { Container, Card, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';

const ShipmentDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  return (
    <Container fluid>
      <PageHeader title="Shipment Details" />
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Card>
          <Card.Body>
            <h5>Shipment #{id}</h5>
            <p>Shipment details will be displayed here.</p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default ShipmentDetails;
