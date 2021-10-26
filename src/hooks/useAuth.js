import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import api from '../api/client';

export const useUser = () => {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData('user')

  return user;
}

export const useVerifyAuth = () => {
  const { isLoading, data: authInfo, isFetched } = useQuery(
    'user',
    async () => {
      const accessToken = localStorage.getItem('token');
      if (!accessToken) {
        return null;
      }

      try {
        const res = await api.get('/auth/verify');
        if (res?.success) return res.data;

        return null;
      } catch (err) {
        return null;
      }
    }
  );

  return {
    verifying: !isFetched || isLoading,
    user: authInfo
  };
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const history = useHistory();

  const mutation = useMutation(
    async (loginData) => {
      const res = await api.post('/auth/login', loginData);
      if (res?.success) return res.data;

      return null;
    },
    {
      onSuccess: (data) => {
        const { token, ...user } = data;

        if (data) {
          localStorage.setItem('token', token);
          queryClient.setQueryData('user', user);
          history.push('/');
        }
      }
    }
  );

  return mutation;
};

export const useLoginOauth = () => {
  const queryClient = useQueryClient();
  const history = useHistory();

  const mutation = useMutation(
    async ({ username, oauthId }) => {
      const res = await api.post('/auth/login/oauth', { username, oauthId });
      if (res?.success) return res.data;

      return null;
    },
    {
      onSuccess: (data) => {
        const { token, ...user } = data;

        if (data) {
          localStorage.setItem('token', token);
          queryClient.setQueryData('user', user);
          history.push('/');
        }
      }
    }
  );

  return mutation;
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const history = useHistory();

  const logout = useCallback(
    () => {
      queryClient.setQueryData('user', null);
      history.push('/');
    },
    [queryClient, history],
  );

  return logout;
}

export const useSignup = () => {
  const queryClient = useQueryClient();
  const history = useHistory();

  const mutation = useMutation(
    async ({ username, password, confirmPassword }) => {
      const res = await api.post('/auth/register', { username, password, confirmPassword });
      if (res?.success) return res.data;

      return null;
    },
    {
      onSuccess: (data) => {
        const { token, ...user } = data;

        if (data) {
          localStorage.setItem('token', token);
          queryClient.setQueryData('user', user);
          history.push('/');
        }
      }
    }
  );

  return mutation;
};
