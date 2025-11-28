# Optimallashtirish bo‘yicha yo‘riqnoma

Quyidagi tavsiyalar Next.js + Chakra UI ilovasining UI renderi va API qatlamini tezlatish, shuningdek umumiy resurs sarfini kamaytirishga qaratilgan. Har bir bo‘limda aniq qadamlar va kutiladigan foyda ko‘rsatilgan.

## 1. Render va UI optimallashtirish

- [x] **Providerlarni segmentlash**  
       `src/pages/_app.tsx` ichida `LanguageProvider`, `AuthProvider`, `I18nextProvider`, `ThemeComponent` va `WindowWrapper` butun dasturni qayta render qiladi. Sahifa darajasida til yoki autentifikatsiya talab qilmaydigan segmentlar bo‘lsa, providerlarni shartli ravishda (masalan, faqat guard kerak bo‘lgan sahifalarda) qo‘llash UI yukini kamaytiradi.

- [x] **AuthGuard / GuestGuard side-effectlarini kamaytirish**  
       Guardlar `router.replace` chaqirig‘ini har renderda ishga tushirmasligi uchun `useEffect` dependency ro‘yxatini to‘liq kiritish va `auth.loading` holatini `useMemo` bilan kesh-lash tavsiya etiladi. Bu routing paytida ikki karra repaintni oldini oladi.

- [x] **BlankLayoutWithSidebar ni parchalash**  
       `src/components/layout/BlankLayoutWithSidebar.tsx` juda ko‘p holatni (collapse, breakpoint, language) boshqaradi. Sidebar va topbarni `React.memo` bilan ajratish, `navbar[user?.role!]` ni `useMemo` da hisoblash va ikon/tekst komponentlariga `next/dynamic` bilan lazy-load qilish rerenderlarni sezilarli kamaytiradi.

- [x] **NavItem va AvatarBox uchun memoization**  
       `NavItem` va `AvatarBox` har doim parentdan yangi props oladi. `React.memo` va `useCallback` yordamida `setIsOpen`/`selectLang` funksiyalarini barqaror referencesiz uzatish sidebar performansini oshiradi.

- [x] **Jadval komponenti uchun virtualization**  
       `components/Table` dagi ma’lumotlar soni ortishi bilan DOM ko‘payadi. `TanStack Virtual` yoki `@chakra-ui/react-table` bilan virtualization qo‘llash, hamda `key` sifatida `_id` dan foydalanish (hozirgi `index`) rerenderlarni kamaytiradi.

- [x] **Dynamic importlardan foydalanish**  
       `draft-js`, `react-draft-wysiwyg`, `react-paginate`, `react-toastify` kabi og‘ir paketlar uchun `next/dynamic({ ssr: false })` allaqachon qisman qo‘llangan. Shu yondashuvni:

  - `ThemeComponent` ichidagi `ToastContainer`,
  - `NextNProgress`,
  - `BlankLayoutWithSidebar` dagi ikon to‘plamlari
    uchun ham qo‘llash foydali.

- [x] **WindowWrapper optimallashtirish**  
       `useEffect` `router.route` ga bog‘langan, bu har navigatsiyada `windowReadyFlag` ni qayta o‘rnatadi. Flagni faqat bir marta o‘rnatish yoki Next.js `useHydration` yondashuvi bilan almashtirish initial paintni tezlashtiradi.

- [x] **Rasm komponentlari**  
       `ImagePoint` va `ImagePointView` `@chakra-ui/react` rasmlaridan foydalanadi. Next.js `next/image` komponenti bilan almashtirish (SSR-friendly) va rasmni `priority=false`/`loading='lazy'` qilish CPU yukini kamaytiradi.

- [x] **Profiling**  
       `next build && next analyze` yoki `React Profiler` bilan foydalanuvchi oqimining asosiy sahifalarida (clients list, checkup list, form sahifalari) render vaqtlarini o‘lchash tavsiya etiladi. Profiling natijasiga qarab komponentlarni splitting qilish mumkin.

## 2. API va server qatlami

- [x] **DB ulanishi va indekslar**  
       `lib/db.js` cached ulanishdan foydalanadi, lekin `Registry`, `Checkup`, `User` sxeamalariga qo‘shimcha indeks (`phone`, `userId`, `clientId`, `createdOn`, `updatedAt`) qo‘shish qidiruvni tezlashtiradi. Misol: `registrySchema.index({ userId: 1, name: 1 })`.

