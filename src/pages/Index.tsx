import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import Home from "./Home";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
};

export default Index;
