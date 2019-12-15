import random from 'random';
import randomstring from 'randomstring';

export interface Post {
  id: number;
  body: string;
  isLiked: boolean;
}

export const generatePost = (partialPost: Partial<Post> = {}): Post =>
  Object.assign(
    {},
    {
      id: random.int(),
      body: randomstring.generate(),
      isLiked: random.boolean(),
    },
    partialPost,
  );
