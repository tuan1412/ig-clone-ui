import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
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
  return (
    <div className="CustomNavbar">
      <Container>
        <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
          <Navbar.Brand href="#home">Mindx Girls</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              {!user && (
                <>
                  <Nav.Link href="#home">Login</Nav.Link>
                  <Nav.Link href="#link">Sign up</Nav.Link>
                </>
              )}
            </Nav>
            {user && (
              <Nav>
                <NavDropdown title="Welcome tuan@gmail.com" id="collasible-nav-dropdown">
                  <NavDropdown.Item>Upload</NavDropdown.Item>
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