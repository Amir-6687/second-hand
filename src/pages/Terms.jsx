import React from "react";
import SEOHead from "../components/SEOHead";

const Terms = () => {
  return (
    <>
      <SEOHead
        title="Terms and Conditions - The Grrrls Club"
        description="Terms and Conditions for The Grrrls Club online store"
        keywords="terms, conditions, AGB, legal, shop, online store"
      />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Terms and Conditions (AGB)
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. General Information</h2>
                <p className="text-gray-600 leading-relaxed">
                  These Terms and Conditions ("Terms") govern your use of The Grrrls Club website 
                  and services. By accessing or using our website, you agree to be bound by these Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Company Information</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">
                    <strong>The Grrrls Club</strong><br />
                    Online Fashion Store<br />
                    Email: info@thegrrrlsclub.de<br />
                    Website: www.thegrrrlsclub.de
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Products and Services</h2>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>We offer fashion items, accessories, and related products</li>
                  <li>Product descriptions and images are for informational purposes</li>
                  <li>We reserve the right to modify or discontinue products at any time</li>
                  <li>Prices are subject to change without notice</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Orders and Payment</h2>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>All orders are subject to acceptance and availability</li>
                  <li>We accept various payment methods including credit cards and PayPal</li>
                  <li>Payment is due at the time of order placement</li>
                  <li>We reserve the right to refuse or cancel any order</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Shipping and Delivery</h2>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Shipping costs are calculated at checkout</li>
                  <li>Delivery times are estimates and may vary</li>
                  <li>We are not responsible for delays caused by shipping carriers</li>
                  <li>Risk of loss transfers to you upon delivery</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Returns and Refunds</h2>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Returns must be initiated within 14 days of delivery</li>
                  <li>Items must be in original condition with tags attached</li>
                  <li>Refunds will be processed within 5-7 business days</li>
                  <li>Return shipping costs are the customer's responsibility</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Privacy and Data Protection</h2>
                <p className="text-gray-600 leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy to understand 
                  how we collect, use, and protect your personal information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Intellectual Property</h2>
                <p className="text-gray-600 leading-relaxed">
                  All content on this website, including text, images, logos, and designs, 
                  is the property of The Grrrls Club and is protected by copyright laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Limitation of Liability</h2>
                <p className="text-gray-600 leading-relaxed">
                  The Grrrls Club shall not be liable for any indirect, incidental, special, 
                  or consequential damages arising from your use of our website or products.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Governing Law</h2>
                <p className="text-gray-600 leading-relaxed">
                  These Terms are governed by the laws of Germany. Any disputes will be 
                  resolved in the courts of Germany.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Changes to Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to modify these Terms at any time. Changes will be 
                  effective immediately upon posting on our website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Contact Information</h2>
                <div className="bg-pink-50 p-4 rounded-lg">
                  <p className="text-gray-600">
                    If you have any questions about these Terms, please contact us:
                  </p>
                  <p className="text-gray-600 mt-2">
                    Email: info@thegrrrlsclub.de<br />
                    Website: www.thegrrrlsclub.de
                  </p>
                </div>
              </section>

              <div className="border-t pt-6 mt-8">
                <p className="text-sm text-gray-500 text-center">
                  Last updated: {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;
