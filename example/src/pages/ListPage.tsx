import React, { useEffect } from 'react';
import useLoadablePostList from '../hooks/useLoadable';
import { listPosts } from '../actions/post';
import { Link } from 'react-router-dom';
import { routes } from '../consts';

export default function ListPage() {
  const { isLoading, loadData, error, data } = useLoadablePostList({
    defaultIsLoading: true,
  });

  useEffect(() => {
    loadData(() => listPosts());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {!isLoading && !error ? (
        <>
          {data!.map(post => (
            <ul key={post.id}>
              <li>
                <Link to={routes.detailCreator(post.id)}>id: {post.id}</Link>
              </li>
              <li>createdAt: {post.createdAt}</li>
              <li>name: {post.name}</li>
              <li>isLiked: {post.isLiked ? 'Liked' : 'click to like'}</li>
            </ul>
          ))}
        </>
      ) : error ? (
        error.toString()
      ) : (
        'loading...'
      )}
    </>
  );
}
