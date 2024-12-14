import { Mail, MapPin, Phone } from "lucide-react"

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
      
      <div className="max-w-3xl mx-auto grid gap-8 md:grid-cols-2">
        {/* Contact Information */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          
          <div className="flex items-start space-x-4">
            <MapPin className="w-6 h-6 mt-1 text-primary" />
            <div>
              <h3 className="font-medium">Address</h3>
              <p className="text-muted-foreground">
                1912, Park Lane Tower, Business Bay,<br />
                Dubai, UAE (Marca LLC)
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Phone className="w-6 h-6 mt-1 text-primary" />
            <div>
              <h3 className="font-medium">Phone</h3>
              <a 
                href="tel:+971507510669"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                +971 50 751 0669
              </a>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Mail className="w-6 h-6 mt-1 text-primary" />
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-muted-foreground">
                support (at) sellbusiness.ae
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContactPage 