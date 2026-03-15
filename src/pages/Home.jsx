import React from 'react'
import { Helmet } from 'react-helmet-async'
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
        <link rel="canonical" href="https://jeanzey-frontend.vercel.app/" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jeanzey-frontend.vercel.app/" />
        <meta property="og:title" content="Jean-Zey | Premium Fashion in Mumbai" />
        <meta property="og:description" content="Premium jeans, shirts and t-shirts delivered across Mumbai. Free shipping on every order." />
        <meta property="og:image" content="https://jeanzey-frontend.vercel.app/og-image.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Jean-Zey | Premium Fashion in Mumbai" />
        <meta name="twitter:description" content="Premium jeans, shirts and t-shirts delivered across Mumbai." />
        <meta name="twitter:image" content="https://jeanzey-frontend.vercel.app/og-image.jpg" />
      </Helmet>

      {/* Visually hidden H1 — read by Google, invisible to users */}
      <h1 style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0,0,0,0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}>
        Jean-Zey — Premium Fashion Store Mumbai | Men's & Women's Jeans, Shirts & T-Shirts
      </h1>

      <HeroSplit/>
      {/* <HeroVideo/> */}
      <Hero />
      <LatestCollection/>
        <MumbaiNoticeBar/>
      <HoverTextCard/>
      <FadeCarouselWithCaptions/>
      {/* <HeroReversed/> */}
      <AnimatedBanner/>
      <Complimentary/>
      <PremiumTimeline/>
      <VideoGallery/>
       {/* <PhotoGallery/> */}
       <DenimSplit/>
      <BestSeller/>
      <AnimatedBanner/>
      {/* <OurPolicy/> */}
      <Testimonials/>
      <WhatsAppButton/>
    </div>
  )
}

export default Home