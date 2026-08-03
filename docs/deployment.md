# Build & Deployment Guide / دليل البناء والنشر

This platform is a static Single Page Application (SPA) natively optimized for modern edge networks and serverless hosting environments.
تُعد هذه المنصة تطبيق ويب بصفحة واحدة (SPA) ثابت، وتم تحسينها أصلياً لشبكات الحافة الحديثة وبيئات الاستضافة بدون خادم (Serverless).

## Build Commands / أوامر البناء

To prepare the application for production, run:
لإعداد التطبيق لمرحلة الإنتاج، قم بتشغيل:

```bash
npm run build
```

This invokes Vite's production build pipeline, executing TypeScript compilation, CSS minification, and code splitting. The optimized output is written to the `/dist` directory.
يقوم هذا بتشغيل سلسلة بناء الإنتاج الخاصة بـ Vite، والتي تنفذ تجميع TypeScript، وتصغير CSS، وفصل الكود. يتم كتابة المخرجات المحسنة في مجلد `/dist`.

## Deployment Targets / وجهات النشر

### 1. Vercel
Vercel offers zero-configuration deployments for Vite projects.
توفر Vercel عمليات نشر بدون إعدادات مسبقة لمشاريع Vite.
- Connect your GitHub repository to Vercel.
  قم بربط مستودع GitHub الخاص بك بـ Vercel.
- Vercel will automatically detect the Vite framework.
  ستكتشف Vercel إطار عمل Vite تلقائياً.
- Build Command: `npm run build`
- Output Directory: `dist`

### 2. Firebase Hosting
To deploy to Firebase Hosting globally:
للنشر على استضافة Firebase عالمياً:
- Install the CLI: `npm install -g firebase-tools`
- Login: `firebase login`
- Initialize: `firebase init hosting` (Select `dist` as the public directory, and configure as an SPA).
- Deploy: `firebase deploy --only hosting`

### 3. Google Cloud Run
For enterprise-grade containerized hosting:
للاستضافة المعتمدة على الحاويات (Containers) للمؤسسات:
- Create a `Dockerfile` using a lightweight web server (e.g., Nginx).
  قم بإنشاء `Dockerfile` باستخدام خادم ويب خفيف (مثل Nginx).
  ```dockerfile
  FROM node:18-alpine AS builder
  WORKDIR /app
  COPY package*.json ./
  RUN npm install
  COPY . .
  RUN npm run build

  FROM nginx:alpine
  COPY --from=builder /app/dist /usr/share/nginx/html
  EXPOSE 80
  CMD ["nginx", "-g", "daemon off;"]
  ```
- Build and push to Google Artifact Registry, then deploy the image to Cloud Run.
  قم ببناء الصورة ورفعها إلى Google Artifact Registry، ثم قم بنشر الصورة على Cloud Run.
