export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">About Us</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-primary">Company Overview</h2>
          <p className="text-muted-foreground leading-relaxed">
            Hi-Tech Pharmaceuticals Pvt. Ltd. is a leading wholesale pharmaceutical supplier and distributor committed
            to providing high-quality medicines to healthcare providers, pharmacies, and medical institutions. With
            years of experience in the pharmaceutical industry, we have established ourselves as a trusted partner for
            wholesale pharmaceutical needs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-primary">Our Mission & Vision</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide accessible, affordable, and high-quality pharmaceutical products to healthcare providers
                while maintaining the highest standards of service and reliability. We strive to be the preferred
                wholesale partner for medical professionals across the region.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To become the most trusted and innovative pharmaceutical wholesale distributor, known for our
                commitment to quality, ethical practices, and customer satisfaction. We envision a future where
                healthcare providers have seamless access to the medicines they need.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-primary">Our Commitment</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Quality Assurance</h3>
              <p className="text-muted-foreground leading-relaxed">
                We source all our pharmaceutical products from reputable manufacturers and ensure they meet stringent
                quality standards. Every product in our catalog undergoes rigorous quality checks before reaching our
                customers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Regulatory Compliance</h3>
              <p className="text-muted-foreground leading-relaxed">
                We strictly adhere to all pharmaceutical regulations and licensing requirements. Our operations are
                fully compliant with national and international pharmaceutical standards, ensuring safe and legal
                distribution of medicines.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Ethical Trade Practices</h3>
              <p className="text-muted-foreground leading-relaxed">
                We conduct our business with the highest ethical standards, maintaining transparency in pricing,
                honest communication with customers, and responsible distribution practices. We are committed to
                supporting the healthcare ecosystem through fair and ethical wholesale trade.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-muted/30 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Why Partner With Us?</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Extensive product range covering all major pharmaceutical categories</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Competitive wholesale pricing with attractive bonus schemes</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Reliable and timely order fulfillment</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Dedicated customer support for all your queries</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Secure and professional ordering system</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