- [x] **lean() va projection**  
       `pages/api/clients.ts` va `pages/api/checkup.ts` `find` natijalarini to‘liq `mongoose` hujjati sifatida qaytaradi. `lean()` dan foydalanish JSON serializatsiyasini tezlashtiradi. Keraksiz maydonlarni (`comment`, `xijoma`) ro‘yxatlarda tashlab, faqat ko‘rsatish sahifasida to‘liq hujjatni olish mumkin.

- [x] **Paginated countingni optimallashtirish**  
       Hozir `countDocuments` va `find` alohida chaqiriladi. `estimatedDocumentCount` yoki `Promise.all` bilan parallel bajarish, yoki `facet` pipeline orqali `data` va `count` ni bitta queryda qaytarish API javob vaqtini qisqartiradi.

- [x] **Validatsiya bosqichini tezlashtirish**  
       `express-validator` qoidalarini optimallashtirildi: `.bail()` chaqiruvlari kamaytirildi, `.trim()` birinchi bo‘lib ishlatiladi, `.isLength()` bitta chaqiruvda `min` va `max` bilan birlashtirildi, xato xabarlar to‘g‘rilandi (`year_required`, `address_required`). Bu CPU yukini kamaytiradi va validatsiya tezligini oshiradi.

- [x] **Caching va revalidation**  
       `GET /clients` va `GET /checkup` so‘rovlarida tez-tez qaytariladigan natijalarni `Redis` yoki `in-memory LRU` (masalan, `lru-cache`) bilan kesh qilish, invalidatsiyani `POST/PATCH/DELETE` dan so‘ng amalga oshirish javob vaqtini barqaror qiladi.

- [x] **Streaming va pagination**  
       Cursor-based pagination qo‘shildi: `GET /api/clients` va `GET /api/checkup` endpointlarida `cursor` query parametri orqali ObjectId asosida pagination qilish mumkin. Bu offset-based pagination bilan birga ishlaydi va katta datasetlar uchun samaraliroq. Streaming esa katta fayllar uchun kelajakda qo‘shilishi mumkin.

- [x] **Error handling**  
       `middleware.ts` 401 kodini `error.response.statusCode` bilan tekshiradi, lekin Axios `status` ni qaytaradi. Xatoliklarni tezroq aniqlash uchun `error.response?.status` dan foydalanish, shuningdek xabarlarni i18n kalitlariga maplash logikani soddalashtiradi va guardlarni keraksiz qayta ishga tushishidan saqlaydi.

## 3. Statik resurslar va build optimallashtirish

- [ ] **Katta fayllarni ajratish**  
       `public/image3d/image3d.obj` ~73k qator bo‘lib, deploy paytida PWA paketi hajmini oshiradi. Uni CDN yoki kechiktirilgan yuklash orqali ajratish build vaqtini kamaytiradi. (Kelajakdagi ish)

- [x] **Service Worker va PWA**  
       `next-pwa` konfiguratsiyasiga `runtimeCaching` qo‘shildi: API endpointlar uchun `NetworkFirst` (10s timeout, 60s TTL), statik fayllar uchun `CacheFirst` (7 kun), rasmlar uchun `StaleWhileRevalidate` (24 soat). Bu mobil foydalanuvchilarda tezkor javob beradi va offline ishlashni yaxshilaydi.

- [x] **Bundle analiz**  
       `ANALYZE=true next build` yoki `npm run analyze` bilan paket hajmini tekshirish mumkin. `@next/bundle-analyzer` integratsiya qilingan va `next.config.mjs` da sozlangan.

## 4. Monitoring va avtomatlashtirish

- **Profiling va tracing**  
  `next dev --turbo` yordamida lokal profiling, productionda esa `Sentry/Datadog` integratsiyasi bilan API javob vaqtlarini kuzatish tavsiya etiladi.

- **CI/CD optimallashtirish**  
  `next lint`, `tsc --noEmit`, `vitest` kabi buyruqlarni parallel ishlatish, hamda `pnpm` yoki `npm` cachingi bilan build vaqtini qisqartirish mumkin.

## Yakuniy qadamlar

1. Yuqoridagi tavsiyalar asosida profiling rejasi tuzing va o‘lchov natijalarini hujjatlashtiring.
2. Eng ko‘p foyda beradigan 2–3 optimallashtirishni (masalan, sidebar memoization va API `lean()` querylari) birinchi navbatda joriy eting.
3. Joriy etilgan o‘zgarishlar uchun Lighthouse va custom API benchmarklari bilan regressiya testlari o‘tkazing.

Shu kabi tartibli yondashuv loyihaning render tezligi va API javoblarini barqaror tarzda yaxshilaydi.
