import { Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
  Alert
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Button from '../../components/Button'

import { useSignup } from '../../hooks/useAuth';

import './style.css';

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
  const { mutate, isLoading, error } = useSignup();
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (form) => {
    mutate(form)
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
                    dismissible
                  >
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
            <Button loading={isLoading} type="submit" block color="primary">Sign up</Button>
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