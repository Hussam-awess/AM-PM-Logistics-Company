import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Target, Eye } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-blue-700 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">About AM-PM Company Ltd</h1>
            <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
              A decade of excellence in logistics and transportation services
            </p>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2013, AM-PM Company Ltd has grown from a small transportation service to become one of the
                  most trusted logistics providers in East Africa. Our journey began with a simple vision: to provide
                  reliable, professional, and efficient cargo transportation services that businesses can depend on.
                </p>
                <p>
                  Over the past decade, we have expanded our operations across Tanzania and into the Democratic Republic
                  of Congo, establishing a strong network that connects major commercial hubs and industrial centers.
                  Our commitment to excellence has earned us the trust of countless businesses, from small enterprises
                  to large corporations.
                </p>
                <p>
                  Today, AM-PM Company Ltd operates a modern fleet of trucks and containers, employs experienced
                  professionals, and maintains strategic offices in Dar es Salaam and DR Congo. We continue to invest in
                  our infrastructure, technology, and people to deliver superior logistics solutions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Company Photo Gallery */}
        <section className="py-16 md:py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Operations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-200">
                {/* <div className="C:\Users\HP\Desktop\logistics-website-build\public\pic 4.JPG"></div> */}
                <Image
                  src="/modern-logistics-trucks-on-african-highway.jpg"
                  alt="AM-PM Company fleet of trucks"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-200">
                <Image
                  src="/cargo-containers-being-loaded-at-port.jpg"
                  alt="Container loading operations"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-200">
                <Image
                  src="/professional-logistics-warehouse-operations.jpg"
                  alt="Warehouse and logistics center"
                  fill
                  className="object-cover"
                />
              {/* <Image
                  src="C:\Users\HP\Desktop\logistics-website-build\public\pic 4.JPG"
                  alt="Company team coordinating logistics"
                  fill
                  className="object-cover"
                />   */}
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6">
              The above images are our company's operations and fleet
            </p>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To provide exceptional logistics and transportation services that enable businesses to thrive,
                    delivering cargo safely, on time, and with complete reliability.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To be the leading logistics provider in East Africa, recognized for our innovation, reliability, and
                    commitment to customer success across the region.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Our Values</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Reliability and punctuality in every delivery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Safety and security of cargo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Customer-focused service</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Professional excellence</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Locations */}
        <section className="py-16 md:py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Locations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">Dar es Salaam, Tanzania</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Our headquarters in Dar es Salaam serves as the main hub for operations across Tanzania and the
                    broader East African region.
                  </p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Dar es Salaam</p>
                    <p>Tanzania</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">DR Congo</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Our Congo office enables seamless cross-border logistics and serves clients throughout the
                    Democratic Republic of Congo.
                  </p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>DR Congo</p>
                    <p>Democratic Republic of Congo</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
