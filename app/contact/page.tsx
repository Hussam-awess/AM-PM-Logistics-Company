import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-blue-700 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Contact Us</h1>
            <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
              Get in touch with our team for inquiries, quotes, or support
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div>
                <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Have questions about our services? Need a custom logistics solution? Our team is here to help. Reach
                  out to us through any of the contact methods below.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-muted-foreground">+255 XXX XXX XXX</p>
                      <p className="text-muted-foreground">+243 XXX XXX XXX (Congo)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-muted-foreground">info@ampm.co.tz</p>
                      <p className="text-muted-foreground">support@ampm.co.tz</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Business Hours</h3>
                      <p className="text-muted-foreground">Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p className="text-muted-foreground">Saturday: 9:00 AM - 2:00 PM</p>
                      <p className="text-muted-foreground">24/7 Emergency Support Available</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">Our Offices</h2>

                <div className="space-y-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Dar es Salaam Office</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            Main Office & Headquarters
                            <br />
                            Dar es Salaam
                            <br />
                            Tanzania
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">DR Congo Office</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            Regional Office
                            <br />
                            DR Congo
                            <br />
                            Democratic Republic of Congo
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-slate-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Need Immediate Assistance?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              For urgent transport requests or immediate support, contact our 24/7 operations team
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+255XXXXXXXXX"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                <Phone className="h-5 w-5" />
                Call Now
              </a>
              <a
                href="mailto:info@ampm.co.tz"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-input bg-background rounded-md font-medium hover:bg-accent transition-colors"
              >
                <Mail className="h-5 w-5" />
                Email Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
