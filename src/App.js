import { useEffect, createContext, useContext, useRef } from 'react';
import { Route, Switch } from 'react-router-dom';
import socketIOClient from 'socket.io-client';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ImageList from './pages/ImageList';
import UploadImage from './pages/UploadImage';
import DetailImage from './pages/DetailImage';

import LoadingPage from './components/LoadingPage';
import PrivateRoute from './components/Route/PrivateRoute';
import GuessRoute from './components/Route/GuessRoute';

import { useVerifyAuth } from './hooks/useAuth'

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export const AuthContext = createContext();
export const SocketContext = createContext();

function App() {
  const { user, verifying } = useVerifyAuth();
  console.log('render');
  const socket = useRef();

  useEffect(() => {
    try {
      socket.current = socketIOClient(process.env.REACT_APP_SERVER_REALTIME_URL);
      console.log('connect socket success');

    } catch (err) {
      console.log('connect socket fail', err);
    }
  }, []);

  if (verifying) {
    return <LoadingPage />
  };

  return (
    <AuthContext.Provider value={{ user }}>
      <SocketContext.Provider value={socket.current}>
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
      </SocketContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useSocket() {
  return useContext(SocketContext);
}

export default App;
