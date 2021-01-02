import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
  Alert
} from 'react-bootstrap';
import Button from '../../components/Button'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import api from '../../api/client';

import './style.css';
import { useAuth } from '../../App';

const schema = yup.object().shape({
  username: yup
    .string()
    .email(),
  password: yup
    .string()
    .min(6),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'confirm password not match')
});

function SignUp() {
  const { login } = useAuth();
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const onSubmit = async (form) => {
    const { email, password, confirmPassword } = form;

    try {
      setLoading(true);
      const res = await api.post('/auth/register', { username: email, password, confirmPassword });
      setLoading(false);
      if (res && res.success) {
        const { token, ...user } = res.data;
        login({ user, token });
      }
      setError('Something went wrong');
    } catch (error) {
      setError('Something went wrong');
      setLoading(false);
    }
  }

  return (
    <Container className="Signup" fluid={true}>
      <Row className="vh-100 justify-content-md-center align-items-center">
        <Col xs="12" md="4">
          <Form className="card-wrapper p-4" onSubmit={handleSubmit(onSubmit)}>
            <h4 className="mb-4">MindX Images</h4>
            <div className="mb-4">
              {error && (
                <Form.Group>
                  <Alert
                    variant="danger"
                    onClose={() => setError('')}
                    dismissible>
                    {error}
                  </Alert>
                </Form.Group>
              )}
              <Form.Group >
                <Form.Control
                  ref={register}
                  name="username"
                  placeholder="Enter your email..."
                  isInvalid={errors.username}
                />
                {errors.username && (
                  <Form.Control.Feedback type="invalid">
                    {errors.username.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <Form.Group>
                <Form.Control
                  ref={register}
                  type="password"
                  name="password"
                  placeholder="Enter your password..."
                  isInvalid={errors.password}
                />
                {errors.password && (
                  <Form.Control.Feedback type="invalid">
                    {errors.password.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <Form.Group>
                <Form.Control
                  ref={register}
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password..."
                  isInvalid={errors.confirmPassword}
                />
                {errors.confirmPassword && (
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </div>
            <Button loading={loading} type="submit" block color="primary">Sign up</Button>
          </Form>
          <div className="card-wrapper mt-4 p-3">
            <div>Had account? <Link to="/login">Login here</Link></div>
          </div>
        </Col>
      </Row>
    </Container >
  )
}

export default SignUp;