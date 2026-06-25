from fastapi import FastAPI, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import io
import psycopg2
from pydantic import BaseModel

app = FastAPI(title="BotanAİ Vision API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PostCreate(BaseModel):
    firebase_uid: str
    author_name: str
    author_photo: str
    plant_name: str
    post_text: str
    image_url: str

class LikeRequest(BaseModel):
    firebase_uid: str

def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        database="flowerDataBase", 
        user="postgres",
        password="1234"
    )


cat_to_name = {
    "1": "pink primrose", "2": "hard-leaved pocket orchid", "3": "canterbury bells",
    "4": "sweet pea", "5": "english marigold", "6": "tiger lily", "7": "moon orchid",
    "8": "bird of paradise", "9": "monkshood", "10": "globe thistle", "11": "snapdragon",
    "12": "colt's foot", "13": "king protea", "14": "spear thistle", "15": "yellow iris",
    "16": "globe-flower", "17": "purple coneflower", "18": "peruvian lily", "19": "balloon flower",
    "20": "giant white arum lily", "21": "fire lily", "22": "pincushion flower", "23": "fritillary",
    "24": "red ginger", "25": "grape hyacinth", "26": "corn poppy", "27": "prince of wales feathers",
    "28": "stemless gentian", "29": "artichoke", "30": "sweet william", "31": "carnation",
    "32": "garden phlox", "33": "love in the mist", "34": "mexican aster", "35": "alpine sea holly",
    "36": "ruby-lipped cattleya", "37": "cape flower", "38": "great masterwort", "39": "siam tulip",
    "40": "lenten rose", "41": "barbeton daisy", "42": "daffodil", "43": "sword lily", "44": "poinsettia",
    "45": "bolero deep blue", "46": "wallflower", "47": "marigold", "48": "buttercup", "49": "oxeye daisy",
    "50": "common dandelion", "51": "petunia", "52": "wild pansy", "53": "primula", "54": "sunflower",
    "55": "pelargonium", "56": "bishop of llandaff", "57": "gaura", "58": "geranium", "59": "orange dahlia",
    "60": "pink-yellow dahlia", "61": "cautleya spicata", "62": "japanese anemone", "63": "black-eyed susan",
    "64": "silverbush", "65": "californian poppy", "66": "osteospermum", "67": "spring crocus",
    "68": "bearded iris", "69": "windflower", "70": "tree poppy", "71": "gazania", "72": "azalea",
    "73": "water lily", "74": "rose", "75": "thorn apple", "76": "morning glory", "77": "passion flower",
    "78": "lotus lotus", "79": "toad lily", "80": "anthurium", "81": "frangipani", "82": "clematis",
    "83": "hibiscus", "84": "columbine", "85": "desert-rose", "86": "tree mallow", "87": "magnolia",
    "88": "cyclamen", "89": "watercress", "90": "canna lily", "91": "hippeastrum", "92": "bee balm",
    "93": "ball moss", "94": "foxglove", "95": "bougainvillea", "96": "camellia", "97": "mallow",
    "98": "mexican petunia", "99": "bromelia", "100": "blanket flower", "101": "trumpet creeper",
    "102": "blackberry lily"
}

class_names = sorted([str(i) for i in range(1, 103)])


print("Yapay Zeka Modeli Yükleniyor...")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = models.mobilenet_v2(weights=None)

num_ftrs = model.classifier[1].in_features
model.classifier[1] = nn.Linear(num_ftrs, 102)

try:
    model.load_state_dict(torch.load("flower_model_best.pth", map_location=device))
    model.to(device)
    model.eval() 
    print("Model başarıyla yüklendi ")
except Exception as e:
    print(f"HATA: flower_model.pth dosyası okunamadı! Lütfen dosyanın main.py ile aynı klasörde olduğundan emin ol. Detay: {e}")


transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])


