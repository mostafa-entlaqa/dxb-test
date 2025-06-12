"use client"

import { CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterState {
  timeRange: string
  dateRange: { from: Date | null; to: Date | null }
}

interface DateFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function DateFilters({ filters, onFiltersChange }: DateFiltersProps) {
  const handleTimeRangeChange = (value: string) => {
    if (value === "custom") {
      onFiltersChange({
        ...filters,
        timeRange: value,
      })
      return
    }

    onFiltersChange({
      ...filters,
      timeRange: value,
      dateRange: { from: null, to: null },
    })
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    onFiltersChange({
      ...filters,
      timeRange: "custom",
      dateRange: {
        from: range?.from || null,
        to: range?.to || null,
      },
    })
  }

  const clearDateRange = () => {
    onFiltersChange({
      ...filters,
      timeRange: "3months",
      dateRange: { from: null, to: null },
    })
  }

  const hasCustomDateRange = filters.dateRange.from && filters.dateRange.to

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Filter by:</span>
        <Select value={filters.timeRange} onValueChange={handleTimeRangeChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="1year">Last year</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Custom Date Range Picker */}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[300px] justify-start text-left font-normal border-2 transition-all duration-200",
                !hasCustomDateRange && "text-muted-foreground border-border hover:border-blue-300",
                hasCustomDateRange && "border-blue-500 bg-blue-50 text-blue-900 hover:bg-blue-100",
              )}
            >
              <CalendarIcon className={cn("mr-2 h-4 w-4", hasCustomDateRange && "text-blue-600")} />
              {hasCustomDateRange ? (
                <span className="font-medium">
                  {format(filters.dateRange.from!, "MMM dd, yyyy")} - {format(filters.dateRange.to!, "MMM dd, yyyy")}
                </span>
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 shadow-lg border-2" align="start">
            <div className="bg-white rounded-lg">
              {/* Header */}
              <div className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <h4 className="font-semibold text-sm text-gray-900">Select Date Range</h4>
                <p className="text-xs text-gray-600 mt-1">Choose start and end dates for your analytics</p>
              </div>

              {/* Selected Dates Preview */}
              {hasCustomDateRange && (
                <div className="px-4 py-2 bg-blue-50 border-b">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex-1">
                      <span className="text-xs text-gray-500">Start Date:</span>
                      <p className="font-medium text-blue-900">{format(filters.dateRange.from!, "MMMM dd, yyyy")}</p>
                    </div>
                    <div className="flex-1">
                      <span className="text-xs text-gray-500">End Date:</span>
                      <p className="font-medium text-blue-900">{format(filters.dateRange.to!, "MMMM dd, yyyy")}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Calendar */}
              <div className="p-4">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange.from || new Date()}
                  selected={{
                    from: filters.dateRange.from || undefined,
                    to: filters.dateRange.to || undefined,
                  }}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                  className="rounded-md"
                  classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button: cn(
                      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
                      "hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                    ),
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: cn(
                      "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                      "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                    ),
                    day: cn(
                      "inline-flex items-center justify-center text-sm font-normal ring-offset-background transition-colors",
                      "hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 font-normal",
                    ),
                    day_selected:
                      "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white",
                    day_today: "bg-accent text-accent-foreground font-semibold",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_range_middle:
                      "aria-selected:bg-blue-600 aria-selected:text-white hover:aria-selected:bg-blue-700 focus:aria-selected:bg-blue-600 rounded-none",
                    day_hidden: "invisible",
                  }}
                />
              </div>

              {/* Footer */}
              {hasCustomDateRange && (
                <div className="px-4 py-3 border-t bg-gray-50 rounded-b-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Selected Range:</span> {format(filters.dateRange.from!, "MMM dd, yyyy")} -{" "}
                      {format(filters.dateRange.to!, "MMM dd, yyyy")}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearDateRange}
                      className="text-xs h-7 px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    >
                      Clear selection
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {hasCustomDateRange && (
          <Button
            variant="outline"
            size="icon"
            onClick={clearDateRange}
            className="h-10 w-10 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
