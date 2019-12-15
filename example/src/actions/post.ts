import { apiEndpoints } from './../consts';
import { Post } from '../domain/post';
import axios from 'axios';

export const listPosts = async (): Promise<Post[]> => {
  const res = await axios.get<Post[]>(apiEndpoints.list);
  const data = res.data;
  return data;
};

export const detailPost = async (id: string): Promise<Post> => {
  const res = await axios.get<Post>(apiEndpoints.detail(id));
  return res.data;
};
