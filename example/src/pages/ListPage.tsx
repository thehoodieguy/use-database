import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../consts';
import useLoadablePostList from './useLoadablePostList';

export default function ListPage() {
  const { isLoading, error, postList } = useLoadablePostList();
  return (
    <>
      {!isLoading && !error && postList ? (
        <>
          {postList.map(
            post =>
              post && (
                <ul key={post.id}>
                  <li>
                    <Link to={routes.detailCreator(post.id)}>
                      id: {post.id}
                    </Link>
                  </li>
                  <li>createdAt: {post.createdAt}</li>
                  <li>name: {post.name}</li>
                  <li>isLiked: {post.isLiked ? 'Liked' : 'click to like'}</li>
                </ul>
              ),
          )}
        </>
      ) : error ? (
        error.toString()
      ) : (
        'loading...'
      )}
    </>
  );
}
