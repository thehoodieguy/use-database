import { Post } from '../domain/post';
import faker from 'faker';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generatePost = (id?: number): Post => ({
  id: id != null ? id : faker.random.number(),
  name: faker.name.findName(),
  createdAt: faker.date.past().toString(),
  avatar: faker.image.avatar(),
  isLiked: faker.random.boolean(),
});

const generatePostList = (num: number): Post[] =>
  [...Array(num).keys()].map(key => generatePost(key));

export const listPosts = async (): Promise<Post[]> => {
  await sleep(200);
  return generatePostList(faker.random.number(200));
};
