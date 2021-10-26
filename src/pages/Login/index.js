import { Link, useLocation } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
} from 'react-bootstrap';
// import GoogleLogin from 'react-google-login';
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
// import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Button from '../../components/Button'
import LoadingPage from '../../components/LoadingPage';

import { useLogin } from '../../hooks/useAuth';

import './style.css';

const schema = yup.object().shape({
  username: yup
    .string()
    .email(),
  password: yup
    .string()
    .min(6)
});

function Login() {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  // const { search } = useLocation();

  const { isLoading, mutate } = useLogin();
  // const { isLoading: loadingOauth, mutate:mutateOauth } = useLoginOauth();

  const onSubmit = async (form) => {
    mutate(form);
  }

  // const responseGoogle = async (response) => {
  //   const { profileObj: { email }, googleId } = response;
  //   mutateOauth({ oauthId: googleId, username: email }) 
  // }

  // const responseFacebook = async (response) => {
  //   const { email, id } = response;

  //   mutateOauth({ oauthId: id, username: email }) 
  // }

  // if (loadingOauth && search) {
  //   return <LoadingPage />
  // };

  return (
    <Container className="Login" fluid>
      <Row className="vh-100 justify-content-md-center align-items-center">
        <Col xs="12" md="4">
          <div className="card-wrapper p-4">
            <Form onSubmit={handleSubmit(onSubmit)} noValidate>
              <h4 className="mb-4">MindX Images</h4>
              <div className="mb-4">
                <Form.Group>
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
              </div>
              <Button loading={isLoading || loadingOauth} type="submit" block variant="primary">Đăng nhập</Button>
            </Form>
            {/* <div className="text-center my-3">Or login with</div> */}
            {/* <div className="social-button">
              <FacebookLogin
                appId={process.env.REACT_APP_FB_APP_ID}
                fields="name,email,picture"
                callback={responseFacebook}
                redirectUri={process.env.REACT_APP_FB_REDIRECT || window.location.href}
                render={FacebookLoginButton}
              />
              <GoogleLogin
                clientId={process.env.REACT_APP_GG_CLIENT_ID}
                render={GoogleLoginButton}
                onSuccess={responseGoogle}
                redirectUri={process.env.REACT_APP_GG_REDIRECT || window.location.href}
                cookiePolicy={'single_host_origin'}
              />
            </div> */}
          </div>
          <div className="card-wrapper mt-4 p-3">
            <div>No account? <Link to="/signup">Sign up here</Link></div>
          </div>
        </Col>
      </Row>
    </Container >
  )
}

export default Login;