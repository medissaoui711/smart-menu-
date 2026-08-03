export type ServiceType = 'dine_in' | 'takeaway' | 'delivery' | 'drive_in';

export interface OptionChoice {
  nameAr: string;
  nameEn: string;
  price: number;
}

export interface MenuItemOption {
  id: string;
  titleAr: string;
  titleEn: string;
  required?: boolean;
  choices: OptionChoice[];
}

export interface MenuItem {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  categoryId: string;
  image: string;
  isAvailable: boolean;
  popularTag?: boolean;
  options?: MenuItemOption[];
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  icon?: string;
  sortOrder: number;
}

export interface CartItemOptionChoice {
  optionTitle: string;
  choiceName: string;
  price: number;
}

export interface CartItem {
  id: string; // unique cart line id
  menuItem: MenuItem;
  quantity: number;
  selectedOptions?: CartItemOptionChoice[];
  itemNotes?: string;
  unitPrice: number;
}

export interface RestaurantConfig {
  nameAr: string;
  nameEn: string;
  subtitleAr: string;
  subtitleEn: string;
  whatsappPhone: string;
  currencyAr: string;
  currencyEn: string;
  logoUrl: string;
  headerBannerUrl: string;
  addressAr: string;
  addressEn: string;
  deliveryFee: number;
  minOrderValue: number;
  tableCount: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  serviceType: ServiceType;
  tableNumber: string;
  address: string;
  notes: string;
  locationUrl?: string;
  carPlate?: string;
  carColor?: string;
  carDetails?: string;
  pickupTime?: string;
}

export type Language = 'ar' | 'en';
