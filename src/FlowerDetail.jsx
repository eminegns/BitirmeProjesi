import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { flowerService } from "./service/api";
import { flowerImages } from './flowerImages';

export default function FlowerDetail() {
    const { englishName } = useParams();
    const navigate = useNavigate();
    
    const [flower, setFlower] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFlowerDetail = async () => {
            try {
                setLoading(true);
                const data = await flowerService.getFlowerDetail(englishName);
                setFlower(data);
                setError(null);
            } catch (err) {
                console.error("Veri çekme hatası:", err);
                setError("Bu bitki laboratuvar kayıtlarımızda bulunamadı.");
            } finally {
                setLoading(false);
            }
        };

        fetchFlowerDetail();
    }, [englishName]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 text-stone-400 space-y-3">
                <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-serif italic tracking-wide text-stone-500">PostgreSQL veri havuzuna bağlanılıyor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 text-center p-6 space-y-4">
                <p className="font-serif italic text-stone-600 max-w-xs">{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-5 py-2 border border-stone-300 text-stone-600 rounded-full text-xs font-semibold hover:bg-stone-100 transition-all tracking-wider"
                >
                    GERİ DÖN
                </button>
            </div>
        );
    }

    const currentFlowerName = englishName?.toLowerCase().replace(/-/g, ' ');
    const images = flowerImages[currentFlowerName] || [
        "https://images.unsplash.com/photo-1490750967868-8f52a096eecd?w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=500&auto=format&fit=crop"
    ];

    return (
        <div className="bg-stone-50 min-h-screen text-stone-800 antialiased relative selection:bg-emerald-100">
            <header className="sticky top-0 bg-stone-50/80 backdrop-blur-md border-b border-stone-200/60 px-6 py-4 flex items-center justify-between z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center space-x-2 text-stone-500 hover:text-stone-900 transition-colors text-xs font-bold tracking-widest uppercase"
                >
                    <span className="transform group-hover:-translate-x-1 transition-transform inline-block">←</span>
                    <span>Geri</span>
                </button>
            </header>

            <div className="max-w-2xl mx-auto px-6 py-10 space-y-12">

                <section className="space-y-2 border-b border-stone-200 pb-6 relative">
                    <h1 className="text-4xl font-black tracking-tight text-stone-900 font-serif capitalize">
                        {flower.turkish_name}
                    </h1>
                    <p className="text-sm text-emerald-700 font-serif italic tracking-wide">
                        {flower.latin_name} — ({flower.english_name})
                    </p>
                </section>

                <section className="w-full aspect-4/3 md:aspect-video bg-stone-200/60 rounded-3xl overflow-hidden border border-stone-200 relative group flex items-center justify-center">
                    <img 
                        src={images[0]} 
                        alt={`${flower.turkish_name} Görsel 1`} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                </section>

                <section className="bg-emerald-900 text-emerald-50 p-6 rounded-3xl shadow-sm relative overflow-hidden">
                    <h4 className="text-[10px] font-mono tracking-widest uppercase opacity-70 mb-2">Funfact</h4>
                    <p className="font-serif italic text-base leading-relaxed">
                        "{flower.funfact || 'Bu özel bitki türü hakkında henüz bir alt bilgi girilmemiş.'}"
                    </p>
                </section>

                <section className="space-y-8">
                    <h3 className="text-xs font-mono tracking-widest uppercase text-stone-400 border-b border-stone-200 pb-2">
                        Bakım Kılavuzu
                    </h3>

                    <div className="space-y-6">
                        <div className="flex items-start space-x-4 group">
                            <div className="space-y-1">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Hidrasyon ve Sulama Dengesi</h4>
                                <p className="text-sm text-stone-600 leading-relaxed">{flower.watering_need}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 group">
                            <div className="space-y-1">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Işık Yoğunluğu ve Konumlandırma</h4>
                                <p className="text-sm text-stone-600 leading-relaxed">{flower.light}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 group">
                            <div className="space-y-1">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Zemin ve Toprak Kompozisyonu</h4>
                                <p className="text-sm text-stone-600 leading-relaxed">{flower.soil}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 group">
                            <div className="space-y-1">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Toksisite ve Çevresel Risk Faktörleri</h4>
                                <p className="text-sm text-stone-600 leading-relaxed">{flower.poison || 'Evcil hayvanlar ve yaşam alanları için herhangi bir risk teşkil etmez.'}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-stone-100 rounded-2xl p-6 border border-stone-200/60">
                    <h4 className="text-[10px] font-mono tracking-widest uppercase text-stone-400 mb-4 text-center">Takvimi</h4>
                    <div className="grid grid-cols-2 divide-x divide-stone-200 text-center">
                        <div className="space-y-1 px-2">
                            <span className="text-xs font-medium text-stone-500 block">Ekim Zamanı</span>
                            <span className="text-sm font-bold text-stone-800 font-serif">{flower.planting}</span>
                        </div>
                        <div className="space-y-1 px-2">
                            <span className="text-xs font-medium text-stone-500 block">Çiçeklenme Zamanı</span>
                            <span className="text-sm font-bold text-stone-800 font-serif">{flower.blooming}</span>
                        </div>
                    </div>
                </section>

                <section className="w-full aspect-4/3 md:aspect-video bg-stone-200/60 rounded-3xl overflow-hidden border border-stone-200 relative group flex items-center justify-center">
                    <img 
                        src={images[1]} 
                        alt={`${flower.turkish_name} Görsel 2`} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                </section>

            </div>
        </div>
    );
}