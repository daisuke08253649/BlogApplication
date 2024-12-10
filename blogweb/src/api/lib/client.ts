import axios from 'axios';

const BASE_URL = 'http://localhost:3010';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// インターセプターでヘッダーを設定
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access-token');
  const client_id = localStorage.getItem('client');
  const uid = localStorage.getItem('uid');

  if (token && client_id && uid) {
    config.headers['access-token'] = token;
    config.headers['client'] = client_id;
    config.headers['uid'] = uid;
  }
  return config;
});

export default client;