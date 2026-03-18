import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import './Auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [successful, setSuccessful] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    
    setMessage('');
    setLoading(true);
    setSuccessful(false);

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    AuthService.register(username, email, password)
      .then(() => {
        setSuccessful(true);
        setMessage('Registration successful! You can now log in.');
        setLoading(false);
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
        setLoading(false);
      });
  };

  return (
    <div className="auth-wrapper">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="auth-card">
              <Card.Body>
                <div className="login-content">
                  <div className="text-center header-spacing">
                    <h2 className="auth-title">Supply Chain Visualizer</h2>
                    <p className="auth-subtitle">Create a new account</p>
                  </div>

                  {message && (
                    <Alert 
                      variant={successful ? 'success' : 'danger'} 
                      className="mb-4"
                    >
                      {message}
                    </Alert>
                  )}

                  <Form onSubmit={handleRegister}>
                    <Form.Group className="form-group-spacing">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        minLength="3"
                        maxLength="20"
                        className="form-input"
                      />
                    </Form.Group>

                    <Form.Group className="form-group-spacing">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-input"
                      />
                    </Form.Group>

                    <Form.Group className="form-group-spacing">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="6"
                        className="form-input"
                      />
                    </Form.Group>

                    <Form.Group className="form-group-spacing">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="form-input"
                      />
                    </Form.Group>

                    <div className="button-spacing">
                      <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={loading || successful}
                        className="sign-in-button"
                      >
                        {loading ? 'Loading...' : 'Sign Up'}
                      </Button>
                    </div>

                    <div className="text-center footer-spacing">
                      <p>
                        Already have an account? <Link to="/login">Sign in</Link>
                      </p>
                    </div>
                  </Form>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
