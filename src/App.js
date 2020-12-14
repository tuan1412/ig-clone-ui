import { useState, useEffect, createContext, useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ImageList from './pages/ImageList';

import api from './api/client';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import LoadingPage from './components/LoadingPage';
import PrivateRoute from './components/Route/PrivateRoute';
import GuessRoute from './components/Route/GuessRoute';

import UploadImage from './pages/UploadImage';
import DetailImage from './pages/DetailImage';

export const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [verifying, setVerifying] = useState(true);

  const fetchUserInfo = async () => {
    const accessToken = localStorage.getItem('token');
    if (!accessToken) {
      return setVerifying(false);
    }
    try {
      const res = await api.get('/auth/verify');
      if (res.success) {
        setUser(res.data);
        setVerifying(false);
      } else {
        setVerifying(false);
      }
    } catch (err) {
      setVerifying(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  if (verifying) {
    return <LoadingPage />
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <div className="App">
        <Switch>
          <Route path="/" exact>
            <ImageList />
          </Route>
          <GuessRoute path="/login">
            <Login />
          </GuessRoute>
          <GuessRoute path="/signup">
            <Signup />
          </GuessRoute>
          <PrivateRoute path="/upload">
            <UploadImage />
          </PrivateRoute>
          <Route path="/images/:id">
            <DetailImage />
          </Route>
        </Switch>
      </div>
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}

export default App;
