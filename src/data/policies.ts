import { Language } from '../types';

export const getFaqContent = (lang: Language) => {
  if (lang === 'ar') {
    return [
      {
        q: 'كيف أقوم بالطلب؟',
        a: 'اختر الوجبات، أضفها للسلة، ثم اضغط "إرسال" ليفتح الواتساب برسالة منسقة.'
      },
      {
        q: 'هل يمكنني تعديل الطلب بعد إرساله؟',
        a: 'نعم، راسل المطعم مباشرة عبر نفس محادثة الواتساب لتعديل الطلب.'
      },
      {
        q: 'ما هي طرق الدفع المتاحة؟',
        a: 'الدفع في المطعم (نقدًا أو بطاقتك) عند الاستلام أو عند الطاولة.'
      }
    ];
  }
  return [
    {
      q: 'How do I order?',
      a: 'Pick items, add to cart, then tap "Send" to open WhatsApp with a formatted message.'
    },
    {
      q: 'Can I modify my order after sending?',
      a: 'Yes, message the restaurant directly in the same WhatsApp chat to modify your order.'
    },
    {
      q: 'What payment methods are available?',
      a: 'Pay at the restaurant (cash or card) upon delivery or at your table.'
    }
  ];
};

export const getPrivacyContent = (lang: Language) => {
  if (lang === 'ar') {
    return 'لا يجمع التطبيق بيانات حساسة. رقم هاتفك يُستخدم فقط لإرسال طلبك عبر واتساب والتواصل بخصوص طلبك الحالي. لا نشارك بياناتك مع أطراف ثالثة.';
  }
  return 'The app does not collect sensitive data. Your phone number is used only to send your order via WhatsApp and communicate about this order. We do not share your data with third parties.';
};

export const getTermsContent = (lang: Language) => {
  if (lang === 'ar') {
    return 'المطعم غير مسؤول عن أي تأخير ناتج عن ظروف قاهرة. الأسعار قابلة للتغيير وتعتمد على المعروض في المنيو وقت الإرسال. نرجو الالتزام بالجدية عند الإرسال لتجنب الهدر.';
  }
  return 'The restaurant is not liable for delays due to force majeure. Prices may change and depend on the menu at the time of submission. Please be serious when sending orders to avoid waste.';
};
