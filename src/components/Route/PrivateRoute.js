import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../../App';

function PrivateRoute({ children, ...rest }) {
  const { user } = useAuth();
  const renderComponent = () => {
    if (user && user.username) {
      return children;
    }
    return <Redirect to='/login' />
  }
  return (
    <Route
      {...rest}
      render={renderComponent}
    />
  )
}

export default PrivateRoute;
