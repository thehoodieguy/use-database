import random from 'random';
import randomstring from 'randomstring';

export interface Post {
  id: number;
  body: string;
  isLiked: boolean;
}

export const generatePost = (partialPost: Partial<Post> = {}): Post => ({
  id: random.int(),
  body: randomstring.generate(),
  isLiked: random.boolean(),
  ...partialPost,
});

export const generatePostList = (
  postNum: number,
): Post[] => [...Array(postNum).keys()].map((key) => generatePost({id: key}));
