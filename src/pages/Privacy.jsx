import React from 'react'
import WhatsAppButton from '../components/WhatsAppButton'

const Privacy = () => {
  return (
    <>
    <div className="max-w-5xl mx-auto px-10 py-16 text-gray-700 leading-relaxed border border-gray-500 rounded-lg mt-8 mb-8">
      <h1 className="text-4xl font-semibold mb-8 text-center text-black">Privacy Policy</h1>
      
      <section className="mb-10">
        <h2 className="text-2xl font-medium mb-4">1. Introduction</h2>
        <p>
          At ForeverYou, your privacy is important to us. This Privacy Policy explains how we collect, use,
          and protect your personal data when you visit our website or make a purchase from us.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-medium mb-4">2. What We Collect</h2>
        <p>We may collect the following types of personal information:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>Name, email address, phone number</li>
          <li>Billing and shipping addresses</li>
          <li>Payment information (processed securely via third-party gateways)</li>
          <li>Browser data, location, and cookies</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-medium mb-4">3. How We Use Your Information</h2>
        <p>Your data helps us to:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>Fulfill orders and deliver products</li>
          <li>Provide customer support</li>
          <li>Send promotional emails (only if you opt-in)</li>
          <li>Improve our site experience</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-medium mb-4">4. Data Protection</h2>
        <p>
          We implement industry-standard security measures including encryption, firewalls, and SSL technology to ensure your data remains safe and confidential.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-medium mb-4">5. Third-Party Services</h2>
        <p>
          We may use third-party services such as Google Analytics or payment gateways, which may collect certain anonymous data for performance and tracking.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-medium mb-4">6. Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal data at any time. Contact us at <a href="mailto:privacy@foreveryou.com" className="text-black underline">privacy@foreveryou.com</a> for data-related requests.
        </p>
      </section>

      <p className="mt-10 text-center text-gray-500">Last updated: April 29, 2025</p>
    </div>
    <WhatsAppButton/>
    </>
  )
}

export default Privacy
