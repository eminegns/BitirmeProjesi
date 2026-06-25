import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, signInWithGoogle } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import Sidebar from './components/layout/Sidebar';
import RightBar from './components/layout/RightBar';
import PostCard from './components/plant/PostCard';
import Footer from './components/layout/Footer'; 

import Profile from './Profile';
import FlowerDetail from './FlowerDetail';
import FlowerList from './FlowerList';
import IdentifyPlant from './IdentifyPlant';
import Discover from './Discover';
import UserProfile from './UserProfile';

function FeedView({ user }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!user) {
      fetch("http://localhost:8001/api/posts")
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.posts)) {
            setPosts(data.posts);
          }
        })
        .catch(err => console.error("Veri çekme hatası:", err));
    } else {
      // Giriş yapılmışsa kişiselleştirilmiş anasayfa
      fetch(`http://localhost:8001/api/feed/${user.uid}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.posts)) {
            setPosts(data.posts);
          }
        })
        .catch(err => console.error("Veri çekme hatası:", err));
    }
  }, [user]);

  return (
    <>
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-stone-200 px-6 py-4 z-10">
        <h1 className="text-xl font-bold tracking-tight text-stone-800">Ana Sayfa</h1>
      </div>
      <div className="divide-y divide-stone-200 bg-stone-50/30 min-h-screen">
        {posts.length === 0 ? (
          <p className="p-8 text-center text-stone-400 text-sm font-medium">Henüz bir bitki tanımlanmadı. İlk tanımlayan sen ol!</p>
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={{
              id: post.id,
              // Veritabanından boş gelme ihtimaline karşı varsayılandeğerler atıyoruz
              user: {
                name: post.author_name || "Gizli Üye",
                username: "üye",
                avatar: post.author_photo || ""
              },
              plantName: post.plant_name ? post.plant_name.toUpperCase() : "BİLİNMEYEN BİTKİ",
              accuracy: "AI Onaylı",
              image: post.image_url || "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=600",
              caption: post.post_text || "",
              likes: 0,
            }} />
          ))
        )}
      </div>
    </>
  );
}



function ProtectedRoute({ user, loading, children }) {
  if (loading) return <div className="p-10 text-center animate-pulse">Yükleniyor...</div>;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeLegalDocument, setActiveLegalDocument] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      setShowLoginModal(false);
    } catch (error) {
      console.error("Giriş başarısız:", error);
    }
  };

  return (
    <Router>

      {activeLegalDocument && (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[80vh] flex flex-col relative animate-fadeIn">
            <button
              onClick={() => setActiveLegalDocument(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-stone-800 mb-4 border-b border-stone-100 pb-3">
              {activeLegalDocument === 'kvkk' ? 'KVKK Aydınlatma Metni' : 'Kullanıcı Sözleşmesi'}
            </h3>

            <div className="overflow-y-auto text-xs text-stone-600 space-y-4 pr-2 font-medium leading-relaxed">
              {activeLegalDocument === 'kvkk' ? (
                <>
                  <p><strong>1. Veri Sorumlusu:</strong>  kişisel verilerinizin güvenliğine önem veriyoruz...</p>
                  <p><strong>2. İşlenen Veriler:</strong> Google girişi aracılığıyla yalnızca ad, soyad ve e-posta bilgileriniz işlenmektedir.</p>
                  <p><strong>3. İşleme Amacı:</strong> Yüklediğiniz bitki fotoğraflarının ve oluşturduğunuz arşivin size özel hesabınızda saklanması amacıyla kullanılmaktadır.</p>
                </>
              ) : (
                <>
                  <p><strong>1. Kurallar:</strong>  platformuna yüklenen fotoğrafların sorumluluğu kullanıcıya aittir.</p>
                  <p><strong>2. İçerik Paylaşımı:</strong> Topluluk kurallarına aykırı olan veya botanik bağlamı dışındaki paylaşımlar sistemden kaldırılabilir.</p>
                </>
              )}
            </div>

            <button
              onClick={() => setActiveLegalDocument(null)}
              className="mt-6 w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-colors"
            >
              Okudum, Anladım
            </button>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center relative overflow-hidden animate-fadeIn">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 font-bold"
            >
              ✕
            </button>

            <div className="space-y-2 relative z-10 mb-8 mt-2">
              <span className="text-4xl block mb-4">🌱</span>
              <h2 className="text-2xl font-serif font-black text-stone-800">Şimdi Katılın</h2>
              <p className="text-xs text-stone-500 font-medium px-4">
                Bitki fotoğrafı yüklemek ve profilinizi yönetmek için giriş yapmalısınız.
              </p>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-stone-200 hover:bg-stone-50 hover:border-emerald-500/30 text-stone-700 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm relative z-10"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              <span>Google ile Devam Et</span>
            </button>

            <p className="mt-6 text-[10px] text-stone-400 font-medium leading-relaxed relative z-10 px-2">
              Google ile giriş yaparak {' '}
              <button onClick={() => setActiveLegalDocument('terms')} className="text-emerald-700 hover:underline font-bold">Kullanıcı Sözleşmesi</button>
              'ni ve {' '}
              <button onClick={() => setActiveLegalDocument('kvkk')} className="text-emerald-700 hover:underline font-bold">KVKK Aydınlatma Metni</button>
              'ni okuyup kabul etmiş sayılırsınız.
            </p>
          </div>
        </div>
      )}

      {/* ANA TASARIM */}
      <div className="min-h-screen bg-stone-50 text-stone-900 font-sans antialiased flex justify-center relative overflow-hidden">
        <div className="w-full max-w-340 flex justify-between gap-6 px-4">

          <div className="hidden md:block -ml-4 xl:-ml-8 relative z-10">
            <Sidebar user={user} onRequireAuth={() => setShowLoginModal(true)} />
          </div>

          <main className="flex-1 max-w-2xl border-x border-stone-200 min-h-screen pb-20 bg-white relative shadow-sm">
            <Routes>
              <Route path="/" element={<FeedView user={user} />} />
              <Route path="/flowers" element={<FlowerList />} />
              <Route path="/flower/:englishName" element={<FlowerDetail />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/user/:uid" element={<UserProfile />} />
              <Route path="/profile" element={<ProtectedRoute user={user} loading={loading}><Profile /></ProtectedRoute>} />
              <Route path="/identify" element={<ProtectedRoute user={user} loading={loading}><IdentifyPlant /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <div className="hidden lg:block relative z-10">
            <RightBar />
          </div>
        </div>
      </div>
      <Footer />

    </Router> 
    
  );
}