import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuFlower2 } from "react-icons/lu";

const ALL_FLOWERS = [
  { en: "pink primrose", tr: "Pembe Çuha Çiçeği" },
  { en: "hard-leaved pocket orchid", tr: "Sert Yapraklı Cep Orkidesi" },
  { en: "canterbury bells", tr: "Çan Çiçeği" },
  { en: "sweet pea", tr: "Itırşahi (Tatlı Bezelye)" },
  { en: "english marigold", tr: "Aynısefa" },
  { en: "tiger lily", tr: "Kaplan Zambağı" },
  { en: "moon orchid", tr: "Ay Orkidesi" },
  { en: "bird of paradise", tr: "Cennet Kuşu Çiçeği" },
  { en: "monkshood", tr: "Kurtboğan" },
  { en: "globe thistle", tr: "Mavi Karabaş Dikeni" },
  { en: "snapdragon", tr: "Aslanağzı" },
  { en: "colt's foot", tr: "Öksürük Otu" },
  { en: "king protea", tr: "Kral Protea" },
  { en: "spear thistle", tr: "Boğa Dikeni" },
  { en: "yellow iris", tr: "Sarı Süsen" },
  { en: "globe-flower", tr: "Küre Düğün Çiçeği" },
  { en: "purple coneflower", tr: "Ekinasya (Kirpi Otu)" },
  { en: "peruvian lily", tr: "Peru Zambağı" },
  { en: "balloon flower", tr: "Balon Çiçeği" },
  { en: "giant white arum lily", tr: "Kale Zambağı" },
  { en: "fire lily", tr: "Ateş Zambağı" },
  { en: "pincushion flower", tr: "Uyuz Otu" },
  { en: "fritillary", tr: "Ters Lale" },
  { en: "red ginger", tr: "Kırmızı Zencefil Çiçeği" },
  { en: "grape hyacinth", tr: "Arap Sümbülü" },
  { en: "corn poppy", tr: "Gelincik" },
  { en: "prince of wales feathers", tr: "Galler Prensi Tüyü Çiçeği" },
  { en: "stemless gentian", tr: "Centiyan (Kök Boyası)" },
  { en: "artichoke", tr: "Enginar Çiçeği" },
  { en: "sweet william", tr: "Hüsnüyusuf" },
  { en: "carnation", tr: "Karanfil" },
  { en: "garden phlox", tr: "Alev Çiçeği" },
  { en: "love in the mist", tr: "Çörek Otu Çiçeği" },
  { en: "mexican aster", tr: "Meksika Yıldızı" },
  { en: "alpine sea holly", tr: "Alp Deniz Boğadikeni" },
  { en: "ruby-lipped cattleya", tr: "Cattleya Orkidesi" },
  { en: "cape flower", tr: "Pelerin Çiçeği" },
  { en: "great masterwort", tr: "Yıldız Otu" },
  { en: "siam tulip", tr: "Siyam Lalesi" },
  { en: "lenten rose", tr: "Noel Gülü" },
  { en: "barbeton daisy", tr: "Gerbera Papatyası" },
  { en: "daffodil", tr: "Nergis (Zerrin)" },
  { en: "sword lily", tr: "Glayöl (Kılıç Zambağı)" },
  { en: "poinsettia", tr: "Atatürk Çiçeği" },
  { en: "bolero deep blue", tr: "Mavi Çan Çiçeği" },
  { en: "wallflower", tr: "Şebboy" },
  { en: "marigold", tr: "Kadife Çiçeği" },
  { en: "buttercup", tr: "Düğün Çiçeği" },
  { en: "oxeye daisy", tr: "Öküzgözü Papatyası" },
  { en: "common dandelion", tr: "Karahindiba" },
  { en: "petunia", tr: "Petunya" },
  { en: "wild pansy", tr: "Hercai Menekşe" },
  { en: "primula", tr: "Çuha Çiçeği" },
  { en: "sunflower", tr: "Ayçiçeği" },
  { en: "pelargonium", tr: "Itır (Sardunya)" },
  { en: "bishop of llandaff", tr: "Llandaff Yıldız Çiçeği" },
  { en: "gaura", tr: "Kelebek Çiçeği" },
  { en: "geranium", tr: "Turnagagası" },
  { en: "orange dahlia", tr: "Turuncu Yıldız Çiçeği" },
  { en: "pink-yellow dahlia", tr: "Pembe-Sarı Yıldız Çiçeği" },
  { en: "cautleya spicata", tr: "Zencefil Süseni" },
  { en: "japanese anemone", tr: "Japon Anemonu" },
  { en: "black-eyed susan", tr: "Karagözlü Susan" },
  { en: "silverbush", tr: "Gümüş Çalı" },
  { en: "californian poppy", tr: "Kaliforniya Gelinciği" },
  { en: "osteospermum", tr: "Afrika Papatyası" },
  { en: "spring crocus", tr: "İlkbahar Çiğdemi" },
  { en: "bearded iris", tr: "Sakallı Süsen" },
  { en: "windflower", tr: "Rüzgar Anemonu" },
  { en: "tree poppy", tr: "Ağaç Gelinciği" },
  { en: "gazania", tr: "Hazine Çiçeği (Gazanya)" },
  { en: "azalea", tr: "Açelya" },
  { en: "water lily", tr: "Nilüfer (Su Zambağı)" },
  { en: "rose", tr: "Gül" },
  { en: "thorn apple", tr: "Boru Çiçeği (Tatula)" },
  { en: "morning glory", tr: "Kahkaha Çiçeği" },
  { en: "passion flower", tr: "Çarkıfelek" },
  { en: "lotus lotus", tr: "Kutsal Lotus" },
  { en: "toad lily", tr: "Kurbağa Zambağı" },
  { en: "anthurium", tr: "Antoryum (Flamingo Çiçeği)" },
  { en: "frangipani", tr: "Plumeria" },
  { en: "clematis", tr: "Akasma" },
  { en: "hibiscus", tr: "Ebegümeci (Bamya Çiçeği)" },
  { en: "columbine", tr: "Hasekiküpesi" },
  { en: "desert-rose", tr: "Çöl Gülü" },
  { en: "tree mallow", tr: "Ağaç Malvası" },
  { en: "magnolia", tr: "Manolya" },
  { en: "cyclamen", tr: "Siklamen (Tavşankulağı)" },
  { en: "watercress", tr: "Su Teresi" },
  { en: "canna lily", tr: "Kanna Lalesi" },
  { en: "hippeastrum", tr: "Güzelhatun Çiçeği" },
  { en: "bee balm", tr: "Arı Melisası" },
  { en: "ball moss", tr: "Top Yosunu" },
  { en: "foxglove", tr: "Yüksük Otu" },
  { en: "bougainvillea", tr: "Begonvil" },
  { en: "camellia", tr: "Kamelya" },
  { en: "mallow", tr: "Ebegümeci" },
  { en: "mexican petunia", tr: "Meksika Petunyası" },
  { en: "bromelia", tr: "Bromelyan" },
  { en: "blanket flower", tr: "Kokart Çiçeği" },
  { en: "trumpet creeper", tr: "Acem Borusu" },
  { en: "blackberry lily", tr: "Böğürtlen Zambağı" }
].sort((a, b) => a.tr.localeCompare(b.tr));

