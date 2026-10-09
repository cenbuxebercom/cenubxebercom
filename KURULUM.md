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
   (şəkil cihazdan seçilir, yüklənməzdən əvvəl brauzerdə avtomatik sıxılır — ən uzun tərəf 1600px; saytda isə WebP/AVIF formatında və uyğun ölçüdə təqdim olunur, buna görə xəbərlər tez açılır).

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
| `GEMINI_API_KEY` | Google AI Studio açarı (**pulsuz**) | Başqa saytlardan çəkilən xəbərləri AI ilə yenidən yazmaq |
| `GEMINI_MODEL` *(istəyə bağlı)* | `gemini-3.8-flash` (defolt) | Yenidən yazan pulsuz model |
| `ANTHROPIC_API_KEY` *(istəyə bağlı, ödənişli)* | Anthropic API açarı | Yalnız `GEMINI_API_KEY` yoxdursa istifadə olunur |
| `CRON_SECRET` | Təsadüfi uzun mətn (`openssl rand -hex 24`) | Gündəlik avtomatik çəkməni (cron) qorumaq |
| `RESEND_API_KEY` | Resend API açarı | Əlaqə formundan gələn mesajı `info@cenubxeber.com`-a e-poçtla göndərmək |
| `CONTACT_TO_EMAIL` *(istəyə bağlı)* | `info@cenubxeber.com` | Mesajın düşəcəyi ünvan (boş qalsa `info@cenubxeber.com`) |
| `CONTACT_FROM_EMAIL` *(istəyə bağlı)* | `Cənub Xəbər <noreply@cenubxeber.com>` | Göndərən ünvan (domen Resend-də təsdiqlənməlidir) |

`ADMIN_SESSION_SECRET` yaratmaq üçün terminalda:

```bash
openssl rand -hex 32
```

Nəticəni olduğu kimi dəyər xanasına yapışdırın. Hər dəyişəndən sonra **Save** edin.

> Dəyişənləri əlavə etdikdən sonra **Deployments → ⋯ → Redeploy** etmək lazımdır (köhnə build yeni dəyişənləri görmür).

## 3b. Əlaqə formundan gələn mesajların `info@cenubxeber.com`-a düşməsi (Resend)

Əlaqə formu hər mesajı **e-poçtla `info@cenubxeber.com`-a** göndərir.
E-poçt göndərmək üçün Resend (pulsuz plan: ayda 3000 məktub) lazımdır:

1. https://resend.com → hesab yaradın → **Domains → Add Domain** → `cenubxeber.com`.
2. Resend-in göstərdiyi DNS qeydlərini (SPF/DKIM — adətən 3 TXT/MX qeydi) Cloudflare DNS-də əlavə edin, **Verify** edin.
3. **API Keys → Create API Key** (Sending access) → açarı `RESEND_API_KEY` kimi Vercel-ə yazın → Redeploy.
4. `info@cenubxeber.com` real poçt qutusu olmalıdır. Yoxdursa Cloudflare → **Email → Email Routing** ilə
   `info@cenubxeber.com` → öz Gmail ünvanınıza yönləndirmə yaradın (pulsuzdur).

**Ən asan alternativ — Gmail SMTP (domen təsdiqi və DNS lazım deyil):** Google Hesab → Təhlükəsizlik → 2 mərhələli doğrulamanı aktiv edin →
**Tətbiq parolları (App passwords)** → ad: “Cənub Xəbər” → 16 simvollu parolu kopyalayın. Vercel-də əlavə edin:
`SMTP_USER` = Gmail ünvanınız, `SMTP_PASS` = həmin 16 simvol, `CONTACT_TO_EMAIL` = mesajların düşəcəyi ünvan (məs. eyni Gmail). Redeploy.
`SMTP_USER`/`SMTP_PASS` varsa Resend əvəzinə SMTP istifadə olunur.

**Yoxlama və xətaların səbəbi:** admin panelin yuxarısındakı **“E-poçt testi”** düyməsi test məktubu göndərir və problem varsa
Resend-in dəqiq xəta mətnini göstərir. Hər mesajın yanında da “e-poçta göndərildi” / “e-poçta düşmədi: …” statusu görünür
(bunun üçün `supabase/schema.sql`-i bir də işə salın). Ən çox rast gəlinən səbəblər:

| Xəta | Həlli |
|---|---|
| `RESEND_API_KEY ... təyin edilməyib` | Dəyişəni əlavə edin və **Redeploy** edin (köhnə build yeni dəyişəni görmür) |
| `403 ... domain is not verified` | Resend → Domains → `cenubxeber.com` **Verified** olmalıdır (DNS qeydləri Cloudflare-də “DNS only” rejimində) |
| `422 ... Invalid from` | `CONTACT_FROM_EMAIL` formatı: `Cənub Xəbər <noreply@cenubxeber.com>` və domen təsdiqlənmiş olmalıdır |
| `401 ... API key is invalid` | Açarı Resend-də yenidən yaradın (Sending access) |
| Test uğurlu, amma məktub gəlmir | Spam qovluğuna baxın; `info@cenubxeber.com` real poçt qutusu/yönləndirmə olmalıdır (Cloudflare Email Routing) |

