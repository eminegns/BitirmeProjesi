import { auth } from './config/firebase';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function IdentifyPlant() {
  const navigate = useNavigate();
  
  const [selectedFile, setSelectedFile] = useState(null); 
  const [selectedImage, setSelectedImage] = useState(null); 
  const [postText, setPostText] = useState("");
  
  const [isAnalyzing, setIsAnalyzing] = useState(false); 
  const [isIdentified, setIsIdentified] = useState(false);
  const [identifiedFlower, setIdentifiedFlower] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file); 
      setSelectedImage(URL.createObjectURL(file)); 
      setIsIdentified(false);
    }
  };

  const handleIdentify = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true); 

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8001/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setIdentifiedFlower({
          recognized: data.recognized, 
          en: data.flower_en, 
          accuracy: data.accuracy,
          similar_flowers: data.similar_flowers 
        });
        setIsIdentified(true);
      } else {
        alert("Yapay Zeka Analiz Hatası: " + data.error);
      }
    } catch (error) {
      console.error("API Bağlantı Hatası:", error);
      alert("Yapay zeka sunucusuna ulaşılamadı. Python API'nin (uvicorn) çalıştığından emin olun.");
    } finally {
      setIsAnalyzing(false); 
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  const handlePublish = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Paylaşım yapmak için giriş yapmalısınız!");
      return;
    }

    try {
      const base64Image = await convertToBase64(selectedFile);

      const postData = {
        firebase_uid: user.uid,
        author_name: user.displayName,
        author_photo: user.photoURL || "🌿",
        plant_name: identifiedFlower.en,
        post_text: postText,
        image_url: base64Image 
      };

      const response = await fetch("http://localhost:8001/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData)
      });
      
      const result = await response.json();
      if (result.success) {
        navigate('/'); 
      }
    } catch (error) {
      console.error("Yayınlama hatası:", error);
      alert("PostgreSQL'e bağlanırken hata oluştu.");
    }
  };

  return (
    <div className="bg-white min-h-screen p-6 max-w-xl mx-auto space-y-8 antialiased relative">
      <div>
        <h1 className="text-2xl font-serif font-black text-stone-900">Bitki Tanımlama</h1>
        <p className="text-xs text-stone-400 mt-1">Fotoğraf yükleyerek bitki türünü analiz edin.</p>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-mono tracking-widest uppercase text-stone-400">1. Bitki Fotoğrafı</label>
        <div className="border-2 border-dashed border-stone-200 hover:border-emerald-500/50 rounded-2xl p-4 transition-colors bg-stone-50/50 text-center relative group min-h-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden">
          {selectedImage ? (
            <img src={selectedImage} alt="Yüklenen bitki" className="w-full max-h-64 object-contain rounded-xl shadow-sm bg-stone-100" />
          ) : (
            <div className="space-y-1.5 p-6">
              <span className="text-3xl block">📸</span>
              <p className="text-xs font-medium text-stone-600">Sürükleyin veya Dosya Seçin</p>
              <p className="text-[10px] text-stone-400">PNG, JPG</p>
            </div>
          )}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            className="absolute inset-0 opacity-0 cursor-pointer" 
          />
        </div>
      </div>

      {selectedImage && !isIdentified && (
        <button 
          onClick={handleIdentify}
          disabled={isAnalyzing}
          className={`w-full py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all shadow-sm ${
            isAnalyzing 
            ? 'bg-stone-200 text-stone-500 cursor-not-allowed' 
            : 'bg-stone-900 text-white hover:bg-emerald-800 hover:shadow-md'
          }`}
        >
          {isAnalyzing ? "Bitki tanımlanıyor..." : " BİTKİYİ TANIMLA"}
        </button>
      )}

      {isIdentified && identifiedFlower && (
        <div className="space-y-6 border-t border-stone-100 pt-6 animate-fadeIn">
          
          {!identifiedFlower.recognized ? (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r"></div>
              <div>
                <h3 className="text-lg font-bold text-rose-800">Bitki Tanımlanamadı</h3>
                <p className="text-xs text-rose-600 font-medium mt-1 leading-relaxed">
                  Eklenen fotoğraf algılanamadı (Tanımlama Sonuç: %{identifiedFlower.accuracy}). 
                  Yeni bir fotoğraf yükleyerek tekrar deneyin.
                </p>
              </div>
              <button
                onClick={() => { setSelectedFile(null); setSelectedImage(null); setIsIdentified(false); }}
                className="mt-4 px-6 py-2.5 bg-white border border-rose-200 text-rose-700 text-xs font-bold rounded-xl shadow-sm hover:bg-rose-200 hover:text-white transition-colors"
              >
                Yeni Fotoğraf Yükle
              </button>
            </div>
          ) : (
            <>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center justify-between shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                <div className="space-y-1 pl-2">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-700/80 block">
                    Tanımlama Sonuç • %{identifiedFlower.accuracy}
                  </span>
                  <h3 className="text-xl font-serif font-black text-emerald-900 capitalize tracking-tight">
                    {identifiedFlower.en}
                  </h3>
                </div>
                <button 
                  onClick={() => navigate(`/flower/${identifiedFlower.en}`)}
                  className="text-xs bg-white border border-emerald-200 px-4 py-2 rounded-xl font-bold text-emerald-700 hover:bg-emerald-700 hover:text-white transition-all shadow-sm shrink-0 ml-4"
                >
                  Rehberi Gör →
                </button>
              </div>

              {identifiedFlower.similar_flowers && identifiedFlower.similar_flowers.length > 0 && (
                <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-5 space-y-3">
                  <h4 className="text-[10px] font-mono tracking-widest uppercase text-stone-500 text-center mb-1">
                    Diğer Olası İhtimaller
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {identifiedFlower.similar_flowers.map((sim, i) => (
                      <div key={i} className="bg-white border border-stone-200 rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm hover:border-emerald-200 transition-colors cursor-default">
                        <span className="block text-xs font-bold text-stone-800 capitalize truncate w-full" title={sim.flower_en}>
                          {sim.flower_en}
                        </span>
                        <span className="block text-[10px] font-mono text-stone-400 mt-1">
                          %{sim.accuracy}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4 bg-white border border-stone-200 rounded-2xl p-5 shadow-sm mt-4">
                <h4 className="text-xs font-bold text-stone-800 flex items-center gap-2">
                  Bu keşfi arşivine kaydet
                </h4>
                
                <textarea 
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="Bitkiniz hakkında bir şeyler yazın veya not alın..."
                  className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder-stone-400 text-stone-800 resize-none"
                  rows={3}
                />

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={() => navigate('/')}
                    className="py-3 border border-stone-200 text-stone-500 hover:text-stone-700 hover:bg-stone-50 rounded-xl text-xs font-bold tracking-wide transition-colors"
                  >
                    Vazgeç
                  </button>
                  <button 
                    onClick={handlePublish}
                    className="py-3 bg-emerald-700 text-white rounded-xl text-xs font-bold tracking-wide hover:bg-emerald-800 transition-colors shadow-sm"
                  >
                    Kaydet ve Yayınla
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}