@app.post("/predict")
async def predict_flower(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        tensor_image = transform(image).unsqueeze(0).to(device)
        
        with torch.no_grad():
            outputs = model(tensor_image)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
            
            top_probs, top_indices = torch.topk(probabilities, 3, dim=0)
            
            results = []
            for i in range(3):
                idx = top_indices[i].item()
                prob = round(top_probs[i].item() * 100, 2)
                folder_name = class_names[idx]
                english_name = cat_to_name[folder_name]
                results.append({"flower_en": english_name, "accuracy": prob})
            
            main_result = results[0]
            similar_flowers = results[1:] # Geri kalan 2 ihtimal
            
            is_recognized = main_result["accuracy"] >= 20.0
            
            return {
                "success": True,
                "recognized": is_recognized,
                "flower_en": main_result["flower_en"],
                "accuracy": main_result["accuracy"],
                "similar_flowers": similar_flowers
            }

    except Exception as e:
        return {"success": False, "error": str(e)}


@app.post("/api/posts")
def create_post(post: PostCreate):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO posts (firebase_uid, author_name, author_photo, plant_name, post_text, image_url)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (post.firebase_uid, post.author_name, post.author_photo, post.plant_name, post.post_text, post.image_url))
        conn.commit()
        cur.close()
        conn.close()
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.get("/api/posts")
def get_posts():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, firebase_uid, author_name, author_photo, plant_name, post_text, image_url, created_at FROM posts ORDER BY created_at DESC")
        rows = cur.fetchall()
        cur.close()
        conn.close()

        posts = []
        for row in rows:
            posts.append({
                "id": row[0],
                "author_name": row[2],
                "author_photo": row[3],
                "plant_name": row[4],
                "post_text": row[5],
                "image_url": row[6]
            })
        return {"success": True, "posts": posts}
    except Exception as e:
        return {"success": False, "error": str(e)}
    
@app.get("/api/users/{uid}/posts")
def get_user_posts(uid: str):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, firebase_uid, author_name, author_photo, plant_name, post_text, image_url, created_at FROM posts WHERE firebase_uid = %s ORDER BY created_at DESC", (uid,))
        rows = cur.fetchall()
        cur.close()
        conn.close()

        posts = []
        for row in rows:
            posts.append({
                "id": row[0],
                "author_name": row[2],
                "author_photo": row[3],
                "plant_name": row[4],
                "post_text": row[5],
                "image_url": row[6]
            })
        return {"success": True, "posts": posts}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.delete("/api/posts/{post_id}")
def delete_post(post_id: int):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM posts WHERE id = %s", (post_id,))
        conn.commit()
        cur.close()
        conn.close()
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}
    # --- 9. ENDPOINT: KULLANICI ARAMA (KEŞFET SAYFASI) ---
@app.get("/api/search/users")
def search_users(q: str = ""):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        search_term = f"%{q}%"
        cur.execute("""
            SELECT firebase_uid, author_name, author_photo, COUNT(id) as post_count 
            FROM posts 
            WHERE author_name ILIKE %s 
            GROUP BY firebase_uid, author_name, author_photo
            ORDER BY post_count DESC
        """, (search_term,))
        
        rows = cur.fetchall()
        cur.close()
        conn.close()

        users = []
        for row in rows:
            users.append({
                "uid": row[0],
                "name": row[1],
                "photo": row[2],
                "post_count": row[3]
            })
        return {"success": True, "users": users}
    except Exception as e:
        return {"success": False, "error": str(e)}

# KULLANICI TAKIP ET 
@app.post("/api/follow/{followed_uid}")
def follow_user(followed_uid: str, follower_uid: str = Query(...)):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Zaten takip ediyorsa ekleme, takip etmiyorsa ekle
        cur.execute("SELECT 1 FROM follows WHERE follower_uid = %s AND followed_uid = %s", (follower_uid, followed_uid))
        if cur.fetchone() is None:
            cur.execute("""
                INSERT INTO follows (follower_uid, followed_uid)
                VALUES (%s, %s)
            """, (follower_uid, followed_uid))
            conn.commit()
        
        cur.close()
        conn.close()
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.delete("/api/follow/{followed_uid}")
def unfollow_user(followed_uid: str, follower_uid: str = Query(...)):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM follows WHERE follower_uid = %s AND followed_uid = %s", (follower_uid, followed_uid))
        conn.commit()
        cur.close()
        conn.close()
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/api/is-following/{followed_uid}")
def is_following(followed_uid: str, follower_uid: str = Query(...)):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM follows WHERE follower_uid = %s AND followed_uid = %s", (follower_uid, followed_uid))
        result = cur.fetchone()
        cur.close()
        conn.close()
        return {"success": True, "is_following": result is not None}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/api/followers-count/{uid}")
