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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

interface FormData {
  email: string;
  password: string;
}

interface LoginProps {
  onLogin: (userData: { name: string; avatarUrl?: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
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
    if (!formData.email.trim()) newErrors.email = 'メールアドレスは必須です';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = '有効なメールアドレスを入力してください';
    if (!formData.password) newErrors.password = 'パスワードは必須です';
    else if (formData.password.length < 8) newErrors.password = 'パスワードは8文字以上である必要があります';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const Login = async (formData: FormData) => {
    try {
      const response = await axios.post('http://localhost:3010/auth/sign_in', {
        email: formData.email,
        password: formData.password,
      });

      console.log('Full response:', response);
      console.log('Response data:', response.data);
      console.log('Response headers:', response.headers);

      // レスポンスヘッダーからトークン情報を取得
      const accessToken = response.headers['access-token'];
      const client = response.headers['client'];
      const uid = response.headers['uid'];

      // トークン情報を localStorage に保存
      localStorage.setItem('access-token', accessToken);
      localStorage.setItem('client', client);
      localStorage.setItem('uid', uid);

      // axiosのヘッダーにトークンを設定
      axios.defaults.headers.common['access-token'] = accessToken;
      axios.defaults.headers.common['client'] = client;
      axios.defaults.headers.common['uid'] = uid;

      // ログインレスポンスから直接ユーザー情報を取得
      const userData = {
        name: response.data.data.name || response.data.data.email.split('@')[0], // nameがない場合はメールアドレスの@前の部分を使用
        avatarUrl: response.data.data.image?.url
      };

      console.log('User data:', userData);

      onLogin(userData);
      setSnackbar({ open: true, message: 'ログインしました！' });
      // サインアップ成功時にHome.tsxに遷移
      navigate('/'); // useNavigateを使用してリダイレクト
      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setSnackbar({ open: true, message: error.response.data.error || 'ログインに失敗しました。' });
      } else {
        setSnackbar({ open: true, message: 'ログインに失敗しました。' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        await Login(formData);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        mt: { xs: 2, sm: 8 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Paper
        elevation={3}
        sx={{ 
          p: { xs: 2, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          component="h1"
          variant={isMobile ? "h6" : "h5"}
          sx={{ mb: 2 }}
        >
          ログイン
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            mt: { xs: 1, sm: 3 },
          }}
        >
          <Grid container spacing={2}>
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
                size={isMobile ? "small" : "medium"}
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
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: { xs: 2, sm: 3 }, 
              mb: { xs: 1, sm: 2 },
              height: isMobile ? '36px' : '42px',
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress 
                size={isMobile ? 20 : 24} 
                color="inherit" 
              />
            ) : 'ログイン'}
          </Button>
          <Grid container justifyContent="flex-end" sx={{ mt: 1 }}>
            <Grid item>
              <Link
                component={RouterLink}
                to="/signup"
                variant="body2"
                sx={{
                  fontSize: isMobile ? '0.875rem' : '1rem',
                }}
              >
                アカウントをお持ちでないですか？ サインアップ
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
        sx={{
          bottom: { xs: 16, sm: 24 },
        }}
      />
    </Container>
  );
}