import React from 'react';
import { Container, Card } from 'react-bootstrap';
import PageHeader from '../components/common/PageHeader';

const ShipmentForm = () => {
  return (
    <Container fluid>
      <PageHeader title="New Shipment" />
      <Card>
        <Card.Body>
          <p>Shipment creation form will be displayed here.</p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ShipmentForm;
