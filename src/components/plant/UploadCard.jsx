import React, { useState } from 'react';

export default function UploadCard() {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-stone-100 p-6 max-w-xl mx-auto transition-all hover:shadow-lg">
      <h3 className="text-lg font-semibold text-stone-800 mb-2 text-center">Bitki Fotoğrafı Yükleyin</h3>
      <p className="text-sm text-stone-500 text-center mb-6">Yapay zekanın analiz etmesi için net bir fotoğraf seçin veya sürükleyin.</p>
      
      {/* Görsel Yükleme Alanı */}
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-xl p-8 cursor-pointer bg-stone-50/50 hover:bg-stone-50 hover:border-emerald-400 transition-all group relative overflow-hidden h-64">
        {preview ? (
          <img src={preview} alt="Önizleme" className="w-full h-full object-contain rounded-lg" />
        ) : (
          <div className="text-center space-y-3">
            <div className="text-4xl text-stone-400 group-hover:scale-110 transition-transform duration-200">📸</div>
            <div className="text-sm font-medium text-stone-600">Görsel seçmek için tıklayın</div>
            <div className="text-xs text-stone-400">PNG, JPG veya JPEG</div>
          </div>
        )}
        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
      </label>

      {/* Analiz Butonu */}
      {preview && (
        <div className="mt-6 flex space-x-3">
          <button 
            onClick={() => setPreview(null)}
            className="flex-1 px-4 py-2.5 border border-stone-200 text-stone-600 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors"
          >
            Temizle
          </button>
          <button className="flex-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200">
            Bitkiyi Tanımla 
          </button>
        </div>
      )}
    </div>
  );
}