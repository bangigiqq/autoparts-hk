# 欣榮汽配專門店 (AutoParts HK)

完整電商示範網站，融合兩個參考站的設計與流程：

- [Enlarge 商品詳情 #1411](https://enlargecorp.co.jp/products/detail/1411) — 車種套件詳情、評價、分類導航、收藏
- [欣榮偈油 訂單完成頁](https://ywengineoil.com/go-checkout/order-received/16395/) — 轉數快 FPS 付款、訂單追蹤、會員專區

## 功能

| 模組 | 說明 |
|------|------|
| 商品目錄 | 分類篩選、搜尋、精選商品 |
| 商品詳情 | 圖片、規格、評價、加入購物車、收藏 |
| 購物車 | LocalStorage 持久化 |
| 結帳 | 運送方式、FPS 付款 |
| 訂單完成 | 提交 FPS 參考編號 |
| 會員 | 註冊、登入、訂單歷史、收藏清單 |

## 技術棧

- **前端**: Next.js 16 App Router、React、Tailwind CSS
- **後端**: Next.js API Routes
- **資料庫**: SQLite (better-sqlite3)
- **認證**: JWT HttpOnly Cookie + bcrypt

## 快速開始

```bash
cd workspace/autoparts-hk
npm install
npm run dev
```

瀏覽 http://localhost:3000

首次啟動會自動建立資料庫並填入示範商品。

### 示範帳號

- 會員：`demo@example.com` / `demo1234`
- **管理後台**：http://localhost:3000/admin/login  
  - 電郵：`admin@xinrong.hk`  
  - 密碼：`admin1234`

後台功能：總覽、商品 CRUD、**分類 CRUD**（功能／品牌／招募）、訂單狀態／FPS 編號、會員列表。

## 專案結構

```
src/
  app/          # 頁面與 API
  components/   # UI 元件
  context/      # 購物車 Context
  lib/          # DB、認證、業務邏輯
data/           # SQLite 資料庫 (自動建立)
```

## 環境變數

```env
AUTH_SECRET=your-production-secret
```

## 管理後台

| 路徑 | 說明 |
|------|------|
| `/admin/login` | 管理員登入 |
| `/admin` | 總覽儀表板 |
| `/admin/products` | 商品列表／新增／編輯 |
| `/admin/categories` | 分類列表（三種類型 Tab）／新增／編輯 |
| `/admin/orders` | 訂單列表／詳情 |
| `/admin/users` | 會員列表 |

後端 API 位於 `src/app/api/admin/*`，需管理員 Cookie 權限。

## 上傳到 GitHub（網上瀏覽程式碼）

專案已可在本機用 Git 管理。推送到 GitHub 後，可在瀏覽器查看所有檔案與 README。

### 步驟

1. **建立空倉庫**（不要勾選「Add a README」）  
   開啟：https://github.com/new?name=autoparts-hk  
   倉庫名稱建議：`autoparts-hk`，可設為 Public。

2. **推送**（在專案目錄 `workspace/autoparts-hk` 執行）：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/push-to-github.ps1 -Owner 你的GitHub用戶名
```

若你的帳號是 `bangigiqq`，可直接：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/push-to-github.ps1
```

或手動：

```bash
git remote add origin https://github.com/你的用戶名/autoparts-hk.git
git push -u origin main
```

3. **在網上開啟**  
   `https://github.com/你的用戶名/autoparts-hk`

首次 `git push` 時，瀏覽器可能會要求登入 GitHub（建議使用 [Personal Access Token](https://github.com/settings/tokens) 作為密碼）。

> **說明**：GitHub 適合瀏覽與分享**原始碼**。若要讓訪客**實際操作網店**（下單、後台），需另外部署到 Vercel 等主機；本專案使用本機 SQLite，上雲需改用 Turso / Neon 等資料庫。

## API 端點

- `POST /api/auth/register` — 註冊
- `POST /api/auth/login` — 登入
- `GET /api/auth/me` — 當前用戶
- `GET /api/products` — 商品列表
- `POST /api/orders` — 建立訂單
- `GET/PATCH /api/orders/[id]` — 訂單詳情 / FPS 編號
- `GET/POST/DELETE /api/wishlist` — 收藏

## 授權

示範專案，僅供學習與原型使用。
