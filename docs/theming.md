# Theming & Visual Design / الطابع البصري والتصميم

The platform's visual identity is driven by a highly customizable theming engine, allowing restaurants to align the digital menu with their brand presence.
تُدار الهوية البصرية للمنصة بواسطة محرك تصميم قابل للتخصيص بشكل كبير، مما يتيح للمطاعم مواءمة المنيو الرقمي مع حضور علامتهم التجارية.

## Neo-Brutalist Aesthetic / طابع النيو-بروتاليزم

The default design language employs a "Neo-Brutalist" style, characterized by:
تعتمد لغة التصميم الافتراضية على طابع "النيو-بروتاليزم" (Neo-Brutalism)، والذي يتميز بـ:
- High contrast borders and stark shadows.
  حدود عالية التباين وظلال قوية.
- Bold typography with clear hierarchical distinctions.
  خطوط عريضة مع تمييز هرمي واضح.
- Unapologetic use of vibrant accent colors against stark monochromatic backgrounds.
  استخدام جريء للألوان الزاهية مقابل خلفيات أحادية اللون.
  
This aesthetic ensures extremely high legibility, which is critical for digital menus accessed on mobile devices in varied lighting conditions (e.g., sunny outdoor patios).
يضمن هذا الطابع وضوحاً عالياً جداً للقراءة، وهو أمر بالغ الأهمية للقوائم الرقمية التي يتم الوصول إليها عبر الأجهزة المحمولة في ظروف إضاءة متنوعة.

## Dynamic Color Generator / مولد الألوان الديناميكي

To provide limitless customization without requiring a developer, the platform features a Dynamic Color Generator.
لتوفير إمكانيات تخصيص لا حصر لها دون الحاجة إلى مطور، تتميز المنصة بوجود مولد ألوان ديناميكي.

- **Algorithmic Shades / الظلال الخوارزمية**: The administrator selects a single "Primary Brand Color". The system computationally generates a full palette (from shades `100` to `900`) using HSL/RGB manipulation algorithms.
  يقوم المسؤول باختيار "لون العلامة التجارية الأساسي" واحد فقط. يقوم النظام بتوليد لوحة ألوان كاملة خوارزمياً (من الظل 100 إلى 900) باستخدام تقنيات معالجة HSL/RGB.
- **CSS Variables / متغيرات CSS**: These generated colors are injected into the DOM as CSS variables (e.g., `--color-primary-500`). Tailwind CSS is configured to map its utility classes directly to these variables.
  يتم إدراج هذه الألوان المولدة في الـ DOM كمتغيرات CSS. تم تكوين Tailwind CSS لربط فئاته الخدمية مباشرة بهذه المتغيرات.
- **Instant Application / تطبيق فوري**: Changes take effect instantaneously across all components (buttons, badges, highlights) without recompilation.
  تدخل التغييرات حيز التنفيذ فوراً عبر جميع المكونات دون الحاجة إلى إعادة تجميع الكود (Recompilation).