export default function FlowerList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFlowers = ALL_FLOWERS.filter(flower =>
    flower.tr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flower.en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen">
      <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-stone-200 p-6 z-10 space-y-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-800"> Bitki Listesi</h1>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Bitki adı ara... (Türkçe veya İngilizce)"
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder-stone-400 text-stone-800"
          />
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 divide-y divide-stone-100">
        {filteredFlowers.length > 0 ? (
          filteredFlowers.map((flower, index) => (
            <div
              key={index}
              onClick={() => navigate(`/flower/${flower.en.toLowerCase()}`)}
              className="py-3.5 px-4 rounded-xl hover:bg-emerald-50/50 cursor-pointer group transition-all flex items-center justify-between border border-transparent hover:border-emerald-100/60"
            >
              <div className="flex items-center space-x-3.5">
                <LuFlower2 />                <div>
                  <h3 className="text-sm font-bold text-stone-700 group-hover:text-emerald-700 transition-colors">
                    {flower.tr}
                  </h3>
                  <p className="text-xs text-stone-400 italic font-medium group-hover:text-emerald-600/70 transition-colors">
                    {flower.en}
                  </p>
                </div>
              </div>
              <span className="text-stone-300 group-hover:text-emerald-500 transform group-hover:translate-x-0.5 transition-all text-xs font-bold">
                İncele →
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-stone-400 text-sm italic">
            "<strong>{searchTerm}</strong>" ile eşleşen bir bitki kaydı bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}