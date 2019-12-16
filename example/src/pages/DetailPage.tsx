import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTable } from 'react-normalizer-hook/dist';
import { TABLE_NAME, Post } from '../domain/post';

export default function DetailPage() {
  const { id } = useParams();
  const { getRow } = useTable<Post>(TABLE_NAME);
  if (!id) {
    throw Error;
  }
  const post = useMemo(() => getRow(id), [id, getRow]);
  return (
    <>
      {post && (
        <div>
          <h1>this is detail page, without fetching!</h1>
          <ul>
            <li>id: {post.id}</li>
            <li>createdAt: {post.createdAt}</li>
            <li>name: {post.name}</li>
            <li>isLiked: {post.isLiked ? 'liked' : 'click to like'}</li>
          </ul>
        </div>
      )}
    </>
  );
}
