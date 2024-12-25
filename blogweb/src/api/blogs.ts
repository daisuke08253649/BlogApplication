import client from './lib/client';

export interface BlogData {
  content: string;
  user?: {
    id: number,
    name: string
  };
}

export const blogsAPI = {
  getBlogs: async () => {
    return await client.get('/api/blogs');
  },

  createBlog: async (data: BlogData) => {
    return await client.post('/api/blogs', { blog: data });
  },
};