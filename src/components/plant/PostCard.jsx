import React, { useState, useEffect } from 'react';
import { auth } from '../../config/firebase';
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";

export default function PostCard({ post, onDelete }) {
  if (!post || !post.user) return null;

  const currentUser = auth.currentUser;
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:8001/api/posts/${post.id}/like-status?uid=${currentUser?.uid || ''}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLiked(data.is_liked);
          setLikeCount(data.like_count);
        }
      })
      .catch(err => console.error(err));
  }, [post.id, currentUser]);

  const toggleLike = async () => {
    if (!currentUser) {
      alert("Beğenmek için giriş yapmalısınız!");
      return;
    }

    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);

    try {
      const res = await fetch(`http://localhost:8001/api/posts/${post.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebase_uid: currentUser.uid })
      });
      const data = await res.json();
      if (data.success) {
        setLikeCount(data.like_count); 
      }
    } catch (error) {
      setLiked(!liked);
      setLikeCount(liked ? likeCount + 1 : likeCount - 1);
      console.error("Beğeni işlemi başarısız:", error);
    }
  };

  return (
    <article className="p-6 bg-white hover:bg-stone-50/50 transition-colors flex space-x-4">
      <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-700 font-bold shrink-0 overflow-hidden">
        {post.user.avatar?.startsWith('http') ? (
          <img src={post.user.avatar} alt="Profil" className="w-full h-full object-cover" />
        ) : (
          <span>{post.user.avatar || "🌿"}</span>
        )}
      </div>

      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-stone-800 text-sm hover:underline cursor-pointer">{post.user.name}</span>
            <span className="text-xs text-stone-400">@{post.user.username}</span>
            <span className="text-xs text-stone-300">•</span>
            <span className="text-xs text-stone-400">{post.time}</span>
          </div>

          {onDelete && (
            <button 
              onClick={() => onDelete(post.id)}
              className="text-stone-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all"
              title="Gönderiyi Sil"
            >
              🗑️
            </button>
          )}
        </div>

        <p className="text-sm text-stone-700 leading-relaxed">{post.caption}</p>

        

        {post.image && (
          <div className="rounded-2xl overflow-hidden border border-stone-100 max-h-96 bg-stone-50">
            <img src={post.image} alt="Bitki" className="w-full h-full object-cover max-h-96" />
          </div>
        )}

        <div className="flex items-center space-x-6 text-stone-500 pt-1">
          <button 
            onClick={toggleLike}
            className={`flex items-center space-x-1.5 group text-sm transition-colors ${liked ? 'text-rose-600 font-semibold' : 'hover:text-rose-600'}`}
          >
            {liked ? (
              <IoHeartSharp className="text-xl transition-transform group-hover:scale-125 text-rose-600" />
            ) : (
              <IoHeartOutline className="text-xl transition-transform group-hover:scale-125" />
            )}
            <span>{likeCount}</span>
          </button>
          
         
        </div>
      </div>
    </article>
  );
}