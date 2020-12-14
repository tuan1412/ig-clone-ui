import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
  Alert
} from 'react-bootstrap';
import Button from '../../components/Button'

import api from '../../api/client';

import './style.css';
import { useAuth } from '../../App';

function SignUp() {
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const history = useHistory();

  const { email, password, confirmPassword } = form;
  const [loading, setLoading] = useState(false);

  const handleSumitForm = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const res = await api.post('/auth/register', { username: email, password, confirmPassword });
      setLoading(false);

      if (res && res.success) {
        const { token } = res.data;
        localStorage.setItem('token', token);
        setUser(res.data);
        return history.push('/');
      }
      setError('Something went wrong');
    } catch (error) {
      setError('Something went wrong');
    }
  }

  const handleInputForm = (event) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  return (
    <Container className="Signup" fluid={true}>
      <Row className="vh-100 justify-content-md-center align-items-center">
        <Col xs="12" md="4">
          <Form className="card-wrapper p-4" onSubmit={handleSumitForm}>
            <h4 className="mb-4">MindX Images</h4>
            <div className="mb-4">
              {error && (
                <Form.Group>
                  <Alert variant="danger">{error}</Alert>
                </Form.Group>
              )}
              < Form.Group >
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={handleInputForm}
                />
                <Form.Control.Feedback type="invalid">Looks good!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter your password..."
                  onChange={handleInputForm}
                  value={password}
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password..."
                  onChange={handleInputForm}
                  value={confirmPassword}
                />
              </Form.Group>
            </div>
            <Button loading={loading} type="submit" block color="primary">Đăng ký</Button>
          </Form>
          <div className="card-wrapper mt-4 p-3">
            <div>Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link></div>
          </div>
        </Col>
      </Row>
    </Container >
  )
}

export default SignUp;