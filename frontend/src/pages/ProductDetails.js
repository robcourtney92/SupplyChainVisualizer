import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';

const ProductDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  return (
    <Container fluid>
      <PageHeader title="Product Details" />
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Card>
          <Card.Body>
            <h5>Product #{id}</h5>
            <p>Product details will be displayed here.</p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default ProductDetails;
