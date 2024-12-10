import client from './lib/client';

interface SignupData {
  email: string;
  password: string;
  password_confirmation: string;
  name: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const authAPI = {
  signup: async (data: SignupData) => {
    return await client.post('/auth', data);
  },

  login: async (data: LoginData) => {
    const response = await client.post('/auth/sign_in', data);
    // トークン情報を保存
    const { headers } = response;
    localStorage.setItem('access-token', headers['access-token']);
    localStorage.setItem('client', headers['client']);
    localStorage.setItem('uid', headers['uid']);
    return response;
  },

  logout: async () => {
    try {
      await client.delete('/auth/sign_out');
      // ローカルストレージからトークン情報を削除
      localStorage.removeItem('access-token');
      localStorage.removeItem('client');
      localStorage.removeItem('uid');
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
      throw error;
    }
  },

  validateToken: async () => {
    return await client.get('/auth/validate_token');
  }
};