import React, { useState, useEffect } from 'react';
import { auth } from './config/firebase';
import PostCard from './components/plant/PostCard';

export default function Profile() {
  const [userPosts, setUserPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('my_posts');
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      // Gönderiler
      fetch(`http://localhost:8001/api/users/${user.uid}/posts`)
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.posts)) {
            setUserPosts(data.posts);
          }
        })
        .catch(err => console.error("Profil verisi çekilemedi:", err));

      // Beğendiği gönderiler
      fetch(`http://localhost:8001/api/users/${user.uid}/liked-posts`)
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.posts)) {
            setLikedPosts(data.posts);
          }
        })
        .catch(err => console.error("Beğenilen gönderiler çekilemedi:", err));

      // Takipçi sayısı
      fetch(`http://localhost:8001/api/followers-count/${user.uid}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setFollowersCount(data.followers_count);
          }
        })
        .catch(err => console.error("Takipçi sayısı çekilemedi:", err));

      // Takip edilen sayısı
      fetch(`http://localhost:8001/api/following-count/${user.uid}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setFollowingCount(data.following_count);
          }
        })
        .catch(err => console.error("Takip edilen sayısı çekilemedi:", err));
    }
  }, [user]);

  const handleDelete = async (postId) => {
    const isConfirmed = window.confirm("Bu bitki tespitini arşivden silmek istediğinize emin misiniz?");
    if (!isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:8001/api/posts/${postId}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (data.success) {
        setUserPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
      } else {
        alert("Silinirken bir hata oluştu.");
      }
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  if (!user) return null;

  const displayPosts = activeTab === 'my_posts' ? userPosts : likedPosts;

  return (
    <div className="min-h-screen bg-stone-50/30">

      <div className="bg-white p-8 border-b border-stone-200 text-center relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-r bg-emerald-600"></div>
        <div className="relative z-10 pt-16">
          <img
            src={user.photoURL || ""}
            alt="Profil"
            className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-md bg-white"
          />
          <h2 className="text-2xl font-black text-stone-800 tracking-tight">{user.displayName}</h2>
          <p className="text-sm text-stone-500 font-medium mt-1"> Bitki Arşivi</p>

          <div className="flex justify-center space-x-6 mt-6 border-t border-stone-100 pt-6">
            <div className="text-center">
              <span className="block text-xl font-bold text-stone-800">{userPosts.length}</span>
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Tanımlama</span>
            </div>
            <div className="text-center">
              <span className="block text-xl font-bold text-stone-800">{followersCount}</span>
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Takipçi</span>
            </div>
            <div className="text-center">
              <span className="block text-xl font-bold text-stone-800">{followingCount}</span>
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Takip Edilen</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex bg-white border-b border-stone-200 sticky top-0 z-10">
        <button 
          onClick={() => setActiveTab('my_posts')}
          className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${
            activeTab === 'my_posts' 
            ? 'border-b-2 border-emerald-600 text-emerald-800' 
            : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'
          }`}
        >
          Gönderilerim ({userPosts.length})
        </button>
        <button 
          onClick={() => setActiveTab('liked_posts')}
          className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${
            activeTab === 'liked_posts' 
            ? 'border-b-2 border-emerald-600 text-emerald-800' 
            : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'
          }`}
        >
          Beğendiklerim ({likedPosts.length})
        </button>
      </div>

      <div className="divide-y divide-stone-200">
        {displayPosts.length === 0 ? (
          <div className="p-12 text-center text-stone-400 space-y-3">
            <div className="text-4xl">🍂</div>
            <p className="text-sm font-medium">
              {activeTab === 'my_posts' ? "Henüz arşivinize bir bitki eklemediniz." : "Henüz hiçbir gönderiyi beğenmediniz."}
            </p>
          </div>
        ) : (
          displayPosts.map(post => (
            <PostCard 
              key={post.id} 
              onDelete={activeTab === 'my_posts' ? handleDelete : undefined}
              post={{
                id: post.id,
                user: { name: post.author_name, username: "üye", avatar: post.author_photo },
                plantName: post.plant_name.toUpperCase(),
                image: post.image_url,
                caption: post.post_text,
                likes: 0,
                time: "Arşiv"
              }} 
            />
          ))
        )}
      </div>
    </div>
  );
}