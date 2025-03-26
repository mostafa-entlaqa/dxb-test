"use client"

import { useState } from "react"
import { Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useFormContext } from "react-hook-form"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface LinkedinUrlFieldProps {
  defaultValue?: string
}

export function LinkedinUrlField({ defaultValue }: LinkedinUrlFieldProps) {
  const [isOpen, setIsOpen] = useState(false)
  const form = useFormContext()
  const linkedinUrl = form.watch("linkedin_url") as string

  const handleSave = (newUrl: string) => {
    form.setValue("linkedin_url", newUrl, { shouldDirty: true })
    setIsOpen(false)
  }

  const openLinkedIn = () => {
    if (linkedinUrl) {
      window.open(linkedinUrl, '_blank')
    }
  }

  return (
    <FormField
      control={form.control}
      name="linkedin_url"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-2">
            {linkedinUrl ? (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 relative"
                        onClick={openLinkedIn}
                      >
                        <Linkedin className="h-5 w-5 text-[#0A66C2]" />
                        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View LinkedIn Profile</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setIsOpen(true)}
                >
                  Edit
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => setIsOpen(true)}
              >
                <Linkedin className="h-5 w-5 text-muted-foreground" />
                Add LinkedIn Profile
              </Button>
            )}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>LinkedIn Profile</DialogTitle>
                  <DialogDescription>
                    Add your LinkedIn profile URL to connect with your professional network
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/in/yourprofile"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleSave(field.value)}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
} 