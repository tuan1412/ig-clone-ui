import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert
} from 'react-bootstrap';
import api from '../../api/client';

import './style.css';
import { useAuth } from '../../App';

function Login() {
  const { setUser } = useAuth(); 
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const history = useHistory();

  const { email, password } = form;

  const handleInputForm = (event) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSumitForm = async (event) => {
    event.preventDefault();
    try {
      const res = await api.post('/auth/login', { username: email, password });
      if (res && res.success) {
        const { token } = res.data;
        localStorage.setItem('token', token);
        setUser(res.data)
        return history.push('/');
      }
      setError('Something went wrong');
    } catch (error) {
      console.log(error);
      setError('Something went wrong');
    }
  }

  return (
    <Container className="Login" fluid>
      <Row className="vh-100 justify-content-md-center align-items-center">
        <Col xs="12" md="4">
          <Form className="card-wrapper p-4" onSubmit={handleSumitForm}>
            <h4 className="mb-4">MindX Girls</h4>
            <div className="mb-4">
              {error && (
                <Form.Group>
                  <Alert variant="danger">{error}</Alert>
                </Form.Group>
              )}
              <Form.Group>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={handleInputForm}
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter your password..."
                  value={password}
                  onChange={handleInputForm} />
              </Form.Group>
            </div>
            <Button type="submit" block variant="primary">Đăng nhập</Button>
          </Form>
          <div className="card-wrapper mt-4 p-3">
            <div>Bạn không có tài khoản? <Link to="/signup">Đăng ký</Link></div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Login;