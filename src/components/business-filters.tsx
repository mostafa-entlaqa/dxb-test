'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

export default function BusinessFilters() {
  const { t, language } = useLanguage()

  return (
    <form className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className={language === 'ar' ? 'font-arabic' : ''}>
            {t("Business Category")}
          </Label>
          <Select>
            <SelectTrigger className={cn(
              'mt-2',
              language === 'ar' ? 'font-arabic text-right' : ''
            )}>
              <SelectValue placeholder={t("Select category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cafe">{t("Cafe")}</SelectItem>
              <SelectItem value="restaurant">{t("Restaurant")}</SelectItem>
              <SelectItem value="retail">{t("Retail")}</SelectItem>
              {/* Add more categories as needed */}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className={language === 'ar' ? 'font-arabic' : ''}>
            {t("Business Price")}
          </Label>
          <Input 
            type="text" 
            placeholder={t("Enter price")} 
            className={cn(
              'mt-2',
              language === 'ar' ? 'font-arabic text-right' : ''
            )}
          />
        </div>

        <div>
          <Label className={language === 'ar' ? 'font-arabic' : ''}>
            {t("Acquisition Type")}
          </Label>
          <Select>
            <SelectTrigger className={cn(
              'mt-2',
              language === 'ar' ? 'font-arabic text-right' : ''
            )}>
              <SelectValue placeholder={t("Select type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buy">{t("Buy")}</SelectItem>
              <SelectItem value="invest">{t("Invest")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className={language === 'ar' ? 'font-arabic' : ''}>
            {t("Annual Revenue")}
          </Label>
          <Select>
            <SelectTrigger className={cn(
              'mt-2',
              language === 'ar' ? 'font-arabic text-right' : ''
            )}>
              <SelectValue placeholder={t("Select revenue range")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-100000">{t("0 - 100,000 AED")}</SelectItem>
              <SelectItem value="100000-500000">{t("100,000 - 500,000 AED")}</SelectItem>
              <SelectItem value="500000-1000000">{t("500,000 - 1,000,000 AED")}</SelectItem>
              <SelectItem value="1000000+">{t("1,000,000+ AED")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className={language === 'ar' ? 'font-arabic' : ''}>
            {t("Profit Margin")}
          </Label>
          <Input 
            type="text" 
            placeholder={t("Enter profit margin %")} 
            className={cn(
              'mt-2',
              language === 'ar' ? 'font-arabic text-right' : ''
            )}
          />
        </div>

        <div>
          <Label className={language === 'ar' ? 'font-arabic' : ''}>
            {t("Area")}
          </Label>
          <Select>
            <SelectTrigger className={cn(
              'mt-2',
              language === 'ar' ? 'font-arabic text-right' : ''
            )}>
              <SelectValue placeholder={t("Select area")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dubai">{t("Dubai")}</SelectItem>
              <SelectItem value="abu-dhabi">{t("Abu Dhabi")}</SelectItem>
              <SelectItem value="ras-al-khaimah">{t("Ras Al Khaimah")}</SelectItem>
              {/* Add more areas as needed */}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            type="submit" 
            className={cn(
              'flex-1',
              language === 'ar' ? 'font-arabic' : ''
            )}
          >
            {t("Filter")}
          </Button>
          <Button 
            type="reset" 
            variant="outline"
            className={cn(
              'flex-1',
              language === 'ar' ? 'font-arabic' : ''
            )}
          >
            {t("Reset")}
          </Button>
        </div>
      </div>
    </form>
  )
}

