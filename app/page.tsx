import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer"; 
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Team from "../components/sections/Team";
import Categories from "../components/sections/Categories"; 
import NomineePortal from "../components/sections/NomineePortal"; // NEW IMPORT

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col w-full overflow-hidden">
      {/* Navigation Bar at the top */}
      <Navbar />
      
      {/* 1. Hero Section (with Countdown) */}
      <Hero />
      
      {/* 2. About Section */}
      <About />

      {/* 3. Team Section  */}
      <Team />

      {/* 4. Categories Section  */}
      <Categories />

      {/* 5. Nominee Portal Section  */}
      <NomineePortal />

      {/* 6. Footer  */}
      <Footer />
      
    </main>
  );
}