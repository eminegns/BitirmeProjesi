import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth } from './config/firebase';
import PostCard from './components/plant/PostCard';

export default function UserProfile() {
  const { uid } = useParams();
  const navigate = useNavigate();
  
  const [userPosts, setUserPosts] = useState([]);
  const [userInfo, setUserInfo] = useState({ name: "Yükleniyor...", photo: null });
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);

  const currentUser = auth.currentUser;

  useEffect(() => {
    fetch(`http://localhost:8001/api/users/${uid}/posts`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.posts)) {
          setUserPosts(data.posts);
          
          if (data.posts.length > 0) {
            setUserInfo({
              name: data.posts[0].author_name,
              photo: data.posts[0].author_photo
            });
          }
        }
      })
      .catch(err => console.error("Kullanıcı verisi çekilemedi:", err))
      .finally(() => setLoading(false));

    if (currentUser) {
      fetch(`http://localhost:8001/api/followers-count/${uid}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setFollowersCount(data.followers_count);
          }
        })
        .catch(err => console.error("Takipçi sayısı çekilemedi:", err));

      fetch(`http://localhost:8001/api/following-count/${uid}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setFollowingCount(data.following_count);
          }
        })
        .catch(err => console.error("Takip edilen sayısı çekilemedi:", err));

      fetch(`http://localhost:8001/api/is-following/${uid}?follower_uid=${currentUser.uid}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setIsFollowing(data.is_following);
          }
        })
        .catch(err => console.error("Takip durumu çekilemedi:", err));
    }
  }, [uid, currentUser]);

  const handleFollow = async () => {
    if (!currentUser) {
      alert("Takip etmek için giriş yapmalısınız!");
      return;
    }

    setIsLoadingFollow(true);
    try {
      const response = await fetch(`http://localhost:8001/api/follow/${uid}?follower_uid=${currentUser.uid}`, {
        method: "POST"
      });

      const data = await response.json();
      if (data.success) {
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
      }
    } catch (err) {
      console.error("Takip hatası:", err);
    } finally {
      setIsLoadingFollow(false);
    }
  };

  const handleUnfollow = async () => {
    if (!currentUser) return;

    setIsLoadingFollow(true);
    try {
      const response = await fetch(`http://localhost:8001/api/follow/${uid}?follower_uid=${currentUser.uid}`, {
        method: "DELETE"
      });

      const data = await response.json();
      if (data.success) {
        setIsFollowing(false);
        setFollowersCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Takipten çıkma hatası:", err);
    } finally {
      setIsLoadingFollow(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-stone-400 animate-pulse min-h-screen bg-stone-50/30">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-stone-50/30 relative">
      
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-20 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors shadow-sm"
      >
        ← Geri
      </button>
      <div className="bg-white p-8 border-b border-stone-200 text-center relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-r from-stone-300 to-stone-400 opacity-50"></div>
        <div className="relative z-10 pt-16">
          <div className="w-28 h-28 mx-auto mb-4 rounded-full border-4 border-white shadow-md bg-stone-100 flex items-center justify-center overflow-hidden text-3xl">
            {userInfo.photo?.startsWith('http') ? (
              <img src={userInfo.photo} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <span>🌿</span>
            )}
          </div>
          <h2 className="text-2xl font-black text-stone-800 tracking-tight">{userInfo.name}</h2>
          
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

          {currentUser && currentUser.uid !== uid && (
            <button
              onClick={isFollowing ? handleUnfollow : handleFollow}
              disabled={isLoadingFollow}
              className={`mt-6 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isFollowing
                  ? 'bg-stone-200 text-stone-700 hover:bg-red-100 hover:text-red-700'
                  : 'bg-emerald-700 text-white hover:bg-emerald-800'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoadingFollow ? '...' : isFollowing ? '✓ Takip Ediliyor' : '+ Takip Et'}
            </button>
          )}
        </div>
      </div>

      <div className="divide-y divide-stone-200">
        {userPosts.length === 0 ? (
          <div className="p-12 text-center text-stone-400 space-y-3">
            <p className="text-sm font-medium">Bu kullanıcı henüz bir bitki tanımlamadı.</p>
          </div>
        ) : (
          userPosts.map(post => (
            <PostCard 
              key={post.id} 
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
