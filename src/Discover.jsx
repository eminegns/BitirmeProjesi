import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Discover() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() === "") {
        setUsers([]);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setHasSearched(true);

      fetch(`http://localhost:8001/api/search/users?q=${searchTerm}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUsers(data.users);
          }
        })
        .catch(err => console.error("Arama hatası:", err))
        .finally(() => setIsLoading(false));
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-stone-50/30">

      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-stone-200 px-6 py-4 z-10 space-y-4">
        <h1 className="text-xl font-bold tracking-tight text-stone-800">Keşfet</h1>

        <div className="relative">

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="İsim veya kullanıcı adı ara..."
            className="w-full bg-stone-100 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium text-stone-700 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none placeholder-stone-400"
          />
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {hasSearched && users.length === 0 && (
              <p className="text-center text-sm font-medium text-stone-400 py-10">
                "{searchTerm}" ile eşleşen bir kullanıcı bulunamadı.
              </p>
            )}

            {!hasSearched && (
              <p className="text-center text-sm font-medium text-stone-400 py-10">
                Diğer doğa severleri arayın.
              </p>
            )}

            {users.map((user, index) => (
              <div
                key={index}
                onClick={() => navigate(`/user/${user.uid}`)}
                className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                    {user.photo?.startsWith('http') ? (
                      <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🌿</div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-800 group-hover:text-emerald-700 transition-colors">
                      {user.name}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">
                      {user.post_count} Bitki Tanımlaması
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/user/${user.uid}`);
                  }}
                  className="text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-600 hover:text-white transition-colors"
                >
                  Profili Gör
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}