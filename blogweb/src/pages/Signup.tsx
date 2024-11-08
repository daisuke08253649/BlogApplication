import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Grid,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { Person, Email, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface FormData {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export default function SignupScreen() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.username.trim()) newErrors.username = 'ユーザー名は必須です';
    if (!formData.email.trim()) newErrors.email = 'メールアドレスは必須です';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = '有効なメールアドレスを入力してください';
    if (!formData.password) newErrors.password = 'パスワードは必須です';
    else if (formData.password.length < 8) newErrors.password = 'パスワードは8文字以上である必要があります';
    if (formData.password !== formData.password_confirmation) newErrors.password_confirmation = 'パスワードが一致しません';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const signup = async (formData: FormData) => {
    try {
      const response = await axios.post('http://localhost:3010/auth', {
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        username: formData.username,
      });

      // レスポンスヘッダーからトークン情報を取得
      const { 'access-token': accessToken, client, uid } = response.headers;
      // トークン情報を localStorage に保存
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('client', client);
      localStorage.setItem('uid', uid);
      axios.defaults.headers.common['access-token'] = accessToken;
      axios.defaults.headers.common['client'] = client;
      axios.defaults.headers.common['uid'] = uid;

      console.log('Signup successful:', response.data);
      setSnackbar({ open: true, message: 'アカウントが作成されました！' });

      // サインアップ成功時にHome.tsxに遷移
      navigate('/home'); // useNavigateを使用してリダイレクト
    } catch (error) {
      console.error('Signup error:', error);
      setSnackbar({ open: true, message: 'サインアップに失敗しました。' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        await signup(formData);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          サインアップ
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="ユーザー名"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                InputProps={{
                  startAdornment: <Person color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="メールアドレス"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: <Email color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="パスワード"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: <Lock color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password_confirmation"
                label="パスワード確認"
                type="password"
                id="password_confirmation"
                autoComplete="new-password"
                value={formData.password_confirmation}
                onChange={handleChange}
                error={!!errors.password_confirmation}
                helperText={errors.password_confirmation}
                InputProps={{
                  startAdornment: <Lock color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'サインアップ'}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="#" variant="body2">
                すでにアカウントをお持ちですか？ ログイン
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Container>
  );
}