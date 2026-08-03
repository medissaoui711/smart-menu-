import { CartItem, CustomerDetails, Language, RestaurantConfig } from '../types';

export function formatWhatsAppMessage(
  config: RestaurantConfig,
  items: CartItem[],
  customer: CustomerDetails,
  lang: Language = 'ar'
): string {
  const isAr = lang === 'ar';
  const currency = isAr ? config.currencyAr : config.currencyEn;

  // Calculate Subtotal & Total
  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const deliveryFee = customer.serviceType === 'delivery' ? config.deliveryFee : 0;
  const grandTotal = subtotal + deliveryFee;

  let message = '';

  if (isAr) {
    message += `🍽️ *طلب جديد من المنيو الذكي*\n`;
    message += `📌 *${config.nameAr}*\n`;
    message += `--------------------------------\n`;

    if (customer.serviceType === 'dine_in') {
      message += `🍽️ *نوع الخدمة:* داخل المطعم\n`;
      message += `🪑 *رقم الطاولة:* ${customer.tableNumber || 'غير محدد'}\n`;
    } else if (customer.serviceType === 'drive_in') {
      message += `🚗 *نوع الخدمة:* خدمة السيارة (Drive-in / Car Pickup)\n`;
      if (customer.carPlate) message += `🚘 *رقم / لوحة السيارة:* ${customer.carPlate}\n`;
      if (customer.carColor) message += `🎨 *لون / نوع السيارة:* ${customer.carColor}\n`;
    } else if (customer.serviceType === 'takeaway') {
      message += `🛍️ *نوع الخدمة:* استلام مباشر من المطعم (تجهيز طلب)\n`;
      if (customer.pickupTime) {
        message += `⏰ *وقت الوصول والاستلام المتوقع:* ${customer.pickupTime}\n`;
      }
    } else {
      message += `🛵 *نوع الخدمة:* طلب توصيل للمنزل\n`;
      if (customer.address) message += `📍 *العنوان:* ${customer.address}\n`;
    }

    if (customer.locationUrl) {
      message += `🗺️ *رابط الموقع (GPS):*\n${customer.locationUrl}\n`;
    }

    if (customer.name) message += `👤 *الاسم:* ${customer.name}\n`;
    if (customer.phone) message += `📱 *رقم الهاتف:* ${customer.phone}\n`;

    message += `--------------------------------\n`;
    message += `📋 *تفاصيل الطلب:*\n\n`;

    items.forEach((item, index) => {
      const name = item.menuItem.nameAr;
      const opts = item.selectedOptions && item.selectedOptions.length > 0
        ? ` (${item.selectedOptions.map(o => o.choiceName).join(' + ')})`
        : '';
      const notes = item.itemNotes ? `\n   📝 ملاحظة الأصناف: ${item.itemNotes}` : '';

      message += `${index + 1}. *${name}${opts}*\n`;
      message += `   الكمية: ${item.quantity} × ${item.unitPrice} ${currency} = *${item.unitPrice * item.quantity} ${currency}*${notes}\n\n`;
    });

    if (customer.notes) {
      message += `--------------------------------\n`;
      message += `✍️ *ملاحظات خاصة:* ${customer.notes}\n`;
    }

    message += `--------------------------------\n`;
    message += `💵 *المجموع الفرعي:* ${subtotal} ${currency}\n`;
    if (deliveryFee > 0) {
      message += `🛵 *رسوم التوصيل:* ${deliveryFee} ${currency}\n`;
    }
    message += `💰 *الإجمالي النهائي:* *${grandTotal} ${currency}*\n`;
    message += `--------------------------------\n`;
    message += `شكرًا لكم! تم إرسال الطلب عبر المنيو التفاعلي 🚀`;
  } else {
    message += `🍽️ *New Smart Menu Order*\n`;
    message += `📌 *${config.nameEn}*\n`;
    message += `--------------------------------\n`;

    if (customer.serviceType === 'dine_in') {
      message += `🍽️ *Service:* Dine-In\n`;
      message += `🪑 *Table Number:* ${customer.tableNumber || 'N/A'}\n`;
    } else if (customer.serviceType === 'drive_in') {
      message += `🚗 *Service:* Drive-In / Car Pickup\n`;
      if (customer.carPlate) message += `🚘 *Car Plate / Number:* ${customer.carPlate}\n`;
      if (customer.carColor) message += `🎨 *Car Color / Model:* ${customer.carColor}\n`;
    } else if (customer.serviceType === 'takeaway') {
      message += `🛍️ *Service:* Direct Pickup / Takeaway\n`;
      if (customer.pickupTime) {
        message += `⏰ *Estimated Arrival & Pickup Time:* ${customer.pickupTime}\n`;
      }
    } else {
      message += `🛵 *Service:* Home Delivery\n`;
      if (customer.address) message += `📍 *Address:* ${customer.address}\n`;
    }

    if (customer.locationUrl) {
      message += `🗺️ *GPS Location Link:*\n${customer.locationUrl}\n`;
    }

    if (customer.name) message += `👤 *Name:* ${customer.name}\n`;
    if (customer.phone) message += `📱 *Phone:* ${customer.phone}\n`;

    message += `--------------------------------\n`;
    message += `📋 *Order Items:*\n\n`;

    items.forEach((item, index) => {
      const name = item.menuItem.nameEn;
      const opts = item.selectedOptions && item.selectedOptions.length > 0
        ? ` (${item.selectedOptions.map(o => o.choiceName).join(' + ')})`
        : '';
      const notes = item.itemNotes ? `\n   📝 Note: ${item.itemNotes}` : '';

      message += `${index + 1}. *${name}${opts}*\n`;
      message += `   Qty: ${item.quantity} × ${item.unitPrice} ${currency} = *${item.unitPrice * item.quantity} ${currency}*${notes}\n\n`;
    });

    if (customer.notes) {
      message += `--------------------------------\n`;
      message += `✍️ *Special Notes:* ${customer.notes}\n`;
    }

    message += `--------------------------------\n`;
    message += `💵 *Subtotal:* ${subtotal} ${currency}\n`;
    if (deliveryFee > 0) {
      message += `🛵 *Delivery Fee:* ${deliveryFee} ${currency}\n`;
    }
    message += `💰 *Grand Total:* *${grandTotal} ${currency}*\n`;
    message += `--------------------------------\n`;
    message += `Thank you! Sent via Smart Interactive Menu 🚀`;
  }

  return message;
}

export function openWhatsAppOrder(
  config: RestaurantConfig,
  items: CartItem[],
  customer: CustomerDetails,
  lang: Language = 'ar'
) {
  const messageText = formatWhatsAppMessage(config, items, customer, lang);
  const cleanPhone = config.whatsappPhone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(messageText);

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;
  
  try {
    const win = window.open(whatsappUrl, '_blank');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = whatsappUrl;
    }
  } catch (err) {
    window.location.href = whatsappUrl;
  }
}
