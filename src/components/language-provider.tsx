'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    "Home": "Home",
    "About Us": "About Us",
    "Buy a Business": "Buy a Business",
    "Sell a Business": "Sell a Business",
    "Contact Us": "Contact Us",
    "Sign In": "Sign In",
    "Sign Up": "Sign Up",

    // Hero Section
    "The Largest Business Marketplace in UAE": "The Largest Business Marketplace in UAE",
    "Find your perfect business opportunity or sell your business with ease": "Find your perfect business opportunity or sell your business with ease",
    "Find a Business": "Find a Business",
    "Sell Your Business": "Sell Your Business",
    "Search businesses...": "Search businesses...",
    "Search": "Search",
    "All Categories": "All Categories",
    "Select a category": "Select a category",
    "Price Range": "Price Range",
    "Location": "Location",
    "Select location": "Select location",

    // Features Section
    "Features": "Features",
    "For Buyers": "For Buyers",
    "For Sellers": "For Sellers",
    "Business Information": "Business Information",
    "Comprehensive details on each listed business": "Comprehensive details on each listed business",
    "Validation": "Validation",
    "Verified listings for your peace of mind": "Verified listings for your peace of mind",
    "Numbers is Everything": "Numbers is Everything",
    "Detailed financial data and performance metrics": "Detailed financial data and performance metrics",
    "Powered by AI": "Powered by AI",
    "AI-driven insights and recommendations": "AI-driven insights and recommendations",
    "Reach More People": "Reach More People",
    "Connect with a wide network of potential buyers": "Connect with a wide network of potential buyers",
    "Sell in a Week": "Sell in a Week",
    "Streamlined process for quick sales": "Streamlined process for quick sales",
    "Privacy": "Privacy",
    "Confidential listings to protect your business": "Confidential listings to protect your business",
    "AI-assisted valuation and listing optimization": "AI-assisted valuation and listing optimization",

    // Why Us Section
    "Why Choose Us": "Why Choose Us",
    "Largest Marketplace": "Largest Marketplace",
    "Access the biggest selection of businesses in the UAE": "Access the biggest selection of businesses in the UAE",
    "Trusted Sources": "Trusted Sources",
    "All listings are verified and from reliable sources": "All listings are verified and from reliable sources",
    "Communicate Directly": "Communicate Directly",
    "Connect with buyers or sellers without intermediaries": "Connect with buyers or sellers without intermediaries",
    "Legal Assistance": "Legal Assistance",
    "Get help with legal aspects of buying or selling a business": "Get help with legal aspects of buying or selling a business",
    "Financial Assistance": "Financial Assistance",
    "Access financial advice and support for your transaction": "Access financial advice and support for your transaction",

    // CTA Banner
    "Ready to Start Your Business Journey?": "Ready to Start Your Business Journey?",
    "Whether you're looking to buy or sell, we're here to help you succeed.": "Whether you're looking to buy or sell, we're here to help you succeed.",
    "List Your Business": "List Your Business",

    // Footer
    "Quick Links": "Quick Links",
    "Newsletter": "Newsletter",
    "Enter your email": "Enter your email",
    "Subscribe": "Subscribe",
    "Follow Us": "Follow Us",
    "All rights reserved.": "All rights reserved.",

    // Insights Section
    "UAE Business Insights": "UAE Business Insights",
    "Growth Rate": "Growth Rate",
    "Annual GDP growth rate": "Annual GDP growth rate",
    "Startups": "Startups",
    "New startups per year": "New startups per year",
    "Investment": "Investment",
    "Annual foreign investment": "Annual foreign investment",

    // Business Search
    "Search": "Search",
    "Search businesses...": "Search businesses...",
    "Price Range": "Price Range",
    "Select Industry": "Select Industry",
    "Industry": "Industry",
    "Location": "Location",
    "Select location": "Select location",
    "Invest": "Invest",
    "Sell": "Sell",
    "Buy": "Buy",

    // Industry Categories
    "Retail": "Retail",
    "Food & Beverage": "Food & Beverage",
    "Technology": "Technology",
    "Manufacturing": "Manufacturing",
    "Healthcare": "Healthcare",
    "Real Estate": "Real Estate",
    "Construction": "Construction",
    "Automotive": "Automotive",
    "Education": "Education",
    "Other": "Other",

    // Business Search Actions
    "buy": "Buy",
    "sell": "Sell",
    "invest": "Invest",
    "Buy": "Buy",
    "Sell": "Sell",
    "Invest": "Invest",

    // Buy Page
    "Browse through our curated selection of businesses for sale in the UAE": "Browse through our curated selection of businesses for sale in the UAE",
    "Industries": "Industries",
    "Active Listings": "Active Listings",
    "Business Category": "Business Category",
    "Select category": "Select category",
    "Business Price": "Business Price",
    "Enter price": "Enter price",
    "Acquisition Type": "Acquisition Type",
    "Select type": "Select type",
    "Annual Revenue": "Annual Revenue",
    "Select revenue range": "Select revenue range",
    "Profit Margin": "Profit Margin",
    "Enter profit margin %": "Enter profit margin %",
    "Area": "Area",
    "Select area": "Select area",
    "Filter": "Filter",
    "Reset": "Reset",
    "Loading...": "Loading...",
    "Under AED 500K": "Under AED 500K",
    "AED 500K - 1M": "AED 500K - 1M",
    "AED 1M - 2M": "AED 1M - 2M",
    "AED 2M - 5M": "AED 2M - 5M",
    "AED 5M - 10M": "AED 5M - 10M",
    "Above AED 10M": "Above AED 10M",

    // Pagination and Results
    "Showing": "Showing",
    "of": "of",
    "Next": "Next",
    "Previous": "Previous",
    "results": "results",

    // Locations
    "Dubai": "Dubai",
    "Abu Dhabi": "Abu Dhabi",
    "Sharjah": "Sharjah",
    "Ajman": "Ajman",
    "Ras Al Khaimah": "Ras Al Khaimah",
    "Umm Al Quwain": "Umm Al Quwain",
    "Fujairah": "Fujairah",

    // Business Categories
    "Cafe": "Cafe",
    "Restaurant": "Restaurant",
    "Retail Store": "Retail Store",
    "E-commerce": "E-commerce",
    "Manufacturing": "Manufacturing",
    "Services": "Services",

    // Revenue Ranges
    "0 - 100,000 AED": "0 - 100,000 AED",
    "100,000 - 500,000 AED": "100,000 - 500,000 AED",
    "500,000 - 1,000,000 AED": "500,000 - 1,000,000 AED",
    "1,000,000+ AED": "1,000,000+ AED",

    "Filters": "Filters",
    "Business Price (AED)": "Business Price (AED)",
    "Min Price": "Min Price",
    "Max Price": "Max Price",
    "Profit Margin (%)": "Profit Margin (%)",
    "Min Margin": "Min Margin",
    "Max Margin": "Max Margin",
    "Monthly Revenue": "Monthly Revenue",
    "Asking Price": "Asking Price",
    "View Details": "View Details",
    "AED": "AED",
    "Est.": "Est.",
    "Featured": "Featured",
    "Select Industry": "Select Industry",
    "Price Range": "Price Range",
    "Profit Margin": "Profit Margin",
    "Search Businesses": "Search Businesses",
    "Under AED 500K": "Under AED 500K",
    "AED 500K - 1M": "AED 500K - 1M",
    "AED 1M - 2M": "AED 1M - 2M",
    "AED 2M - 5M": "AED 2M - 5M",
    "AED 5M - 10M": "AED 5M - 10M",
    "Above AED 10M": "Above AED 10M",
    "0-10%": "0-10%",
    "10-20%": "10-20%",
    "20-30%": "20-30%",
    "30-40%": "30-40%",
    "Above 40%": "Above 40%"
  },
  ar: {
    // Navigation
    "Home": "الرئيسية",
    "About Us": "من نحن",
    "Buy a Business": "شراء شركة",
    "Sell a Business": "بيع شركة",
    "Contact Us": "اتصل بنا",
    "Sign In": "تسجيل الدخول",
    "Sign Up": "إنشاء حساب",

    // Hero Section
    "The Largest Business Marketplace in UAE": "أكبر سوق للشركات في الإمارات",
    "Find your perfect business opportunity or sell your business with ease": "اعثر على فرصتك التجارية المثالية أو بع شركتك بسهولة",
    "Find a Business": "ابحث عن شركة",
    "Sell Your Business": "بع شركتك",
    "Search businesses...": "البحث عن الشركات...",
    "Search": "بحث",
    "All Categories": "جميع الفئات",
    "Select a category": "اختر فئة",
    "Price Range": "نطاق السعر",
    "Location": "الموقع",
    "Select location": "اختر الموقع",

    // Features Section
    "Features": "المميزات",
    "For Buyers": "للمشترين",
    "For Sellers": "للبائعين",
    "Business Information": "معلومات الشركة",
    "Comprehensive details on each listed business": "تفاصيل شاملة عن كل شركة معروضة",
    "Validation": "التحقق",
    "Verified listings for your peace of mind": "قوائم موثقة لراحة بالك",
    "Numbers is Everything": "الأرقام هي كل شيء",
    "Detailed financial data and performance metrics": "بيانات مالية ومؤشرات أداء مفصلة",
    "Powered by AI": "مدعوم بالذكاء الاصطناعي",
    "AI-driven insights and recommendations": "رؤى وتوصيات مدعومة بالذكاء الاصطناعي",
    "Reach More People": "الوصول إلى المزيد",
    "Connect with a wide network of potential buyers": "تواصل مع شبكة واسعة من المشترين المحتملين",
    "Sell in a Week": "البيع في أسبوع",
    "Streamlined process for quick sales": "عملية مبسطة للبيع السريع",
    "Privacy": "الخصوصية",
    "Confidential listings to protect your business": "قوائم سرية لحماية شركتك",
    "AI-assisted valuation and listing optimization": "تقييم وتحسين القوائم بمساعدة الذكاء الاصطناعي",

    // Why Us Section
    "Why Choose Us": "لماذا تختارنا",
    "Largest Marketplace": "أكبر سوق",
    "Access the biggest selection of businesses in the UAE": "الوصول إلى أكبر مجموعة من الشركات في الإمارات",
    "Trusted Sources": "مصادر موثوقة",
    "All listings are verified and from reliable sources": "جميع القوائم موثقة ومن مصادر موثوقة",
    "Communicate Directly": "تواصل مباشر",
    "Connect with buyers or sellers without intermediaries": "تواصل مع المشترين أو البائعين بدون وسطاء",
    "Legal Assistance": "مساعدة قانونية",
    "Get help with legal aspects of buying or selling a business": "احصل على مساعدة في الجوانب القانونية لشراء أو بيع شركة",
    "Financial Assistance": "مساعدة مالية",
    "Access financial advice and support for your transaction": "احصل على استشارات ودعم مالي لمعاملتك",

    // CTA Banner
    "Ready to Start Your Business Journey?": "هل أنت مستعد لبدء رحلتك التجارية؟",
    "Whether you're looking to buy or sell, we're here to help you succeed.": "سواء كنت تبحث عن الشراء أو البيع، نحن هنا لمساعدتك على النجاح",
    "List Your Business": "ارض شر��",

    // Footer
    "Quick Links": "روابط سريعة",
    "Newsletter": "النشرة الإخبارية",
    "Enter your email": "أدخل بريدك الإلكتروني",
    "Subscribe": "اشترك",
    "Follow Us": "تابعنا",
    "All rights reserved.": "جميع الحقوق محفوظة",

    // Insights Section
    "UAE Business Insights": "رؤى الأعمال في الإمارات",
    "Growth Rate": "معدل النمو",
    "Annual GDP growth rate": "معدل نمو الناتج المحلي السنوي",
    "Startups": "الشركات الناشئة",
    "New startups per year": "شركات ناشئة جديدة سنوياً",
    "Investment": "الاستثمار",
    "Annual foreign investment": "الاستثمار الأجنبي السنوي",

    // Business Search
    "Search": "بحث",
    "Search businesses...": "البحث عن الشركات...",
    "Price Range": "نطاق السعر",
    "Select Industry": "اختر القطاع",
    "Industry": "القطاع",
    "Location": "الموقع",
    "Select location": "اختر الموقع",
    "Invest": "استثمر",
    "Sell": "بيع",
    "Buy": "شراء",

    // Industry Categories
    "Retail": "تجارة التزة",
    "Food & Beverage": "الأغذية والمشروبات",
    "Technology": "التكنولوجيا",
    "Manufacturing": "التصنيع",
    "Healthcare": "الرعاية الصحية",
    "Real Estate": "العقارات",
    "Construction": "البناء والتشييد",
    "Automotive": "السيارات",
    "Education": "التعليم",
    "Other": "أخرى",

    // Business Search Actions
    "buy": "شراء",
    "sell": "بيع",
    "invest": "استثمار",
    "Buy": "شراء",
    "Sell": "بيع",
    "Invest": "استثمار",

    // Buy Page
    "Browse through our curated selection of businesses for sale in the UAE": "تصفح مجموعتنا المختارة من الشركات المعروضة للبيع في الإمارات",
    "Industries": "القطاعات",
    "Active Listings": "القوائم النشطة",
    "Business Category": "فئة الأعمال",
    "Select category": "اختر الفئة",
    "Business Price": "سعر الشركة",
    "Enter price": "أدخل السعر",
    "Acquisition Type": "نوع الاستحواذ",
    "Select type": "اختر النوع",
    "Annual Revenue": "الإيرادات السنوية",
    "Select revenue range": "ا��تر نطاق الإيرادات",
    "Profit Margin": "هامش الربح",
    "Enter profit margin %": "أدخل نسبة هامش الربح",
    "Area": "المنطقة",
    "Select area": "اختر المنطقة",
    "Filter": "تصفية",
    "Reset": "إعادة تعيين",
    "Loading...": "جاري التحميل...",
    "Under AED 500K": "أقل من 500 ألف درهم",
    "AED 500K - 1M": "500 ألف - 1 مليون درهم",
    "AED 1M - 2M": "1 - 2 مليون درهم",
    "AED 2M - 5M": "2 - 5 مليون درهم",
    "AED 5M - 10M": "5 - 10 مليون درهم",
    "Above AED 10M": "أكثر من 10 مليون درهم",

    // Pagination and Results
    "Showing": "عرض",
    "of": "من",
    "Next": "التالي",
    "Previous": "السابق",
    "results": "نتيجة",

    // Locations
    "Dubai": "دبي",
    "Abu Dhabi": "أبوظبي",
    "Sharjah": "الشارقة",
    "Ajman": "عجمان",
    "Ras Al Khaimah": "رأس الخيمة",
    "Umm Al Quwain": "أم القيوين",
    "Fujairah": "الفجيرة",

    // Business Categories
    "Cafe": "مقهى",
    "Restaurant": "مطعم",
    "Retail Store": "متجر",
    "E-commerce": "تجات إلكترونية",
    "Manufacturing": "تصنيع",
    "Services": "خدمات",

    // Revenue Ranges
    "0 - 100,000 AED": "0 - 100,000 درهم",
    "100,000 - 500,000 AED": "100,000 - 500,000 درهم",
    "500,000 - 1,000,000 AED": "500,000 - 1,000,000 درهم",
    "1,000,000+ AED": "1,000,000+ درهم",

    "Filters": "التصفية",
    "Business Price (AED)": "سعر الشركة (درهم)",
    "Min Price": "الحد الأدنى للسعر",
    "Max Price": "الحد الأقصى للسعر",
    "Profit Margin (%)": "هامش الربح (%)",
    "Min Margin": "الحد الأدنى للهامش",
    "Max Margin": "الحد الأقصى للهامش",
    "Monthly Revenue": "الإيرادات الشهرية",
    "Asking Price": "السعر المطلوب",
    "View Details": "عرض التفاصيل",
    "AED": "درهم",
    "Est.": "تأسست",
    "Featured": "مميز",
    "Select Industry": "اختر القطاع",
    "Price Range": "نطاق السعر",
    "Profit Margin": "هامش الربح",
    "Search Businesses": "البحث عن الشركات",
    "Under AED 500K": "أقل من 500 ألف درهم",
    "AED 500K - 1M": "500 ألف - 1 مليون درهم",
    "AED 1M - 2M": "1 - 2 مليون درهم",
    "AED 2M - 5M": "2 - 5 مليون درهم",
    "AED 5M - 10M": "5 - 10 مليون درهم",
    "Above AED 10M": "أكثر من 10 مليون درهم",
    "0-10%": "0-10%",
    "10-20%": "10-20%",
    "20-30%": "20-30%",
    "30-40%": "30-40%",
    "Above 40%": "Above 40%"
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

