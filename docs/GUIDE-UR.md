# Roman Urdu Guide — site chalane aur AdSense approve karwane ka tareeqa

> ## 🟢 LIVE SITE
> **https://kindlestories.vercel.app** — deploy ho chuki hai aur chal rahi hai.
> Vercel project ka naam: `kindle_stories` (team: `pos-free`).
> Aage custom domain lagane ke liye step 1A parhein.

---

## 1A. Custom domain lagana (jab domain kharid lein)

1. Vercel → project `kindle_stories` → **Settings → Domains** → apna domain add karein (e.g. `yourdomain.com`).
2. Vercel jo DNS records dega (A record + CNAME) wo apne domain provider (Namecheap, GoDaddy, Cloudflare) mein add karein.
3. Phir **Settings → Environment Variables** mein ye add karein:
   - `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com`
4. **Deployments → latest → ⋯ → Redeploy** dabayein (environment variable tab hi lagta hai).

> Wajah: `NEXT_PUBLIC_SITE_URL` se sitemap, RSS aur canonical URLs bante hain. Ye set na ho to site khud `*.vercel.app` URL use karti hai — jo abhi theek chal raha hai, lekin custom domain ke baad ise update karna zaroori hai.


Ye guide un "non-developer" steps ke liye hai jo aap ko website live karne, article publish karne aur AdSense approve karwane ke liye chahiye.

---

## 1. Site ko pehli baar live karna (Vercel)

1. Ye repository GitHub par push karein (agar pehle se nahi hai).
2. [vercel.com](https://vercel.com) par login karein → **Add New → Project** → apni repo import karein.
3. Framework khud detect ho jayega (Next.js). Build settings mein kuch change nahi karna.
4. **Environment Variables** mein sirf ye add karein:
   - `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com`
5. **Deploy** dabayein. 2–3 minute mein site live ho jayegi (`your-project.vercel.app`).
6. Domain kharid kar **Settings → Domains** se connect karein. DNS mein Vercel ke diye gaye records add karne honge (usually A record + CNAME).

> Deploy ke baad `NEXT_PUBLIC_SITE_URL` mein asli domain daal kar dobara deploy karein. Isse sitemap, RSS aur canonical links sahi banenge.

---

## 2. Naya article likhna (rozana ka kaam)

**Aasan tareeqa — mujh se likhwayein:**

Bas mujhe message karein, misaal ke taur par:

> "Aaj ke liye 2 articles likho: `food` category mein ek, `money` mein ek."

Main `content/posts/` mein naye `.mdx` files bana dunga, SEO fields (title, description, keywords, FAQ) ke saath. Aap sirf review karke publish karenge.

**Khud likhna ho to:**

```bash
npm run new -- --title "Aapka Article Title" --category food
```

Isse `content/posts/` mein file ban jayegi. Us mein:
- `draft: true` ko `draft: false` kar dein (warna production mein nahi dikhega)
- Body likh dein
- `npm run seo:check` chalayein — koi warning aaye to theek karein

Phir GitHub par commit/push — Vercel khud naya version deploy kar dega.

**Categories:** `food`, `health`, `money`, `home`, `tech`, `travel`, `work` — aur fiction ke liye `--story` flag.

---

## 3. Google mein index karwana

1. [Google Search Console](https://search.google.com/search-console) mein site add karein (domain verify karein — DNS se sab se aasan hai).
2. **Sitemaps** mein `https://yourdomain.com/sitemap.xml` submit karein.
3. **URL Inspection** mein homepage ka URL daal kar **Request Indexing** dabayein.
4. 15–20 articles publish hone ke baad hi AdSense apply karein — kam content par reject hone ke chances zyada hote hain.

Sitemap automatically ban jata hai: har naya article push karne par us mein khud aa jata hai.

---

## 4. Google AdSense approve karwane ka plan

### Apply karne se pehle ye zaroori hai

- [x] **Original content** — kam az kam 15–25 articles, har ek 900+ words. (Abhi 12 sample hain — inhe apne content se replace ya expand karein.)
- [x] **Required pages** — About, Contact, Privacy Policy, Cookie Policy, Terms, Disclaimer, Editorial Policy. (Sab already bane hue hain — text review kar lein.)
- [x] **Navigation** — categories, search, archive, author pages. (Sab maujood.)
- [x] **Mobile friendly + fast** — site pehle se fast hai.
- [x] **Koi broken page/empty category nahi** — har category mein kam az kam 2–3 articles rakhein.

### Apply karne ka tareeqa

1. Site live hone ke baad 1–2 hafte wait karein aur Search Console mein pages index honay dein.
2. [adsense.google.com](https://adsense.google.com) par apni site add karein.
3. Address/identity verification complete karein (Pakistan se apply karna masla nahi hai, payment ke liye bank details chahiye hongi).
4. Review 2–4 hafte leta hai. Reject ho jaye to wajah parh kar content improve karein aur dobara apply karein.

### Approve hone ke baad (ads on karna)

Vercel → **Settings → Environment Variables** mein ye 4 values add karein aur redeploy karein:

```
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE=xxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=xxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_FOOTER=xxxxxxxxxx
```

Slot IDs AdSense dashboard → **Ads → By ad unit** se banayein. Values add karte hi ads aur `ads.txt` khud active ho jayenge. Pehle ye code ads bilkul show nahi karta — is liye approval se pehle site par khaali ad boxes nahi dikhenge (ye AdSense ke liye accha signal hai).

### Kya nahi karna

- ❌ Copy-paste content ya sirf AI se bina edit kiya hua text
- ❌ "Get rich quick", crypto tips, gambling, medical cure claims (naye account ke liye risky)
- ❌ Site par click karwa kar khud ads click karna (permanent ban ho jata hai)
- ❌ Ek hi din mein 50 articles daalna — dheere, consistent publishing behtar hai

---

## 5. Earning ko barhane ke practical rules

1. **Har article ek specific sawal ka jawab de** — "kitchen tips" nahi, "knife kaise sharpen karein".
2. **Pehle 100 words mein jawab** — featured snippet isi se milta hai.
3. **Internal links** — har article se 2–3 related articles link karein.
4. **Cluster banayein** — ek category mein 8–12 articles, phir agli category. Authority topic-wise banti hai.
5. **Purane articles update karein** — naya duplicate likhne se behtar hai purana behtar karna (`updated` date change karein).
6. **RPM zyada wali categories** — money, tech, health, home (finance/insurance/software ads sab se zyada dete hain). Food aur travel par traffic zyada aata hai lekin RPM kam. Dono ka mix rakhein.

---

## 6. Rozana ka workflow (5 minute)

```
1. Mujhe bolein: "aaj ke 3 articles likho — food, health, money"
2. Main MDX files bana dunga + seo-check pass karunga
3. Aap preview dekh kar approve karein (Vercel preview URL)
4. Commit → auto deploy → Search Console mein indexing request
5. Har hafte ek baar: jo articles rank nahi kar rahe, unhe update karein
```

---

## 7. Aage kya add ho sakta hai (ager chahiye)

- **AI writing dashboard** — ek admin panel jahan se aap khud topic dekar article generate karein (is ke liye database + AI API key chahiye hoga).
- **Newsletter provider** — Buttondown / Mailchimp / Resend se connect (sirf ek env variable).
- **Comments** — Giscus (GitHub-based, free) ya Disqus.
- **Ads ke ilawa earning** — affiliate links, sponsored posts page, paid subscription.
- **Multi-language** — Urdu content ke liye alag `/ur/` section.

Bas batayein, main add kar dunga.
