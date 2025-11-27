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

- **DB ulanishi va indekslar**  
  `lib/db.js` cached ulanishdan foydalanadi, lekin `Registry`, `Checkup`, `User` sxeamalariga qo‘shimcha indeks (`phone`, `userId`, `clientId`, `createdOn`, `updatedAt`) qo‘shish qidiruvni tezlashtiradi. Misol: `registrySchema.index({ userId: 1, name: 1 })`.

- **lean() va projection**  
  `pages/api/clients.ts` va `pages/api/checkup.ts` `find` natijalarini to‘liq `mongoose` hujjati sifatida qaytaradi. `lean()` dan foydalanish JSON serializatsiyasini tezlashtiradi. Keraksiz maydonlarni (`comment`, `xijoma`) ro‘yxatlarda tashlab, faqat ko‘rsatish sahifasida to‘liq hujjatni olish mumkin.

- **Paginated countingni optimallashtirish**  
  Hozir `countDocuments` va `find` alohida chaqiriladi. `estimatedDocumentCount` yoki `Promise.all` bilan parallel bajarish, yoki `facet` pipeline orqali `data` va `count` ni bitta queryda qaytarish API javob vaqtini qisqartiradi.

- **Validatsiya bosqichini tezlashtirish**  
  `express-validator` barcha qoidalarni ishga tushiradi. POST/PATCH da faqat kerakli fieldlar bo‘yicha minimal middleware ishlatish yoki yup schema (frontend) bilan sinxron tarzda `zod`/`yup` validatsiyasini serverga ham qo‘llash CPU yukini kamaytiradi.

- **Caching va revalidation**  
  `GET /clients` va `GET /checkup` so‘rovlarida tez-tez qaytariladigan natijalarni `Redis` yoki `in-memory LRU` (masalan, `lru-cache`) bilan kesh qilish, invalidatsiyani `POST/PATCH/DELETE` dan so‘ng amalga oshirish javob vaqtini barqaror qiladi.

- **Streaming va pagination**  
  Agar kelajakda katta datasetlar bo‘lsa, cursor-based pagination (ObjectId yoki `createdAt` bo‘yicha) va `Readable` streamdan (`res.write`) foydalanish network tiqilinchini kamaytiradi.

- **Error handling**  
  `middleware.ts` 401 kodini `error.response.statusCode` bilan tekshiradi, lekin Axios `status` ni qaytaradi. Xatoliklarni tezroq aniqlash uchun `error.response?.status` dan foydalanish, shuningdek xabarlarni i18n kalitlariga maplash logikani soddalashtiradi va guardlarni keraksiz qayta ishga tushishidan saqlaydi.

## 3. Statik resurslar va build optimallashtirish

- **Katta fayllarni ajratish**  
  `public/image3d/image3d.obj` ~73k qator bo‘lib, deploy paytida PWA paketi hajmini oshiradi. Uni CDN yoki kechiktirilgan yuklash orqali ajratish build vaqtini kamaytiradi.

- **Service Worker va PWA**  
  `next-pwa` bilan ishlaganda `sw.js` va `workbox` fayllari brauzer cachingini boshqaradi. `runtimeCaching` konfiguratsiyasida API endpointlar uchun `NetworkFirst` yoki `StaleWhileRevalidate` strategiyalarini belgilash mobil foydalanuvchilarda tezkor javob beradi.

- **Bundle analiz**  
  `ANALYZE=true next build` bilan paket hajmini tekshirib, katta bundle bo‘laklarini (react-icons, chakra) `babel-plugin-transform-imports` orqali tree-shake qilish mumkin.

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
