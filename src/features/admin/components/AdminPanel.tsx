import React, { useState } from 'react';
import { Category, Language, MenuItem, RestaurantConfig } from '../../../types';
import { X, Plus, Edit2, Trash2, Eye, EyeOff, Save, RefreshCw, Store, ListFilter, Utensils, Upload, Smartphone, AlertTriangle } from 'lucide-react';
import { menuItemSchema, categorySchema, restaurantConfigSchema } from '../../../utils/validationSchemas';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  config: RestaurantConfig;
  onUpdateConfig: (newConfig: RestaurantConfig) => void;
  categories: Category[];
  onUpdateCategories: (newCats: Category[]) => void;
  menuItems: MenuItem[];
  onUpdateMenuItems: (newItems: MenuItem[]) => void;
  lang: Language;
  onResetToDefaults: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  categories,
  onUpdateCategories,
  menuItems,
  onUpdateMenuItems,
  lang,
  onResetToDefaults,
}) => {
  const isAr = lang === 'ar';
  const currency = isAr ? config.currencyAr : config.currencyEn;

  const [activeTab, setActiveTab] = useState<'items' | 'categories' | 'config'>('items');

  // Item Form Modal state
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  // Form State for Items
  const [itemForm, setItemForm] = useState<Partial<MenuItem>>({
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    price: 100,
    categoryId: categories[0]?.id || 'grills',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    popularTag: false,
  });

  // Config Form State
  const [configForm, setConfigForm] = useState<RestaurantConfig>(config);

  React.useEffect(() => {
    setConfigForm(config);
  }, [config, isOpen]);

  // Category Form State
  const [newCatAr, setNewCatAr] = useState('');
  const [newCatEn, setNewCatEn] = useState('');

  if (!isOpen) return null;

  // Preset images for easy selection when creating dishes
  const presetImages = [
    { title: 'مشويات / Kofta', url: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80' },
    { title: 'دجاج مشوي / Chicken', url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80' },
    { title: 'بيتزا / Pizza', url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80' },
    { title: 'مكرونة / Pasta', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80' },
    { title: 'عصير برتقال / Orange', url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80' },
    { title: 'عصير مانجو / Mango', url: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80' },
    { title: 'حلويات / Dessert', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80' },
  ];

  // Item Actions
  const handleToggleAvailability = (itemId: string) => {
    const updated = menuItems.map((item) =>
      item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
    );
    onUpdateMenuItems(updated);
  };

  const handleDeleteItem = (itemId: string) => {
    let confirmed = true;
    try {
      confirmed = window.confirm(isAr ? 'هل أنت تأكد من حذف هذا الطبق؟' : 'Are you sure you want to delete this dish?');
    } catch {
      confirmed = true;
    }
    if (confirmed) {
      const updated = menuItems.filter((item) => item.id !== itemId);
      onUpdateMenuItems(updated);
    }
  };

  // Validation Error States
  const [itemError, setItemError] = useState<string | null>(null);
  const [catError, setCatError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  const handleOpenAddItem = () => {
    setEditingItem(null);
    setItemError(null);
    setItemForm({
      nameAr: '',
      nameEn: '',
      descriptionAr: '',
      descriptionEn: '',
      price: 50,
      categoryId: categories[1]?.id || categories[0]?.id || 'grills',
      image: presetImages[0].url,
      isAvailable: true,
      popularTag: false,
    });
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemError(null);
    setItemForm(item);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = () => {
    setItemError(null);

    // Zod validation for Item
    const validation = menuItemSchema.safeParse({
      nameAr: itemForm.nameAr || '',
      nameEn: itemForm.nameEn || '',
      price: Number(itemForm.price || 0),
      categoryId: itemForm.categoryId || categories[0]?.id || 'grills',
      descriptionAr: itemForm.descriptionAr || '',
      descriptionEn: itemForm.descriptionEn || '',
      image: itemForm.image || presetImages[0].url,
      isAvailable: itemForm.isAvailable ?? true,
      popularTag: itemForm.popularTag ?? false,
    });

    if (!validation.success) {
      const rawMsg = validation.error.issues[0]?.message || 'Invalid item data';
      const msg = isAr ? rawMsg.split('|')[0].trim() : (rawMsg.split('|')[1] || rawMsg).trim();
      setItemError(msg);
      return;
    }

    const validatedData = validation.data;

    if (editingItem) {
      // Update
      const updated = menuItems.map((item) =>
        item.id === editingItem.id ? ({ ...item, ...validatedData } as MenuItem) : item
      );
      onUpdateMenuItems(updated);
    } else {
      // Create new
      const newItem: MenuItem = {
        id: Date.now().toString(),
        nameAr: validatedData.nameAr,
        nameEn: validatedData.nameEn || validatedData.nameAr,
        descriptionAr: validatedData.descriptionAr || '',
        descriptionEn: validatedData.descriptionEn || '',
        price: validatedData.price,
        categoryId: validatedData.categoryId,
        image: validatedData.image,
        isAvailable: validatedData.isAvailable,
        popularTag: validatedData.popularTag,
      };
      onUpdateMenuItems([...menuItems, newItem]);
    }

    setIsItemModalOpen(false);
  };

  // Category Actions
  const handleAddCategory = () => {
    setCatError(null);

    // Zod validation for category
    const validation = categorySchema.safeParse({
      nameAr: newCatAr,
      nameEn: newCatEn,
    });

    if (!validation.success) {
      const rawMsg = validation.error.issues[0]?.message || 'Invalid category name';
      const msg = isAr ? rawMsg.split('|')[0].trim() : (rawMsg.split('|')[1] || rawMsg).trim();
      setCatError(msg);
      return;
    }

    const newCat: Category = {
      id: 'cat_' + Date.now(),
      nameAr: validation.data.nameAr,
      nameEn: validation.data.nameEn || validation.data.nameAr,
      sortOrder: categories.length,
      icon: 'Utensils',
    };
    onUpdateCategories([...categories, newCat]);
    setNewCatAr('');
    setNewCatEn('');
  };

  const handleDeleteCategory = (catId: string) => {
    if (catId === 'all') return;
    let confirmed = true;
    try {
      confirmed = window.confirm(isAr ? 'هل تريد حذف هذا القسم؟' : 'Delete category?');
    } catch {
      confirmed = true;
    }
    if (confirmed) {
      onUpdateCategories(categories.filter((c) => c.id !== catId));
    }
  };

  // Config Save
  const handleSaveConfig = () => {
    setConfigError(null);

    // Zod validation for config
    const validation = restaurantConfigSchema.safeParse({
      nameAr: configForm.nameAr,
      nameEn: configForm.nameEn,
      whatsappPhone: configForm.whatsappPhone,
      tableCount: Number(configForm.tableCount),
      deliveryFee: Number(configForm.deliveryFee),
      currencyAr: configForm.currencyAr,
      currencyEn: configForm.currencyEn,
    });

    if (!validation.success) {
      const rawMsg = validation.error.issues[0]?.message || 'Invalid restaurant settings';
      const msg = isAr ? rawMsg.split('|')[0].trim() : (rawMsg.split('|')[1] || rawMsg).trim();
      setConfigError(msg);
      return;
    }

    onUpdateConfig(configForm);
    try {
      alert(isAr ? 'تم حفظ إعدادات المطعم بنجاح!' : 'Settings saved successfully!');
    } catch {
      // Ignore iframe alert restriction
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200 no-print">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="bg-white w-full max-w-4xl h-[92vh] rounded-3xl flex flex-col shadow-2xl relative overflow-hidden z-10">
        {/* Panel Top Bar */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-500" />
            <h2 className="font-black text-base md:text-lg">
              {isAr ? 'لوحة تحكم إدارة المنيو' : 'Menu Admin Control Panel'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                let confirmed = true;
                try {
                  confirmed = window.confirm(isAr ? 'إعادة المنيو للقائمة الافتراضية الأولى؟' : 'Reset menu to default items?');
                } catch {
                  confirmed = true;
                }
                if (confirmed) {
                  onResetToDefaults();
                }
              }}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-xl transition cursor-pointer"
              title="Reset"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isAr ? 'استعادة الافتراضي' : 'Reset Defaults'}</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsItemModalOpen(false);
                onClose();
              }}
              aria-label={isAr ? 'إغلاق اللوحة' : 'Close Panel'}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-red-600 text-slate-200 hover:text-white flex items-center gap-1.5 text-xs font-extrabold transition cursor-pointer shrink-0 border border-slate-700"
            >
              <X className="w-4 h-4 text-amber-400 group-hover:text-white" />
              <span>{isAr ? 'إغلاق' : 'Close'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'items'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>{isAr ? `إدارة الأصناف والأسعار (${menuItems.length})` : `Items (${menuItems.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>{isAr ? `إدارة الأقسام (${categories.length - 1})` : `Categories`}</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'config'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>{isAr ? 'إعدادات المطعم والواتساب' : 'Restaurant & WhatsApp Settings'}</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
          {/* TAB 1: MENU ITEMS MANAGER */}
          {activeTab === 'items' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">
                  {isAr
                    ? 'يمكنك إضافة أصناف جديدة، تعديل الأسعار، وتفعيل/إيقاف الطبق عند النفاد من المطبخ.'
                    : 'Manage dishes, update prices, and toggle availability instantly.'}
                </p>
                <button
                  onClick={handleOpenAddItem}
                  className="bg-slate-900 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? 'إضافة طبق جديد' : 'Add New Item'}</span>
                </button>
              </div>

              {/* Items Table / List */}
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-2xs">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.nameAr}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-slate-900">
                            {isAr ? item.nameAr : item.nameEn}
                          </h4>
                          {!item.isAvailable && (
                            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {isAr ? 'نفدت الكمية' : 'Out of stock'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.descriptionAr}</p>
                        <span className="font-black text-amber-600 text-xs mt-1 block">
                          {item.price} {currency}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {/* Availability Toggle Button */}
                      <button
                        onClick={() => handleToggleAvailability(item.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                          item.isAvailable
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                        title={isAr ? 'تبديل التوفر' : 'Toggle Availability'}
                      >
                        {item.isAvailable ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{item.isAvailable ? (isAr ? 'متوفر' : 'In Stock') : (isAr ? 'غير متوفر' : 'Out of Stock')}</span>
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleOpenEditItem(item)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CATEGORIES MANAGER */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-xs text-slate-800 uppercase">
                  {isAr ? 'إضافة قسم جديد للمنيو' : 'Add New Category'}
                </h3>
                {catError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{catError}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newCatAr}
                    onChange={(e) => setNewCatAr(e.target.value)}
                    placeholder={isAr ? 'اسم القسم بالعربي (مثال: الشوربات)' : 'Category Name (Arabic)'}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                  <input
                    type="text"
                    value={newCatEn}
                    onChange={(e) => setNewCatEn(e.target.value)}
                    placeholder={isAr ? 'الاسم بالإنجليزية (English)' : 'Category Name (English)'}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                  <button
                    onClick={handleAddCategory}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAr ? 'إضافة القسم' : 'Add Category'}</span>
                  </button>
                </div>
              </div>

              {/* Categories list */}
              <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-3.5 flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-xs text-slate-900">{cat.nameAr}</span>
                      <span className="text-[11px] text-slate-400 ms-2">({cat.nameEn})</span>
                    </div>
                    {cat.id !== 'all' && (
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RESTAURANT & WHATSAPP SETTINGS */}
          {activeTab === 'config' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 max-w-2xl mx-auto shadow-2xs">
              <h3 className="font-black text-sm text-slate-900 border-b border-slate-100 pb-2">
                {isAr ? 'إعدادات بيانات المطعم واستقبال الطلبات' : 'Restaurant & Order Settings'}
              </h3>

              {/* LOGO & APP ICON SECTION */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-amber-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-amber-950">
                        {isAr ? 'شعار المطعم وأيقونة التطبيق (PWA)' : 'Restaurant Logo & App Icon'}
                      </h4>
                      <p className="text-[11px] text-amber-800/80">
                        {isAr
                          ? 'يظهر الشعار أعلى المنيو، ويُستخدم تلقائياً كأيقونة للتطبيق عند تثبيته على جوال العميل أو المطعم'
                          : 'Displays on header & serves as app icon on mobile home screens'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Logo Preview Badge */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400 bg-white shadow-md p-1 group">
                      <img
                        src={configForm.logoUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80'}
                        alt="Logo"
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-black/10 rounded-xl" />
                    </div>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                      {isAr ? 'معاينة الأيقونة' : 'Icon Preview'}
                    </span>
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-2.5 w-full">
                    {/* File Upload Button */}
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-amber-400 hover:border-amber-600 bg-white hover:bg-amber-100/50 rounded-xl cursor-pointer transition text-xs font-bold text-amber-950 shadow-2xs">
                      <Upload className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{isAr ? 'رفع ملف اللوجو من جهازك (صورة)' : 'Upload Logo File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              alert(isAr ? 'حجم الصورة كبير جداً (الأقصى 5 ميجابايت)' : 'Image is too large (max 5MB)');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setConfigForm({ ...configForm, logoUrl: reader.result });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    {/* Direct URL Input */}
                    <div>
                      <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                        {isAr ? 'أو أدخل رابط اللوجو مباشرة (URL):' : 'Or enter logo image URL:'}
                      </label>
                      <input
                        type="text"
                        value={configForm.logoUrl || ''}
                        onChange={(e) => setConfigForm({ ...configForm, logoUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-white border border-amber-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'اسم المطعم (عربي)' : 'Restaurant Name (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={configForm.nameAr}
                    onChange={(e) => setConfigForm({ ...configForm, nameAr: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'اسم المطعم (English)' : 'Restaurant Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={configForm.nameEn}
                    onChange={(e) => setConfigForm({ ...configForm, nameEn: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'الوصف الفرعي / الشعار (عربي)' : 'Subtitle / Slogan (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={configForm.subtitleAr || ''}
                    onChange={(e) => setConfigForm({ ...configForm, subtitleAr: e.target.value })}
                    placeholder={isAr ? 'مثال: أشهى المأكولات والمشويات' : 'e.g. Delicious Food & Grills'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'الوصف الفرعي / الشعار (English)' : 'Subtitle / Slogan (English)'}
                  </label>
                  <input
                    type="text"
                    value={configForm.subtitleEn || ''}
                    onChange={(e) => setConfigForm({ ...configForm, subtitleEn: e.target.value })}
                    placeholder="e.g. Delicious Food & Grills"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1 text-emerald-700">
                    {isAr ? 'رقم الواتساب المخصص لاستقبال الطلبات (مع كود الدولة بدون +)' : 'WhatsApp Phone Number (with Country Code)'}
                  </label>
                  <input
                    type="text"
                    value={configForm.whatsappPhone}
                    onChange={(e) => setConfigForm({ ...configForm, whatsappPhone: e.target.value })}
                    placeholder="201012345678"
                    className="w-full bg-emerald-50 border border-emerald-300 rounded-xl px-3 py-2 text-xs font-extrabold text-emerald-900"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    {isAr ? 'مثال لمصر: 201012345678 - للسعودية: 966500000000' : 'Example: 201012345678'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'العملة (عربي)' : 'Currency (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={configForm.currencyAr}
                    onChange={(e) => setConfigForm({ ...configForm, currencyAr: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'العملة (English)' : 'Currency (English)'}
                  </label>
                  <input
                    type="text"
                    value={configForm.currencyEn || ''}
                    onChange={(e) => setConfigForm({ ...configForm, currencyEn: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'عدد طاولات المطعم' : 'Total Restaurant Tables'}
                  </label>
                  <input
                    type="number"
                    value={configForm.tableCount}
                    onChange={(e) => setConfigForm({ ...configForm, tableCount: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'رسوم التوصيل' : 'Delivery Fee'}
                  </label>
                  <input
                    type="number"
                    value={configForm.deliveryFee}
                    onChange={(e) => setConfigForm({ ...configForm, deliveryFee: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'العنوان (عربي)' : 'Address (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={configForm.addressAr}
                    onChange={(e) => setConfigForm({ ...configForm, addressAr: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'العنوان (English)' : 'Address (English)'}
                  </label>
                  <input
                    type="text"
                    value={configForm.addressEn || ''}
                    onChange={(e) => setConfigForm({ ...configForm, addressEn: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              {configError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{configError}</span>
                </div>
              )}

              <button
                onClick={handleSaveConfig}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition"
              >
                <Save className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'حفظ إعدادات المطعم' : 'Save Restaurant Settings'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Panel Bottom Footer Bar */}
        <div className="bg-slate-100 border-t border-slate-200 p-3 px-4 flex justify-between items-center text-xs text-slate-600 shrink-0">
          <span className="font-semibold text-[11px] text-slate-500 hidden sm:inline">
            {isAr ? 'نظام التحكم الإداري بالمنيو التفاعلي' : 'Interactive Menu Admin Panel'}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsItemModalOpen(false);
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-red-600 text-white font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <X className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'إغلاق لوحة التحكم' : 'Close Admin Panel'}</span>
          </button>
        </div>
      </div>

      {/* CREATE / EDIT ITEM MODAL */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          {/* Backdrop overlay click to close sub-modal */}
          <div className="absolute inset-0" onClick={() => setIsItemModalOpen(false)} />

          <div className="bg-white w-full max-w-lg rounded-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl relative z-10">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900">
                {editingItem
                  ? isAr
                    ? 'تعديل الطبق'
                    : 'Edit Dish'
                  : isAr
                  ? 'إضافة طبق جديد للمنيو'
                  : 'Add New Dish'}
              </h3>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsItemModalOpen(false);
                }}
                aria-label={isAr ? 'إغلاق' : 'Close'}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {itemError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{itemError}</span>
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? 'اسم الطبق (عربي)' : 'Dish Name (Arabic)'}
                </label>
                <input
                  type="text"
                  value={itemForm.nameAr || ''}
                  onChange={(e) => setItemForm({ ...itemForm, nameAr: e.target.value })}
                  placeholder="كفتة مشوية على الفحم"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? 'اسم الطبق (English)' : 'Dish Name (English)'}
                </label>
                <input
                  type="text"
                  value={itemForm.nameEn || ''}
                  onChange={(e) => setItemForm({ ...itemForm, nameEn: e.target.value })}
                  placeholder="Grilled Kofta"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'السعر' : 'Price'}
                  </label>
                  <input
                    type="number"
                    value={itemForm.price || ''}
                    onChange={(e) => setItemForm({ ...itemForm, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'القسم' : 'Category'}
                  </label>
                  <select
                    value={itemForm.categoryId || categories[0]?.id}
                    onChange={(e) => setItemForm({ ...itemForm, categoryId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  >
                    {categories
                      .filter((c) => c.id !== 'all')
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {isAr ? c.nameAr : c.nameEn}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? 'الوصف' : 'Description'}
                </label>
                <textarea
                  rows={2}
                  value={itemForm.descriptionAr || ''}
                  onChange={(e) => setItemForm({ ...itemForm, descriptionAr: e.target.value })}
                  placeholder="مكونات الطبق وتفاصيله..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 resize-none"
                />
              </div>

              {/* Image Upload and Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>{isAr ? 'صورة الطبق' : 'Dish Image'}</span>
                </label>

                {/* Upload File Box */}
                <div className="flex gap-2 items-center">
                  <label className="flex-1 flex items-center justify-center gap-2 p-2.5 border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/60 hover:bg-amber-100/60 rounded-xl cursor-pointer transition text-xs font-bold text-amber-900 shadow-2xs">
                    <Upload className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{isAr ? 'رفع صورة من جهازك (ملف)' : 'Upload Image File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            alert(isAr ? 'حجم الصورة كبير جداً (الأقصى 5 ميجابايت)' : 'Image is too large (max 5MB)');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                              setItemForm({ ...itemForm, image: reader.result });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  {itemForm.image && (
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 relative shrink-0 shadow-2xs group">
                      <img src={itemForm.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Direct URL Input */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    {isAr ? 'أو أدخل رابط صورة مباشر (URL):' : 'Or enter direct image URL:'}
                  </label>
                  <input
                    type="text"
                    value={itemForm.image || ''}
                    onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                  />
                </div>

                {/* Preset Images Fallback */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    {isAr ? 'أو اختر صورة جاهزة من المنيو:' : 'Or choose from menu presets:'}
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                    {presetImages.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setItemForm({ ...itemForm, image: preset.url })}
                        className={`h-11 rounded-lg overflow-hidden border-2 relative cursor-pointer ${
                          itemForm.image === preset.url ? 'border-amber-500 scale-105 shadow-2xs' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                        title={preset.title}
                      >
                        <img src={preset.url} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Checkbox Options */}
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.isAvailable ?? true}
                    onChange={(e) => setItemForm({ ...itemForm, isAvailable: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded"
                  />
                  <span>{isAr ? 'متوفر للطلب' : 'Available'}</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-amber-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.popularTag ?? false}
                    onChange={(e) => setItemForm({ ...itemForm, popularTag: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded"
                  />
                  <span>{isAr ? 'إشارة الأكثر طلباً' : 'Popular Badge'}</span>
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveItem}
                className="px-5 py-2 rounded-xl text-xs font-extrabold bg-amber-500 text-white hover:bg-amber-600 shadow-xs cursor-pointer"
              >
                {isAr ? 'حفظ الطبق' : 'Save Dish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
