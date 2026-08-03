# SEO & GEO Engineering / هندسة تحسين محركات البحث

To maximize visibility on traditional search engines (SEO) and modern Generative AI Engines (GEO), the platform implements a robust, dynamic metadata architecture.
لتحقيق أقصى قدر من الظهور على محركات البحث التقليدية ومحركات الذكاء الاصطناعي التوليدي، تطبق المنصة معمارية بيانات وصفية ديناميكية وقوية.

## Dynamic SEO Component / مكون السيو الديناميكي

The platform includes a dedicated `<SEO />` React component that injects dynamic `<title>`, `<meta>`, and `<link>` tags into the document head based on the current context (e.g., specific menu items, categories, or the main landing page).
تتضمن المنصة مكون React مخصص `<SEO />` يقوم بإدراج وسوم `<title>` و `<meta>` و `<link>` ديناميكياً في ترويسة المستند بناءً على السياق الحالي (مثل عناصر قائمة معينة، فئات، أو الصفحة الرئيسية).

- **Multi-language Support / دعم متعدد اللغات**: Meta tags are dynamically localized depending on whether the user is browsing the Arabic or English interface.
  تيم تعريب الوسوم الوصفية ديناميكياً اعتماداً على ما إذا كان المستخدم يتصفح الواجهة العربية أو الإنجليزية.
- **Social Graph / الرسوم البيانية الاجتماعية**: Open Graph (OG) and Twitter Card tags are automatically populated to ensure elegant link unfurling on platforms like WhatsApp, X, and Facebook.
  يتم ملء وسوم Open Graph وبطاقات تويتر تلقائياً لضمان عرض الروابط بشكل أنيق على منصات مثل واتساب وإكس وفيسبوك.

## Structured Data (JSON-LD) / البيانات المهيكلة

To help search engines deeply understand the restaurant's offerings, we dynamically generate JSON-LD (JavaScript Object Notation for Linked Data) payloads.
لمساعدة محركات البحث على الفهم العميق لما يقدمه المطعم، نقوم بتوليد حزم JSON-LD ديناميكياً.

- **Restaurant Schema / مخطط المطعم**: Injects standard `Restaurant` or `FoodEstablishment` schemas detailing the address, opening hours, cuisine type, and contact mechanisms.
  يقوم بإدراج مخططات قياسية للمطاعم توضح العنوان، ساعات العمل، نوع المطبخ، وآليات الاتصال.
- **Menu Schema / مخطط قائمة الطعام**: Specifically maps items to the `MenuItem` schema, exposing prices, descriptions, and dietary flags (e.g., Vegan, Gluten-Free) directly to Google's knowledge graph and AI crawlers.
  يربط العناصر بمخطط `MenuItem`، مما يعرض الأسعار والوصف والعلامات الغذائية مباشرة لرسومات المعرفة الخاصة بجوجل وزواحف الذكاء الاصطناعي.
