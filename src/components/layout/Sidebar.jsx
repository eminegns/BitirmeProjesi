import React from 'react';
import { NavLink } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { FaHome } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { LuFlower } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { PiFlowerLotusDuotone } from "react-icons/pi";

export default function Sidebar({ user, onRequireAuth }) {

  const handleProtectedClick = (e) => {
    if (!user) {
      e.preventDefault();
      onRequireAuth();
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Oturum başarıyla kapatıldı.");
      })
      .catch((error) => {
        console.error("Çıkış yapılırken hata oluştu:", error);
      });
  };

  return (
    <aside className="w-64 h-screen sticky top-0 hidden md:flex flex-col justify-between p-6 bg-stone-50">
      <div className="space-y-8">
        <NavLink to="/" className="flex items-center space-x-3 px-2 cursor-pointer">
      <PiFlowerLotusDuotone className="text-[80px] text-emerald-700" />
          <span className="font-extrabold text-2xl  text-green-600  ">
            çiçek defterii
          </span>   
        </NavLink>

        <nav className="space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) => `w-full flex items-center space-x-4 px-4 py-3 font-semibold rounded-xl transition-all ${isActive ? "bg-emerald-50 text-emerald-700 font-bold" : "text-stone-600 hover:bg-stone-100"}`}
          >
            <FaHome />
            <span>Ana Sayfa</span>
          </NavLink>

          <NavLink
            to="/identify"
            onClick={handleProtectedClick}
            className={({ isActive }) => `w-full flex items-center space-x-4 px-4 py-3 font-semibold rounded-xl transition-all ${isActive ? "bg-emerald-50 text-emerald-700 font-bold" : "text-stone-600 hover:bg-stone-100"}`}
          >
            <FaCamera />
            <span>Bitkiyi Tanımla</span>
          </NavLink>

          <NavLink
            to="/discover"
            className={({ isActive }) => `w-full flex items-center space-x-4 px-4 py-3 font-semibold rounded-xl transition-all ${isActive ? "bg-emerald-50 text-emerald-700 font-bold" : "text-stone-600 hover:bg-stone-100"}`}
          >
            <FaSearch />
            <span>Keşfet</span>
          </NavLink>

          <NavLink
            to="/flowers"
            className={({ isActive }) => `w-full flex items-center space-x-4 px-4 py-3 font-semibold rounded-xl transition-all ${isActive ? "bg-emerald-50 text-emerald-700 font-bold" : "text-stone-600 hover:bg-stone-100"}`}
          >
            <LuFlower />
            <span>Çiçek Listesi</span>
          </NavLink>

          <NavLink
            to="/profile"
            onClick={handleProtectedClick}
            className={({ isActive }) => `w-full flex items-center space-x-4 px-4 py-3 font-semibold rounded-xl transition-all ${isActive ? "bg-emerald-50 text-emerald-700 font-bold" : "text-stone-600 hover:bg-stone-100"}`}
          >
            <CgProfile />
            <span>Profil</span>
          </NavLink>
        </nav>
      </div>

      <div className="px-4 pb-4">
        {user ? (
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-stone-200 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden shrink-0">
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-bold text-stone-700 truncate">{user.displayName}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 bg-red-50 border-red-200/40 text-red-600 hover:text-red-700 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center space-x-2 group"
            >
              <span>Oturumu Kapat</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onRequireAuth}
            className="w-full flex items-center justify-between p-3 bg-stone-800 hover:bg-emerald-800 text-white rounded-xl shadow-sm transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">👤</div>
              <div className="text-left">
                <p className="text-sm font-bold">Giriş Yap / Üye Ol</p>
                <p className="text-[10px] text-stone-300">Şimdi Katılın</p>
              </div>
            </div>
            <span className="text-stone-400 group-hover:text-white group-hover:translate-x-1 transition-all">→</span>
          </button>
        )}
      </div>
    </aside>
  );
}