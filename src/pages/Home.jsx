import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import HeroReversed from '../components/HeroReversed'
import FadeCarouselWithCaptions from '../components/FadeCarouselWithCaptions'
import PhotoGallery from '../components/PhotoGallery'
import VideoGallery from '../components/VideoGallery'
import DenimSplit from '../components/DenimSplit'
import Testimonials from '../components/Testimonials'
import HeroVideo from '../components/HeroVideo'
import WhatsAppButton from '../components/WhatsAppButton'
import HeroSplit from '../components/HeroSplit'
import HoverTextCard from '../components/HoverTextCard '
import PremiumTimeline from '../components/PremiumTimeline'
import Complimentary from '../components/Complimentary'
import AnimatedBanner from '../components/AnimatedBanner'
import MumbaiNoticeBar from '../components/MumbaiNoticeBar'

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Jean-Zey | Premium Fashion for Men & Women in Mumbai</title>
        <meta name="description" content="Jean-Zey is Mumbai's premium fashion brand. Shop men's and women's jeans, shirts, t-shirts and combos. Free delivery across Mumbai with open box delivery." />
        <meta name="keywords" content="Jean-Zey, jeanzey, premium fashion Mumbai, jeans Mumbai, shirts Mumbai, buy clothes online India, luxury fashion brand Mumbai" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://jeanzey.com/" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jeanzey.com/" />
        <meta property="og:title" content="Jean-Zey | Premium Fashion in Mumbai" />
        <meta property="og:description" content="Premium jeans, shirts and t-shirts delivered across Mumbai. Free shipping on every order." />
        <meta property="og:image" content="https://jeanzey.com/og-image.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Jean-Zey | Premium Fashion in Mumbai" />
        <meta name="twitter:description" content="Premium jeans, shirts and t-shirts delivered across Mumbai." />
        <meta name="twitter:image" content="https://jeanzey.com/og-image.jpg" />
      </Helmet>

      {/* H1 — visible to Google, hidden from UI */}
      <h1 className="sr-only">
        Jeanzey — Premium Fashion Store Mumbai | Men's &amp; Women's Jeans, Shirts &amp; T-Shirts
      </h1>

      <HeroSplit/>
      {/* <HeroVideo/> */}
      <Hero />

      <section aria-label="Latest Collection">
        <h2 className="sr-only">Latest Collection</h2>
        <LatestCollection/>
      </section>

        <MumbaiNoticeBar/>
      <HoverTextCard/>
      <FadeCarouselWithCaptions/>
      {/* <HeroReversed/> */}
      <AnimatedBanner/>

      <section aria-label="Our Services">
        <h2 className="sr-only">Our Services</h2>
        <Complimentary/>
      </section>

      <PremiumTimeline/>

      <section aria-label="Video Gallery">
        <h2 className="sr-only">Video Gallery</h2>
        <VideoGallery/>
      </section>

       {/* <PhotoGallery/> */}
       <DenimSplit/>

      <section aria-label="Best Sellers">
        <h2 className="sr-only">Best Sellers</h2>
        <BestSeller/>
      </section>

      <AnimatedBanner/>
      {/* <OurPolicy/> */}

      <section aria-label="Customer Testimonials">
        <h2 className="sr-only">Customer Testimonials</h2>
        <Testimonials/>
      </section>

  

      {/* Internal links for SEO */}
      <nav aria-label="Shop categories" style={{ display: 'none' }}>
        <Link to="/collection">Shop All</Link>
        <Link to="/collection">Men's Collection</Link>
        <Link to="/collection">Women's Collection</Link>
        <Link to="/about">About Jeanzey</Link>
        <Link to="/contact">Contact Us</Link>
        <Link to="/limited-editions">Limited Editions</Link>
      </nav>

      <WhatsAppButton/>
    </div>
  )
}

export default Home