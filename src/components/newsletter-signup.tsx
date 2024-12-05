import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function NewsletterSignup() {
  return (
    <div className="bg-primary text-primary-foreground py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
        <form className="flex space-x-2">
          <Input type="email" placeholder="Enter your email" className="flex-grow" />
          <Button type="submit">Subscribe</Button>
        </form>
      </div>
    </div>
  )
}

