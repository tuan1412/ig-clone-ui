import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../../App';

function GuessRoute({ children, ...rest }) {
  const { user } = useAuth();
  const renderComponent = () => {
    if (user && user.username) {
      return <Redirect to='/' />;
    }
    return children;
  }
  return (
    <Route
      {...rest}
      render={renderComponent}
    />
  )
}

export default GuessRoute;
