# Profiling va Performance Monitoring

## Lokal Profiling

### Next.js Turbo Mode

```bash
npm run dev:turbo
```

Turbo mode Next.js 14+ da eksperimental rejim bo'lib, build va hot-reload tezligini oshiradi.

### Bundle Analiz

```bash
npm run analyze
```

Bu komanda `@next/bundle-analyzer` yordamida bundle hajmini vizual ko'rsatadi va katta paketlarni aniqlashga yordam beradi.

### Type Checking

```bash
npm run type-check
```

TypeScript xatolarini builddan oldin tekshirish.

## Production Monitoring

### Sentry Integratsiyasi (Kelajakda)

Productionda xatolarni kuzatish va performance monitoring uchun Sentry qo'shish mumkin:

```bash
npm install @sentry/nextjs
```

### API Response Time Monitoring

API endpointlarining javob vaqtini kuzatish uchun middleware yoki custom logger qo'shish mumkin.

## CI/CD Optimallashtirish

### Parallel Scripts

`package.json` da `ci` scripti parallel ishlatilishi mumkin:

```bash
npm run ci
```

Bu quyidagilarni ketma-ket bajaradi:

1. Type checking
2. Linting
3. Build

### Build Caching

Vercel, GitHub Actions yoki boshqa CI/CD platformalarda build caching ishlatish build vaqtini qisqartiradi.

## Performance Metrics

### Lighthouse Scores

Production build uchun Lighthouse scores:

- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### Core Web Vitals

- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
