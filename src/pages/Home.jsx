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
        <title>Jeanzey – Luxury Fashion Store Mumbai | Shop Online</title>
        <meta name="description" content="Welcome to Jeanzey – Mumbai's premium luxury fashion destination. Shop trendy men's and women's shirts, jeans, t-shirts and combo outfits. Free delivery across India." />
        <link rel="canonical" href="https://yourdomain.com/" />
      </Helmet>
    
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