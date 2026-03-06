import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import MumbaiNoticeBar from "./components/MumbaiNoticeBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify";
import Privacy from "./pages/Privacy";
import TermsAndConditions from "./pages/TermsAndConditions";
import PolicyPage from "./pages/PolicyPage";
import SizeGuide from "./pages/SizeGuide";
import FoundersVision from "./pages/FoundersVision";
import ComingSoon from "./pages/ComingSoon";
import OurGifts from "./pages/OurGifts";
import ShippingReturnsPage from "./components/ShippingReturnsPage";
import Wishlist from "./pages/Wishlist";
import LimitedEdition from "./pages/LimitedEdition";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer />

      {/* Navbar */}
      <Navbar />

 

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <SearchBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/PolicyPage" element={<PolicyPage />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/founders-vision" element={<FoundersVision />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/our-gifts" element={<OurGifts />} />
          <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
           <Route path="/limited-editions" element={<LimitedEdition />} />
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
