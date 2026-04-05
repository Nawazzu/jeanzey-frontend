import React, { Suspense } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

// Above-fold components — loaded immediately
import HeroSplit from '../components/HeroSplit'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import MumbaiNoticeBar from '../components/MumbaiNoticeBar'
import AnimatedBanner from '../components/AnimatedBanner'
import WhatsAppButton from '../components/WhatsAppButton'
// PERFORMANCE: VideoGallery moved out of lazy loading — it has autoPlay videos that
// remount on every Suspense retry, causing 16.mp4 to download 6x repeatedly
// Eager loading prevents the remount cycle
// import VideoGallery from '../components/VideoGallery'

// Below-fold components — lazy loaded to reduce initial render
const HoverTextCard = React.lazy(() => import('../components/HoverTextCard '))
const FadeCarouselWithCaptions = React.lazy(() => import('../components/FadeCarouselWithCaptions'))
const Complimentary = React.lazy(() => import('../components/Complimentary'))
const PremiumTimeline = React.lazy(() => import('../components/PremiumTimeline'))
const DenimSplit = React.lazy(() => import('../components/DenimSplit'))
const BestSeller = React.lazy(() => import('../components/BestSeller'))
const Testimonials = React.lazy(() => import('../components/Testimonials'))
const CategoryCarousel = React.lazy(()=> import('../components/CategoryCarousel'))


// Unused imports kept as comments to preserve original structure
// import OurPolicy from '../components/OurPolicy'
// import HeroReversed from '../components/HeroReversed'
// import PhotoGallery from '../components/PhotoGallery'
// import HeroVideo from '../components/HeroVideo'

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Jean-Zey | Premium Fashion for Men & Women in Mumbai</title>
        <meta name="description" content="Jean-Zey is Mumbai's premium fashion brand. Shop men's and women's jeans, shirts, t-shirts and combos. Free delivery across Mumbai with open box delivery." />
        <meta name="keywords" content="Jean-Zey, jeanzey, premium fashion Mumbai, jeans Mumbai, shirts Mumbai, buy clothes online India, luxury fashion brand Mumbai" />
        <meta name="robots" content="index, follow" />
        {/* Canonical removed — already set in index.html to avoid duplicate canonical tags */}

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

      {/* H1 lives in HeroSplit.jsx — removed from here to avoid duplicate H1 tags */}

      {/* Above-fold — loads immediately */}
      <HeroSplit/>
      {/* <HeroVideo/> */}
      <Hero />

      <section aria-label="Latest Collection">
        <h2 className="sr-only">Latest Collection</h2>
        <LatestCollection/>
      </section>

      <CategoryCarousel />

      <MumbaiNoticeBar/>
      <AnimatedBanner/>

      {/* Below-fold — lazy loaded */}
      <Suspense fallback={null}>

        <HoverTextCard/>
        <FadeCarouselWithCaptions/>

        {/* <HeroReversed/> */}

        <section aria-label="Our Services">
          <h2 className="sr-only">Our Services</h2>
          <Complimentary/>
        </section>

        <PremiumTimeline/>

      </Suspense>

      {/* VideoGallery outside Suspense — prevents autoPlay videos from remounting repeatedly */}
      {/* <section aria-label="Video Gallery">
        <h2 className="sr-only">Video Gallery</h2>
        <VideoGallery/>
      </section> */}

      <Suspense fallback={null}>

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

      </Suspense>

      <WhatsAppButton/>
    </div>
  )
}

export default Home