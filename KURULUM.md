# Cənub Xəbər — Quraşdırma təlimatı

Sayt **Next.js** ilə yazılıb. Xəbərlər **Supabase** verilənlər bazasında saxlanılır, xəbər şəkilləri **ImgBB**-yə yüklənir,
admin panel isə **https://www.cenubxeber.com/adminpanel** ünvanındadır. Sayt və admin panel eyni bazadan oxuyub yazdığı üçün
admin paneldə edilən dəyişiklik saytda **dərhal** (təxminən 1–2 saniyə ərzində) görünür.

> Qısa yol: 1) Supabase → 2) ImgBB → 3) Vercel Environment Variables → 4) Redeploy → 5) `/adminpanel`-ə daxil ol.

---

## 1. Supabase (verilənlər bazası)

1. https://supabase.com → **New project** yaradın (region: ən yaxın, məsələn *Frankfurt*). Database parolunu saxlayın.
2. Layihə hazır olandan sonra sol menyuda **SQL Editor → New query** açın.
3. Bu repodakı [`supabase/schema.sql`](supabase/schema.sql) faylının **bütün məzmununu** yapışdırıb **Run** düyməsini basın.
   Bu, `articles` (xəbərlər) və `messages` (əlaqə mesajları) cədvəllərini və baxış sayğacı funksiyasını yaradır.
4. **Project Settings → API** bölməsindən iki dəyər götürün:
   - **Project URL** → `SUPABASE_URL`
   - **`service_role` secret** açarı (**anon** yox!) → `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ `service_role` açarı bazaya tam giriş verir. Onu **yalnız Vercel Environment Variables**-a yazın,
> heç vaxt GitHub-a, kodun içinə və ya başqasına göndərməyin. Cədvəllərdə RLS aktivdir və açıq siyasət yoxdur —
> yəni bazaya yalnız server (bu açarla) çata bilir.

## 2. ImgBB (şəkil yükləmə)

1. https://imgbb.com saytında hesab açın / daxil olun.
2. https://api.imgbb.com/ səhifəsində **Get API key** ilə açarı alın → `IMGBB_API_KEY`.
3. Admin paneldə xəbər əlavə edərkən “Şəkil seç” düyməsi şəkli ImgBB-yə yükləyir və linki avtomatik yerinə qoyur
   (şəkil maksimum 8 MB).

## 3. Vercel Environment Variables

Vercel → layihə → **Settings → Environment Variables**. Aşağıdakıları əlavə edin
(**Production, Preview və Development** üçün işarələyin):

| Ad | Dəyər | Nə üçündür |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.cenubxeber.com` | Paylaşım linkləri, sitemap, Open Graph |
| `SUPABASE_URL` | Supabase **Project URL** | Verilənlər bazası ünvanı |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase **service_role** açarı | Serverin bazaya oxu/yaz girişi (məxfi!) |
| `IMGBB_API_KEY` | ImgBB API açarı | Xəbər şəkillərini yükləmək |
| `ADMIN_EMAIL` | Admin e-poçtu | Admin panelə giriş |
| `ADMIN_PASSWORD` | Admin parolu | Admin panelə giriş (məxfi!) |
| `ADMIN_SESSION_SECRET` | Təsadüfi uzun mətn (≥ 32 simvol) | Giriş sessiyasını imzalamaq (məxfi!) |

`ADMIN_SESSION_SECRET` yaratmaq üçün terminalda:

```bash
openssl rand -hex 32
```

Nəticəni olduğu kimi dəyər xanasına yapışdırın. Hər dəyişəndən sonra **Save** edin.

> Dəyişənləri əlavə etdikdən sonra **Deployments → ⋯ → Redeploy** etmək lazımdır (köhnə build yeni dəyişənləri görmür).

## 4. Domen

Vercel → **Settings → Domains** bölməsində `cenubxeber.com` və `www.cenubxeber.com` əlavə olunub, DNS qeydləri
(Cloudflare/registrar) Vercel-in göstərdiyi kimi olmalıdır. `NEXT_PUBLIC_SITE_URL` ilə eyni ünvanı (`www`) istifadə edin.

## 5. Admin panel

- Ünvan: **https://www.cenubxeber.com/adminpanel**
- Giriş: `ADMIN_EMAIL` və `ADMIN_PASSWORD` dəyərləri.
- Imkanlar:
  - **Xəbərlər** — siyahı, axtarış, redaktə, silmə, “Gündəm”ə əlavə et/çıxar, dərc et/gizlət (qaralama).
  - **Yeni xəbər** — başlıq, kateqoriya, müəllif, qısa təsvir, mətn (abzaslar boş sətirlə ayrılır), şəkil (ImgBB), dərc tarixi və saatı.
  - **Mesajlar** — “Əlaqə” səhifəsindən gələn mesajlar.
- Gələcək tarix seçsəniz xəbər həmin vaxtdan sonra saytda görünəcək.
- Paneldə dəyişiklik edəndə sayt keşi avtomatik təzələnir.

### Təhlükəsizlik qeydləri

- Giriş sessiyası imzalı, `HttpOnly` + `Secure` cookie ilə 7 gün saxlanılır; **Çıxış** düyməsi onu silir.
- Admin API-ləri hər sorğuda sessiyanı yoxlayır; dəyişdirici sorğular yalnız eyni saytdan qəbul olunur.
- `/adminpanel` axtarış sistemlərindən gizlədilib (`noindex`, `robots.txt`).
- Parolu başqası ilə bölüşmək məcburiyyətində qalsanız, Vercel-də `ADMIN_PASSWORD`-u dəyişib Redeploy edin;
  `ADMIN_SESSION_SECRET`-i dəyişmək isə bütün açıq sessiyaları dərhal bağlayır.
- Parolu və açarları söhbətlərdə/mesajlarda paylaşmaq əvəzinə yalnız Vercel-də saxlayın. Əgər artıq paylaşılıbsa,
  yeni parol təyin etməyiniz tövsiyə olunur.

## 6. Yerli işləmə (istəyə bağlı)

```bash
cp .env.example .env.local   # dəyərləri doldurun
npm install
npm run dev                  # http://localhost:3000
```

## 7. Sosial şəbəkə və əlaqə məlumatları

[`src/lib/site.ts`](src/lib/site.ts) faylında: Facebook, Instagram, YouTube, TikTok linkləri (`SOCIALS`),
telefon (`SITE_PHONE`) və e-poçt (`SITE_EMAIL`). Linkləri öz rəsmi hesab ünvanlarınızla əvəz edin.

## Xəbər paylaşımı

Hər xəbər səhifəsinin altında **Facebook, Instagram, WhatsApp, Telegram, X** və “linki kopyala” düymələri var.
Link paylaşılanda Facebook/Telegram/WhatsApp xəbərin **şəkli, başlığı və qısa təsviri** ilə post kartı göstərir
(Open Graph). Instagram link paylaşma intentini dəstəkləmir — mobil cihazda cihazın paylaşma pəncərəsi açılır,
masaüstündə link kopyalanır.
