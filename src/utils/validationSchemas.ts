import { z } from 'zod';

// Admin Login PIN Schema
export const adminLoginSchema = z.object({
  pin: z
    .string()
    .min(4, { message: 'رمز PIN يجب أن يتكون من 4 أرقام على الأقل | PIN must be at least 4 digits' })
    .max(8, { message: 'رمز PIN لا يتجاوز 8 أرقام | PIN cannot exceed 8 digits' })
    .regex(/^\d+$/, { message: 'رمز PIN يجب أن يحتوي على أرقام فقط | PIN must contain only numbers' }),
});

// Menu Item Validation Schema
export const menuItemSchema = z.object({
  nameAr: z
    .string()
    .min(2, { message: 'اسم الطبق بالعربي مطلوب (حرفين على الأقل) | Arabic name requires at least 2 characters' })
    .max(100, { message: 'اسم الطبق طويل جداً | Dish name is too long' }),
  nameEn: z
    .string()
    .max(100, { message: 'English name is too long | الاسم الإنجليزي طويل جداً' })
    .optional(),
  price: z
    .number({ message: 'السعر يجب أن يكون رقماً صحيحاً | Price must be a valid number' })
    .gt(0, { message: 'السعر يجب أن يكون أكبر من 0 | Price must be greater than 0' })
    .max(100000, { message: 'السعر مرتفع جداً | Price is too high' }),
  categoryId: z
    .string()
    .min(1, { message: 'يرجى اختيار قسم للطبق | Please select a category' }),
  descriptionAr: z
    .string()
    .max(500, { message: 'الوصف أطول من المسموح (500 حرف) | Description exceeds 500 characters' })
    .optional(),
  descriptionEn: z
    .string()
    .max(500, { message: 'Description exceeds 500 characters | الوصف أطول من المسموح' })
    .optional(),
  image: z
    .string()
    .min(1, { message: 'يرجى إدخال رابط أو رفع صورة للطبق | Please provide an image URL or file' }),
  isAvailable: z.boolean().default(true),
  popularTag: z.boolean().default(false),
});

// Category Validation Schema
export const categorySchema = z.object({
  nameAr: z
    .string()
    .min(2, { message: 'اسم القسم يجب أن يتكون من حرفين على الأقل | Category name requires at least 2 characters' })
    .max(50, { message: 'اسم القسم طويل جداً | Category name too long' }),
  nameEn: z
    .string()
    .max(50, { message: 'Category English name too long | الاسم الإنجليزي للقسم طويل جداً' })
    .optional(),
});

// Restaurant Config Schema
export const restaurantConfigSchema = z.object({
  nameAr: z
    .string()
    .min(2, { message: 'اسم المطعم بالعربي مطلوب | Arabic restaurant name is required' }),
  nameEn: z
    .string()
    .min(2, { message: 'English restaurant name is required | اسم المطعم بالإنجليزية مطلوب' }),
  whatsappPhone: z
    .string()
    .min(8, { message: 'رقم الواتساب غير صحيح (8 أرقام على الأقل) | WhatsApp number too short' })
    .max(15, { message: 'رقم الواتساب طويل جداً | WhatsApp number too long' })
    .regex(/^\d+$/, { message: 'رقم الواتساب يجب أن يحتوي على أرقام فقط مع كود الدولة | WhatsApp must contain digits only' }),
  tableCount: z
    .number()
    .int()
    .min(1, { message: 'عدد الطاولات يجب أن يكون 1 على الأقل | At least 1 table required' })
    .max(200, { message: 'عدد الطاولات يتجاوز الحد الأقصى (200) | Maximum 200 tables' }),
  deliveryFee: z
    .number()
    .min(0, { message: 'رسوم التوصيل لا يمكن أن تكون بالسالب | Delivery fee cannot be negative' }),
  currencyAr: z
    .string()
    .min(1, { message: 'رمز العملة بالعربي مطلوب | Arabic currency symbol required' }),
  currencyEn: z
    .string()
    .min(1, { message: 'English currency symbol required | رمز العملة بالإنجليزية مطلوب' }),
});

// Cart Order Customer Details Schema
export const orderCustomerSchema = z.object({
  tableNumber: z.string().optional(),
  carPlate: z.string().optional(),
  notes: z.string().max(300, { message: 'الملاحظات أطول من المسموح (300 حرف) | Notes exceed 300 characters' }).optional(),
});