def get_followers_count(uid: str):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM follows WHERE followed_uid = %s", (uid,))
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        return {"success": True, "followers_count": count}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/api/following-count/{uid}")
def get_following_count(uid: str):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM follows WHERE follower_uid = %s", (uid,))
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        return {"success": True, "following_count": count}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/api/feed/{uid}")
def get_personalized_feed(uid: str):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT followed_uid FROM follows WHERE follower_uid = %s
        """, (uid,))
        followed_users = [row[0] for row in cur.fetchall()]
        
        followed_users.append(uid)
        
        if not followed_users:
            followed_users = [uid]
        placeholders = ','.join(['%s'] * len(followed_users))
        cur.execute(f"""
            SELECT id, firebase_uid, author_name, author_photo, plant_name, post_text, image_url, created_at 
            FROM posts 
            WHERE firebase_uid IN ({placeholders})
            ORDER BY created_at DESC
        """, followed_users)
        
        rows = cur.fetchall()
        cur.close()
        conn.close()

        posts = []
        for row in rows:
            posts.append({
                "id": row[0],
                "author_name": row[2],
                "author_photo": row[3],
                "plant_name": row[4],
                "post_text": row[5],
                "image_url": row[6]
            })
        return {"success": True, "posts": posts}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/api/posts/{post_id}/like-status")
def get_like_status(post_id: int, uid: str = ""):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Kullanıcı bu postu beğenmiş mi?
        cur.execute("SELECT 1 FROM post_likes WHERE firebase_uid = %s AND post_id = %s", (uid, post_id))
        is_liked = cur.fetchone() is not None
        
        # Postun toplam kaç beğenisi var?
        cur.execute("SELECT COUNT(*) FROM post_likes WHERE post_id = %s", (post_id,))
        like_count = cur.fetchone()[0]
        
        cur.close()
        conn.close()
        return {"success": True, "is_liked": is_liked, "like_count": like_count}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/api/posts/{post_id}/like")
def toggle_like(post_id: int, req: LikeRequest):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("SELECT 1 FROM post_likes WHERE firebase_uid = %s AND post_id = %s", (req.firebase_uid, post_id))
        exists = cur.fetchone()

        if exists:
            cur.execute("DELETE FROM post_likes WHERE firebase_uid = %s AND post_id = %s", (req.firebase_uid, post_id))
            action = "unliked"
        else:
            cur.execute("INSERT INTO post_likes (firebase_uid, post_id) VALUES (%s, %s)", (req.firebase_uid, post_id))
            action = "liked"
            
        cur.execute("SELECT COUNT(*) FROM post_likes WHERE post_id = %s", (post_id,))
        like_count = cur.fetchone()[0]

        conn.commit()
        cur.close()
        conn.close()
        return {"success": True, "action": action, "like_count": like_count}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/api/users/{uid}/liked-posts")
def get_liked_posts(uid: str):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT p.id, p.firebase_uid, p.author_name, p.author_photo, p.plant_name, p.post_text, p.image_url, p.created_at 
            FROM posts p
            JOIN post_likes pl ON p.id = pl.post_id
            WHERE pl.firebase_uid = %s
            ORDER BY pl.created_at DESC
        """, (uid,))
        rows = cur.fetchall()
        cur.close()
        conn.close()

        posts = []
        for row in rows:
            posts.append({
                "id": row[0],
                "author_name": row[2],
                "author_photo": row[3],
                "plant_name": row[4],
                "post_text": row[5],
                "image_url": row[6]
            })
        return {"success": True, "posts": posts}
    except Exception as e:
        return {"success": False, "error": str(e)}