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
import { useAuth } from '../../App';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin from 'react-google-login';
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";
import LoadingPage from '../../components/LoadingPage';

import './style.css';

function Login() {
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingOauth, setLoadingOauth] = useState(false);

  const history = useHistory();

  const { email, password } = form;

  const handleInputForm = (event) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSumitForm = async () => {
    try {
      setLoading(true);
      const res = await api.post('/auth/login', { username: email, password });
      setLoading(false);
      if (res && res.success) {
        const { token } = res.data;
        localStorage.setItem('token', token);
        setUser(res.data)
        return history.push('/');
      }
      setError('Something went wrong');
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError('Something went wrong');
    }
  }

  const responseGoogle = async (response) => {
    try {
      setLoadingOauth(true);
      const { profileObj: { email }, googleId } = response;
      const res = await api.post('/auth/login/oauth', { oauthId: googleId, username: email });
      setLoadingOauth(false);
      if (res && res.success) {
        const { token } = res.data;
        localStorage.setItem('token', token);
        setUser(res.data)
        return history.push('/');
      }
      setError('Something went wrong');
    } catch (error) {
      console.log(error);
      setLoadingOauth(false);
      setError('Something went wrong');
    }
  }

  const responseFacebook = async (response) => {
    try {
      setLoadingOauth(true);
      const { email, id } = response;
      const res = await api.post('/auth/login/oauth', { oauthId: id, username: email });
      if (res && res.success) {
        setLoadingOauth(false);
        const { token } = res.data;
        localStorage.setItem('token', token);
        setUser(res.data)
        return history.push('/');
      }
      setError('Something went wrong');
    } catch (error) {
      console.log(error);
      setLoadingOauth(false);
      setError('Something went wrong');
    }
  }

  if (loadingOauth) {
    return <LoadingPage />
  };

  return (
    <Container className="Login" fluid>
      <Row className="vh-100 justify-content-md-center align-items-center">
        <Col xs="12" md="4">
          <Form className="card-wrapper p-4" onSubmit={(event) => event.preventDefault()}>
            <h4 className="mb-4">MindX Images</h4>
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
            <Button onClick={handleSumitForm} loading={loading} type="submit" block variant="primary">Đăng nhập</Button>
            <div className="text-center my-3">Or login with</div>
            <div className="social-button">
              <FacebookLogin
                appId={process.env.REACT_APP_FB_APP_ID}
                fields="name,email,picture"
                callback={responseFacebook}
                redirectUri={'https://mindx-images-ui.herokuapp.com/login'}
                render={FacebookLoginButton}
              />
              <GoogleLogin
                clientId={process.env.REACT_APP_GG_CLIENT_ID}
                render={GoogleLoginButton}
                onSuccess={responseGoogle}
                cookiePolicy={'single_host_origin'}
              />
            </div>
          </Form>
          <div className="card-wrapper mt-4 p-3">
            <div>Bạn không có tài khoản? <Link to="/signup">Đăng ký</Link></div>
          </div>
        </Col>
      </Row>
    </Container >
  )
}

export default Login;