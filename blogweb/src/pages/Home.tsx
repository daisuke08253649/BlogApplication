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
import axios from 'axios';


interface Blog {
  id: number;
  user: string;
  content: string;
  created_at: string;
}

export default function Component() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [newBlog, setNewBlog] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = async () => {
    try {
      const response = await axios.get('http://localhost:3010/api/blogs');
      setBlogs(response.data);
    } catch (err) {
      setError('ツイートの取得に失敗しました。');
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newBlog.trim()) {
      try {
        const response = await axios.post('http://localhost:3010/api/blogs', {
          blog: {
            content: newBlog,
            user: '現在のユーザー'
          }
        });
        setBlogs([response.data, ...blogs]);
        setNewBlog('');
      } catch (err) {
        setError('ツイートの投稿に失敗しました。');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}`;
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
          {blogs.map((blog) => (
            <Paper key={blog.id} elevation={3} sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ mr: 1 }}>{blog.user ? blog.user[0] : 'U'}</Avatar>
                  <Typography variant="subtitle1" component="span" sx={{ display: 'block', textAlign: 'left' }}>
                    {blog.user || '匿名ユーザー'}
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