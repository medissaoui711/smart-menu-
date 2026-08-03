# Technical Architecture / المعمارية التقنية

This document details the underlying technical architecture of the platform, designed for high performance, scalability, and seamless user experience.
يوضح هذا المستند المعمارية التقنية الأساسية للمنصة، والمصممة لضمان الأداء العالي، والقابلية للتوسع، وتقديم تجربة مستخدم سلسة.

## Core Stack / التقنيات الأساسية

The platform is built on a modern frontend stack:
تم بناء المنصة بالاعتماد على حزمة تقنيات حديثة لواجهات المستخدم:

- **React 18**: Provides a robust, component-driven architecture allowing for modular UI development and efficient DOM updates.
  يوفر معمارية قوية تعتمد على المكونات، مما يسمح بتطوير واجهات المستخدم بشكل تركيبي وتحديثات فعالة لـ DOM.
- **Vite**: Acts as the next-generation frontend tooling, offering ultra-fast Hot Module Replacement (HMR) and optimized build outputs via ESBuild and Rollup.
  يعمل كأداة تطوير واجهات من الجيل القادم، ويوفر استبدالاً سريعاً جداً للوحدات (HMR) ومخرجات بناء محسنة عبر ESBuild و Rollup.
- **Tailwind CSS**: A utility-first CSS framework used for rapid, consistent, and highly responsive styling directly within the TSX components.
  إطار عمل CSS يعتمد على الأدوات (utility-first) يُستخدم لتنسيق سريع ومتسق وعالي الاستجابة مباشرة داخل مكونات TSX.

## State Management / إدارة الحالة

We utilize React's native hooks (`useState`, `useEffect`, `useCallback`) combined with custom hooks (e.g., `useMenuState`) to manage application state. Data persistence is handled via `localStorage` to ensure cart and configuration data survives page reloads.
نستخدم خطافات React الأصلية جنباً إلى جنب مع خطافات مخصصة (مثل `useMenuState`) لإدارة حالة التطبيق. تتم معالجة استمرارية البيانات عبر `localStorage` لضمان بقاء بيانات السلة والإعدادات بعد إعادة تحميل الصفحة.

## Realtime Preview Sync (PostMessage API) / المزامنة اللحظية للمعاينة

To provide a seamless administrative experience, the platform utilizes the `PostMessage API` for cross-context communication.
لتوفير تجربة إدارة سلسة، تستخدم المنصة واجهة `PostMessage API` للتواصل بين السياقات المختلفة.

- **Mechanism / الآلية**: When an administrator updates the menu or styling configuration, the admin panel dispatches a serialized message using `window.postMessage`.
  عندما يقوم المسؤول بتحديث قائمة الطعام أو إعدادات التصميم، تقوم لوحة الإدارة بإرسال رسالة متسلسلة باستخدام `window.postMessage`.
- **Live Phone Preview / معاينة الهاتف اللحظية**: An embedded iframe representing the mobile view listens for these `message` events. Upon receiving the payload, it dynamically updates its React state, reflecting the changes in real-time without requiring a full reload.
  يقوم إطار (iframe) مضمن يمثل عرض الهاتف بالاستماع إلى أحداث `message`. عند تلقي البيانات، يقوم بتحديث حالة React ديناميكياً، مما يعكس التغييرات في الوقت الفعلي دون الحاجة إلى إعادة تحميل كاملة.
