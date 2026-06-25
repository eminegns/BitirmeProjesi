BİTKİ TÜRLERİNİ TESPİT EDEN WEB UYGULAMASI
 Emine GÜNEŞ-22040101036
2025-2026 Eğitim-Öğretim Yılı Bahar Dönemi

Proje Özeti
	Bu projede,bitki yetiştiriciliği ile ilgilenen kullanıcılar için bitki türlerini fotoğraflar üzerinde tespit eden ve Türkçe bakım bilgileri sunan bir web uygulaması geliştirmeyi
amaçlamış ve tamamlamıştır. Günümüzde bitki bakımına dair güvenilir kaynakların dağınık olması ve mevcut küresel uygulamaların yerel kullanıcılar için dil bariyeri oluşturması projenin
temel motivasyonudur. Geliştirilen sistemde, frontend için React.js ve TailwindCSS , backend olarak ise Python kullanılmıştır. Projenin merkezine, Oxford 102 Flowers veri setiyle eğitilmiş
MobileNetV2 modeli konumlandırılmıştır. Model tahminlerinde %20 altına sonuç vermeyen ve %20 üstüne en yüksek olasılıklı üç alternatifi sunan algoritması kodlanmıştır. Veritabanı
katmanında ise çiçek bakım rehberi ile sosyal etkileşim verilerini saklayan dört ana tablodan oluşan bir PostgreSQL mimarisi kurgulanmıştır. Proje çıktısı olarak, kullanıcıların kendi 
bitki arşivlerini oluşturabildiği ve birbirleriyle güvenli bir şekilde etkileşime geçebildiği sürdürülebilir bir sosyal botanik topluluk platformu hayata geçirilmiştir.
	 
Projede kullanılan veri seti boyut kısıtlamaları nedeniyle bu arşivin içine eklenmemiştir.
Veri Seti İndirme Bağlantısı: https://www.kaggle.com/datasets/nunenuh/pytorch-challange-flower-dataset?select=dataset

Projeyi çalıştırabilmek için bilgisayarınızda Node.js (v16.x+), Python (v3.8+) ve PostgreSQL (v13+) kurulu olmalıdır.
gerekli indirmeler için proje içindeki cicek-bitirme\src\service\requirements.txt dosyasındakiler indirilmeli kolayca indirmek için terminalde "pip install -r requirements.txt" komutunu 
çalıştırılırsa hepsi otomatik inmeye başlayacak.



Adım Adım Çalıştırma Talimatları
PostgreSQL içinde flowerDatabase adında yeni bir veritabanı oluşturun. ve gerekli tabloları oluşturun gerekliTablolar.sql içinde gerekli tablolar var.
flower tablosuna veri atmak için tumBitkiler.csv i tabloya import edilmesi gerekiyor.

database kısmı halledildildikten sonra 
"cd cicek-bitirme
npm install" react'ı çalıştırmak için indirilmesi gerekiyor

"cd cicek-bitirme
npm run dev" kodu terminale girilirse eğer frontend yani react kısmı çalışmaya başlayacak

"cd cicek-bitirme 
cd src
cd service
python -m uvicorn main:app --reload --port 8001" yani kısaca python'ın olduğu yerde "python -m uvicorn main:app --reload --port 8001" çalıştırılırsa bitki tanımlama işlemi için modele
.pth dosyasına ve diğer backend kodlarına ulaşılmış olacak

"cd cicek-bitirme
node src/service/server.cjs" çalıştırılırsa eğer bu seferde database kısmına bağlanılmış olacak ve web sitesi kullanılaya hazır hale gelecektir.

Proje sunumunda web sitesinin görüntüleriyle çalışma biçimi gösterilmiştir. İndirmekle uğraşılmak istenilmezse görüntülere bakabilirsiniz.	
