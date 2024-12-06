'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Language = 'en' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    "Home": "Home",
    "About Us": "About Us",
    "Buy Business": "Buy Business",
    "Sell Business": "Sell Business",
    "Contact": "Contact",
    "Sign In": "Sign In",
    "Sign Up": "Sign Up",

    // Hero Section
    "The Largest Business Marketplace in UAE": "The Largest Business Marketplace in UAE",
    "Find your perfect business opportunity or sell your business with ease": "Find your perfect business opportunity or sell your business with ease",
    "Find a Business": "Find a Business",
    "Buy a Business": "Buy a Business",
    "Sell Your Business": "Sell Your Business",
    "Search": "Search",
    "Select Industry": "Select Industry",
    "Price Range": "Price Range",
    "Profit Margin": "Profit Margin",
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
    "Above 40%": "Above 40%",

    // Features
    "Features": "Features",
    "For Buyers": "For Buyers",
    "For Sellers": "For Sellers",
    "Business Information": "Business Information",
    "Comprehensive details on each listed business": "Comprehensive details on each listed business",
    "Verified Listings": "Verified Listings",
    "All businesses are thoroughly vetted": "All businesses are thoroughly vetted",
    "Direct Communication": "Direct Communication",
    "Connect directly with business owners": "Connect directly with business owners",
    "Professional Support": "Professional Support",
    "Expert guidance throughout the process": "Expert guidance throughout the process",
    "Market Insights": "Market Insights",
    "Access detailed market analysis": "Access detailed market analysis",
    "Maximum Exposure": "Maximum Exposure",
    "Reach the largest buyer network": "Reach the largest buyer network",

    // Why Choose Us
    "Why Choose Us": "Why Choose Us",
    "Discover why businesses trust us for their buying and selling needs": "Discover why businesses trust us for their buying and selling needs",
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

    // Insights Section
    "UAE Business Insights": "UAE Business Insights",
    "Growth Rate": "Growth Rate",
    "Annual GDP growth rate": "Annual GDP growth rate",
    "Startups": "Startups",
    "New startups per year": "New startups per year",
    "Investment": "Investment",
    "Annual foreign investment": "Annual foreign investment",

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
    "AI Assistance": "AI Assistance",
    "AI-assisted valuation and listing optimization": "AI-assisted valuation and listing optimization",

    // Footer
    "Quick Links": "Quick Links",
    "Contact Info": "Contact Info",
    "Business Hours": "Business Hours",
    "Email": "Email",
    "Phone": "Phone",
    "Address": "Address",
    "Dubai, UAE": "Dubai, UAE",
    "Monday - Friday": "Monday - Friday",
    "Saturday": "Saturday",
    "Sunday": "Sunday",
    "Closed": "Closed",
    "All rights reserved.": "All rights reserved.",
    "Sell a Business": "Sell a Business",
    "Contact Us": "Contact Us",

    // Buy Page
    "Buy a Business": "Buy a Business",
    "Browse through our curated selection of businesses for sale in the UAE": "Browse through our curated selection of businesses for sale in the UAE",
    "Active Listings": "Active Listings",
    "Price Range": "Price Range",
    "Industries": "Industries",
    "No data": "No data",
    "Filters": "Filters",

    // Business Filters & List
    "Business Category": "Business Category",
    "Business Price (AED)": "Business Price (AED)",
    "Min Price": "Min Price",
    "Max Price": "Max Price",
    "Profit Margin (%)": "Profit Margin (%)",
    "Min Margin": "Min Margin",
    "Max Margin": "Max Margin",
    "Area": "Area",
    "Filter": "Filter",
    "Reset": "Reset",
    "Monthly Revenue": "Monthly Revenue",
    "View Details": "View Details",
    "Asking Price": "Asking Price",
    "Invest": "Invest",
    "buy": "Buy",
    "Next": "Next",
    "Previous": "Previous",

    // Business List
    "Buy": "Buy",
    "Est.": "Est.",
    "Featured": "Featured",
    "Error fetching businesses. Please try again later.": "Error fetching businesses. Please try again later.",
    "No Results Found": "No Results Found",
    "Can't find a business that match your criteria": "Can't find a business that match your criteria",
    "Reset Filters": "Reset Filters",
    "Retry": "Retry",
    "AED": "AED",
  },
  ar: {
    // Navigation
    "Home": "الرئيسية",
    "About Us": "من نحن",
    "Buy Business": "شراء شركة",
    "Sell Business": "بيع شركة",
    "Contact": "اتصل بنا",
    "Sign In": "تسجيل الدخول",
    "Sign Up": "إنشاء حساب",

    // Hero Section
    "The Largest Business Marketplace in UAE": "أكبر سوق للشركات في الإمارات",
    "Find your perfect business opportunity or sell your business with ease": "اعثر على فرصتك التجارية المثالية أو بع شركتك بسهولة",
    "Find a Business": "ابحث عن شركة",
    "Buy a Business": "شراء شركة",
    "Sell Your Business": "بع شركتك",
    "Search": "بحث",
    "Select Industry": "اختر القطاع",
    "Price Range": "نطاق السعر",
    "Profit Margin": "هامش الربح",
    "Under AED 500K": "أقل من 500 ألف درهم",
    "AED 500K - 1M": "500 ألف - 1 مليون درهم",
    "AED 1M - 2M": "1 - 2 مليون درهم",
    "AED 2M - 5M": "2 - 5 مليون درهم",
    "AED 5M - 10M": "5 - 10 مليون درهم",
    "Above AED 10M": "أكثر من 10 مليون درهم",
    "0-10%": "0-10٪",
    "10-20%": "10-20٪",
    "20-30%": "20-30٪",
    "30-40%": "30-40٪",
    "Above 40%": "أكثر من 40٪",

    // Features
    "Features": "المميزات",
    "For Buyers": "للمشترين",
    "For Sellers": "للبائعين",
    "Business Information": "معلومات الشركة",
    "Comprehensive details on each listed business": "تفاصيل شاملة عن كل شركة معروضة",
    "Verified Listings": "قوائم موثقة",
    "All businesses are thoroughly vetted": "جميع الشركات تم التحقق منها بدقة",
    "Direct Communication": "تواصل مباشر",
    "Connect directly with business owners": "تواصل مباشرة مع أصحاب الشركات",
    "Professional Support": "دعم احترافي",
    "Expert guidance throughout the process": "توجيه خبير طوال العملية",
    "Market Insights": "رؤى السوق",
    "Access detailed market analysis": "الوصول إلى تحليل مفصل للسوق",
    "Maximum Exposure": "أقصى انتشار",
    "Reach the largest buyer network": "الوصول إلى أكبر شبكة مشترين",

    // Why Choose Us
    "Why Choose Us": "لماذا تختارنا",
    "Discover why businesses trust us for their buying and selling needs": "اكتشف لماذا تثق بنا الشركات لاحتياجات البيع والشراء",
    "Largest Marketplace": "أكبر سوق",
    "Access the biggest selection of businesses in the UAE": "الوصول إلى أكبر مجموعة من الشركات في الإمارات",
    "Trusted Sources": "مصادر موثوقة",
    "All listings are verified and from reliable sources": "جميع القوائم تم التحقق منها ومن مصادر موثوقة",
    "Communicate Directly": "تواصل مباشر",
    "Connect with buyers or sellers without intermediaries": "تواصل مع المشترين أو البائعين بدون وسطاء",
    "Legal Assistance": "مساعدة قانونية",
    "Get help with legal aspects of buying or selling a business": "احصل على مساعدة في الجوانب القانونية لشراء أو بيع الشركة",
    "Financial Assistance": "مساعدة مالية",
    "Access financial advice and support for your transaction": "احصل على استشارات مالية ودعم لمعاملتك",

    // CTA Banner
    "Ready to Start Your Business Journey?": "هل أنت مستعد لبدء رحلتك التجارية؟",
    "Whether you're looking to buy or sell, we're here to help you succeed.": "سواء كنت تبحث عن الشراء أو البيع، نحن هنا لمساعدتك على النجاح",
    "List Your Business": "اعرض شركتك",

    // Insights Section
    "UAE Business Insights": "مؤشرات الأعمال في الإمارات",
    "Growth Rate": "معدل النمو",
    "Annual GDP growth rate": "معدل نمو الناتج المحلي السنوي",
    "Startups": "الشركات الناشئة",
    "New startups per year": "شركات ناشئة جديدة سنوياً",
    "Investment": "الاستثمار",
    "Annual foreign investment": "الاستثمار الأجنبي السنوي",

    // Features Section
    "Features": "المميزات",
    "For Buyers": "للمشترين",
    "For Sellers": "للبائعين",
    "Business Information": "معلومات الشركة",
    "Comprehensive details on each listed business": "تفاصيل شاملة عن كل شركة معروضة",
    "Validation": "التحقق",
    "Verified listings for your peace of mind": "قوائم موثقة لراحة بالك",
    "Numbers is Everything": "الأرقام هي كل شيء",
    "Detailed financial data and performance metrics": "بيانات مالية مفصلة ومؤشرات أداء",
    "Powered by AI": "مدعوم بالذكاء الاصطناعي",
    "AI-driven insights and recommendations": "رؤى وتوصيات مدعومة بالذكاء الاصطناعي",
    "Reach More People": "الوصول لمزيد من المشترين",
    "Connect with a wide network of potential buyers": "تواصل مع شبكة واسعة من المشترين المحتملين",
    "Sell in a Week": "البيع في أسبوع",
    "Streamlined process for quick sales": "عملية مبسطة للبيع السريع",
    "Privacy": "الخصوصية",
    "Confidential listings to protect your business": "قوائم سرية لحماية شركتك",
    "AI Assistance": "مساعدة الذكاء الاصطناعي",
    "AI-assisted valuation and listing optimization": "تقييم وتحسين القوائم بمساعدة الذكاء الاصطناعي",

    // Footer
    "Quick Links": "روابط سريعة",
    "Contact Info": "معلومات الاتصال",
    "Business Hours": "ساعات العمل",
    "Email": "البريد الإلكتروني",
    "Phone": "الهاتف",
    "Address": "العنوان",
    "Dubai, UAE": "دبي، الإمارات العربية المتحدة",
    "Monday - Friday": "الإثنين - الجمعة",
    "Saturday": "السبت",
    "Sunday": "الأحد",
    "Closed": "مغلق",
    "All rights reserved.": "جميع الحقوق محفوظة.",
    "Sell a Business": "بيع الشركة",
    "Contact Us": "اتصل بنا",

    // Buy Page
    "Buy a Business": "شراء شركة",
    "Browse through our curated selection of businesses for sale in the UAE": "تصفح مجموعتنا المختارة من الشركات المعروضة للبيع في الإمارات",
    "Active Listings": "القوائم النشطة",
    "Price Range": "نطاق السعر",
    "Industries": "القطاعات",
    "No data": "لا توجد بيانات",
    "Filters": "التصفية",

    // Business Filters & List
    "Business Category": "فئة الأعمال",
    "Business Price (AED)": "سعر الشركة (درهم)",
    "Min Price": "الحد الأدنى للسعر",
    "Max Price": "الحد الأقصى للسعر",
    "Profit Margin (%)": "هامش الربح (%)",
    "Min Margin": "الحد الأدنى للهامش",
    "Max Margin": "الحد الأقصى للهامش",
    "Area": "المنطقة",
    "Filter": "تصفية",
    "Reset": "إعادة تعيين",
    "Monthly Revenue": "الإيرادات الشهرية",
    "View Details": "عرض التفاصيل",
    "Asking Price": "السعر المطلوب",
    "Invest": "استثمر",
    "buy": "شراء",
    "Next": "التالي",
    "Previous": "السابق",

    // Business List
    "Buy": "شراء",
    "Est.": "تأسست",
    "Featured": "مميز",
    "Error fetching businesses. Please try again later.": "خطأ في جلب الشركات. يرجى المحاولة مرة أخرى لاحقاً",
    "No Results Found": "لم يتم العثور على نتائج",
    "Can't find a business that match your criteria": "لا يمكن العثور على شركة تطابق معاييرك",
    "Reset Filters": "إعادة تعيين التصفية",
    "Retry": "إعادة المحاولة",
    "AED": "د.إ",
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Initialize with null to handle hydration
  const [language, setLanguage] = useState<Language | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load saved language preference on mount
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('language') as Language
      // Set default to 'en' if no saved preference
      setLanguage(savedLanguage && ['en', 'ar'].includes(savedLanguage) ? savedLanguage : 'en')
    } catch (error) {
      setLanguage('en') // Fallback to English if localStorage fails
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save language preference when it changes
  useEffect(() => {
    if (language && !isLoading) {
      try {
        localStorage.setItem('language', language)
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
        document.documentElement.lang = language
      } catch (error) {
        console.error('Failed to save language preference:', error)
      }
    }
  }, [language, isLoading])

  const t = (key: string): string => {
    if (!language) return translations['en'][key] || key
    return translations[language][key] || key
  }

  // Don't render until initial language is loaded
  if (isLoading) {
    return null // Or a loading spinner if preferred
  }

  return (
    <LanguageContext.Provider value={{ 
      language: language || 'en', 
      setLanguage: (newLang: Language) => setLanguage(newLang), 
      t 
    }}>
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

