import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoBookSharp } from "react-icons/io5";

const FLOWER_DATA = [
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
  { text: "sweet william", tr: "Hüsnüyusuf" },
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
];

export default function RightBar() {
  const navigate = useNavigate();
  const [suggestedFlowers, setSuggestedFlowers] = useState([]);

  useEffect(() => {
    const pickRandomFlowers = () => {
      const shuffled = [...FLOWER_DATA].sort(() => 0.5 - Math.random());
      setSuggestedFlowers(shuffled.slice(0, 5));
    };

    pickRandomFlowers();
  }, []);

  const handleFlowerClick = (flower) => {
    const urlName = flower.en.toLowerCase();
    navigate(`/flower/${urlName}`);
  };

  return (
    <aside className="w-80 h-screen sticky top-0 hidden lg:block p-6 pl-8 space-y-6">
      <div className="bg-white rounded-2xl p-5 space-y-4 border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-stone-800 tracking-tight flex items-center space-x-1.5">
            <IoBookSharp />
            <span>Çiçek</span>
          </h3>
          
        </div>

        <p className="text-xs text-stone-400 leading-normal">
          Görmek isteyeceğiniz 5 farklı bitki.
        </p>

        <div className="space-y-1">
          {suggestedFlowers.map((flower, index) => (
            <div
              key={index}
              onClick={() => handleFlowerClick(flower)}
              className="p-3 rounded-xl hover:bg-emerald-50/60 group cursor-pointer transition-all duration-200 border border-transparent hover:border-emerald-100 flex flex-col space-y-0.5"
            >
              <p className="text-sm font-bold text-stone-700 group-hover:text-emerald-700 transition-colors">
                {flower.tr}
              </p>
              <p className="text-xs text-stone-400 italic font-medium group-hover:text-emerald-600/80 transition-colors">
                {flower.en}
              </p>
            </div>
          ))}
        </div>
      </div>


    </aside>
  );
}