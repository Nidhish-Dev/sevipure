import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground animate-pulse">
          Work in Progress...
        </h1>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;