Resend qurulmayıbsa mesajlar yenə də admin paneldə "Mesajlar" bölməsində görünür, sadəcə e-poçta düşmür.

## 3c. Avtomatik xəbər çəkmə (başqa saytlardan + AI yenidən yazma)

**Əvvəlcə SQL:** Supabase → SQL Editor → `supabase/schema.sql` faylının **bütün məzmununu yenidən** yapışdırıb Run edin
(fayl təkrar işə salınanda təhlükəsizdir; yalnız çatışmayan sütun/cədvəlləri əlavə edir: `sources`, `import_log`,
`articles.source_url / source_name / imported`).

**Pulsuz AI açarı (xərc yoxdur):** https://aistudio.google.com/apikey → Google hesabı ilə daxil ol → **Create API key** (kart tələb olunmur) →
Vercel-də `GEMINI_API_KEY` kimi əlavə et → Redeploy. Pulsuz səviyyənin dəqiqəlik/günlük limiti var; bot xəbərlər arasında gözləyir və
limit dolanda xəta yazır (bir az sonra və ya sabah yenidən “Çək” basın). Pulsuz səviyyədə Google göndərilən məzmunu məhsullarını
yaxşılaşdırmaq üçün istifadə edə bilər — burada yalnız ictimai xəbər mətnləri göndərilir.
(İstəsəniz ödənişli `ANTHROPIC_API_KEY` də istifadə oluna bilər; `GEMINI_API_KEY` varsa o prioritetdir.)

**İstifadə:** `/adminpanel` → **Avto-çəkmə**:
1. Mənbə əlavə edin: ad + RSS linki (məs. `https://sayt.az/rss`) və ya saytın ana/bölmə səhifəsi. RSS tapılmasa sistem
   səhifədəki xəbər linklərini özü tapmağa çalışır.
2. **Çək** düyməsi: yeni xəbər linklərini tapır → hər birini oxuyur → AI mətni **öz sözləri ilə, fərqli cümlə quruluşu ilə**
   yenidən yazır → başqa saytların adı/domeni və “X-ə istinadən” ifadələri silinir (“Cənub Xəbər bildirir ki…” ilə əvəz olunur) →
   şəkil ImgBB-yə yüklənir → xəbər **qaralama** kimi saxlanılır. Yoxlayıb **Dərc et** basın
   (mənbədə “Birbaşa dərc” seçilibsə avtomatik dərc olunur).
3. Bot yoxlamaları: mənbə saytın `robots.txt` qadağası, mətn çox qısa/reklam, 5 sözlük eyni ardıcıllıq (oxşarlıq) — xəbər ötürülür.
   Eyni link ikinci dəfə çəkilmir (silinmiş xəbər də geri gəlmir).
4. **Toplu silmə:** “Xəbərlər” bölməsində süzgəc (Hamısı / Dərc olunmuş / Qaralamalar / Avto-çəkilmiş), “Hamısını seç”, “Seçilmişləri sil”.

**Gündəlik avtomatik çəkmə:** `vercel.json` hər gün 03:00 UTC-də `/api/cron/import` çağırır (aktiv mənbələrdən, hər mənbə üçün
“Maks/dəfə” qədər). `CRON_SECRET` təyin olunmalıdır — Vercel onu avtomatik `Authorization: Bearer …` başlığı ilə göndərir.
Vercel Hobby planı yalnız gündə 1 dəfə cron icazə verir; daha tez-tez üçün Pro plan və ya xarici planlayıcı
(cron-job.org → `GET https://www.cenubxeber.com/api/cron/import`, başlıq `Authorization: Bearer <CRON_SECRET>`) istifadə edin.

> ⚠️ Hüquqi qeyd: başqa media saytlarının məzmununu çəkmək müəllif hüquqları və həmin saytların şərtləri baxımından risklidir.
> Yalnız icazəniz olan və ya RSS ilə açıq paylaşılan mənbələrdən istifadə edin, çəkilən xəbərləri dərcdən əvvəl oxuyun.
> Sistem mənbə linkini daxili olaraq (`source_url`) saxlayır, saytda göstərmir.

## 4. Domen

Vercel → **Settings → Domains** bölməsində `cenubxeber.com` və `www.cenubxeber.com` əlavə olunub, DNS qeydləri
(Cloudflare/registrar) Vercel-in göstərdiyi kimi olmalıdır. `NEXT_PUBLIC_SITE_URL` ilə eyni ünvanı (`www`) istifadə edin.

## 5. Admin panel

- Ünvan: **https://www.cenubxeber.com/adminpanel**
- Giriş: `ADMIN_EMAIL` və `ADMIN_PASSWORD` dəyərləri.
- Imkanlar:
  - **Xəbərlər** — siyahı, axtarış, redaktə, silmə, “Gündəm”ə əlavə et/çıxar, dərc et/gizlət (qaralama).
  - **Yeni xəbər** — başlıq, kateqoriya, müəllif, qısa təsvir, mətn (abzaslar boş sətirlə ayrılır), şəkil (ImgBB), dərc tarixi və saatı.
  - **E-poçt testi** düyməsi — test məktubu göndərib e-poçt ayarlarını yoxlayır. “Əlaqə” səhifəsindəki form mesajı birbaşa `info@cenubxeber.com`-a göndərir (admin paneldə saxlanılmır).
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
