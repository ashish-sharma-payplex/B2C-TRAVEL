import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import FlightsPage from "../pages/flights/index";
import HotelsPage from "../pages/hotels/Index";
import HotelsResultsPage from "../pages/hotels/Result";
import HotelDetailsPageWrapper from "../pages/hotels/HotelDetailsPageWrapper";
import BusesPage from "../pages/buses/index";
import TrainsPage from "../pages/trains/index";
import HotelCheckoutPage from "./components/hotel/HotelCheckoutPage";
import BookingSuccessPage from "./components/hotel/BookingSuccessPage";
import BusResultsPage from "../pages/buses/Results";
import BusPassengerPage from "../pages/buses/busPassangerPage";
import FlightsListingPage from "./components/flights/FlightsListingPage";
import BookFlight from "./components/flights/BookFlight";


function ScrollHandler({ setScrolled }) {
  const location = useLocation();

  useEffect(() => {
    setScrolled(false);
    window.scrollTo(0, 0);

    // Dynamic Page Title
    const titles = {
      "/hotels": "Hotels - Dealplex",
      "/flights": "Flights - Dealplex",
      "/buses": "Buses - Dealplex",
      "/trains": "Trains - Dealplex",
      "/hotels/results": "Hotel Results - Dealplex",
      "/hotels/checkout": "Hotel Checkout - Dealplex",
      "/hotels/payment": "Booking Success - Dealplex",
    };

    // details page ke liye alag handle
    if (location.pathname.startsWith("/hotels/details")) {
      document.title = "Hotel Details - Dealplex";
    } else {
      document.title = titles[location.pathname] || "Dealplex";
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
}

function NavbarWrapper({ scrolled }) {
  const location = useLocation();
  const hideNavbar = ["/hotels/results", "/hotels/details"].some((p) =>
    location.pathname.startsWith(p),
  );
  if (hideNavbar) return null;
  return <Navbar scrolled={scrolled} />;
}

function App() {
  const [scrolled, setScrolled] = useState(false);

  return (
    <BrowserRouter>
      <ScrollHandler setScrolled={setScrolled} />

      {/* GLOBAL CENTER WRAPPER (NAVBAR + PAGES BOTH) */}
      <div
        style={{
          maxWidth: "1330px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* NAVBAR INSIDE SAME CONTAINER */}
        <NavbarWrapper scrolled={scrolled} />

        <Routes>
          <Route path="/" element={<Navigate to="/hotels" replace />} />
          <Route path="/hotels" element={<HotelsPage scrolled={scrolled} />} />
          <Route
            path="/hotels/results"
            element={<HotelsResultsPage scrolled={scrolled} />}
          />
          <Route
            path="/hotels/details/:hotelCode"
            element={<HotelDetailsPageWrapper scrolled={scrolled} />}
          />
          <Route path="/hotels/checkout" element={<HotelCheckoutPage />} />
          <Route path="/hotels/payment" element={<BookingSuccessPage />} />
          <Route path="/flights" element={<FlightsPage />} />
          <Route path="/flights/listing" element={<FlightsListingPage />} />
          <Route path="/buses" element={<BusesPage />} />
          <Route path="/buses/results" element={<BusResultsPage />} /> 
          <Route path="/buses/passenger-details" element={<BusPassengerPage />} /> 
          <Route path="/trains" element={<TrainsPage />} />
          <Route path="/book-flight" element={<BookFlight />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
