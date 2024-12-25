import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  TextField, 
  Button, 
  Avatar,
  Snackbar,
  Box,
  Divider
} from '@mui/material';
import { blogsAPI } from '../api/blogs';
import { useNavigate } from 'react-router-dom';

interface Blog {
  id: number;
  user?: {
    id: number,
    name: string,
  } | null;
  content: string;
  created_at: string;
}

interface Props {
  user?: {
    id: number,
    name: string
  };
}

export default function Home({ user }: Props) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [newBlog, setNewBlog] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('access-token');
    if (!accessToken) {
      navigate('/login');
      return;
    }
    fetchTweets();
  }, [navigate]);

  const fetchTweets = async () => {
    try {
      const response = await blogsAPI.getBlogs();
      console.log('Fetched blogs:', response.data);
      setBlogs(response.data);
    } catch (err) {
      console.error('Error:', err);
      setError('ツイートの取得に失敗しました。');
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newBlog.trim()) {
      try {
        const response = await blogsAPI.createBlog({
          content: newBlog
        });

        console.log('API Response:', response);

        // 新しい投稿を作成
        const newBlogPost: Blog = {
          id: Date.now(), // 一時的なID
          content: newBlog,
          created_at: new Date().toISOString(),
          user: user || null
        };
  
        // 投稿リストを更新
        setBlogs(prevBlogs => [newBlogPost, ...prevBlogs]);
        setNewBlog('');
        
        // 最新の投稿を取得
        fetchTweets();

      } catch (err) {
        console.error('Post error:', err);
        setError('ツイートの投稿に失敗しました。');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <form onSubmit={handleBlogSubmit}>
              <TextField
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                placeholder="いまどうしてる？"
                value={newBlog}
                onChange={(e) => setNewBlog(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Button type="submit" variant="contained" color="primary">
                投稿する
              </Button>
            </form>
          </Paper>
          {blogs && blogs.map((blog, index) => (
            <Paper key={`blog-${blog.id}-${index}`} elevation={3} sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ mr: 1 }}>
                    {blog.user?.name?.[0] || 'U'}
                  </Avatar>
                  <Typography variant="subtitle1" component="span" sx={{ display: 'block', textAlign: 'left' }}>
                    {blog.user?.name || '匿名ユーザー'}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="body1" paragraph sx={{ textAlign: 'left' }}>
                  {blog.content}
                </Typography>
                <Box sx={{ alignSelf: 'flex-end', mt: 'auto' }}>
                  <Typography variant="body2" color="textSecondary">
                    {formatDate(blog.created_at)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Grid>
      </Grid>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
    </Container>
  );
}