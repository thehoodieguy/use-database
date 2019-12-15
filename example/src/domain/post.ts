export const TABLE_NAME = 'POSTS';

export interface Post {
  id: string;
  createdAt: string;
  name: string;
  avatar: string;
  isLiked: boolean;
}
