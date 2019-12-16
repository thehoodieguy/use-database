export const TABLE_NAME = 'POSTS';

export interface Post {
  id: number;
  createdAt: string;
  name: string;
  avatar: string;
  isLiked: boolean;
}
