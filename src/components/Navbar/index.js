import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../../App';
import './style.css';

function CustomNavbar() {
  const { user, setUser } = useAuth();
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    history.push('/login');
  }

  const handleUpload = () => {
    history.push('/upload');
  }

  const onGoToHome = () => {
    history.push('/');
  }

  return (
    <div className="CustomNavbar">
      <Container>
        <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
          <Navbar.Brand onClick={onGoToHome}>Mindx Images</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              {!user && (
                <>
                  <Nav.Link>
                    <Link to="/login">Login</Link>
                  </Nav.Link>
                  <Nav.Link>
                    <Link to="/login">Sign up</Link>
                  </Nav.Link>
                </>
              )}
            </Nav>
            {user && (
              <Nav>
                <NavDropdown title={`Welcome ${user.username}`} id="collasible-nav-dropdown">
                  <NavDropdown.Item onClick={handleUpload}>Upload</NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            )}
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </div>
  )
}

export default CustomNavbar;