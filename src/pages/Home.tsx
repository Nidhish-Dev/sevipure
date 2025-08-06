import { ArrowRight, Leaf, Truck, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/Product/ProductCard";
import heroBg from "@/assets/hero-bg.jpg";
import mustardOil from "@/assets/mustard-oil.jpg";
import coconutOil from "@/assets/coconut-oil.jpg";
import groundnutOil from "@/assets/groundnut-oil.jpg";

const Home = () => {
  const featuredProducts = [
    {
      id: "1",
      name: "Premium Cold-Pressed Mustard Oil",
      price: 299,
      originalPrice: 399,
      image: mustardOil,
      rating: 4.8,
      reviews: 128,
      category: "Cold-Pressed Oils",
      isOrganic: true,
      discount: 25,
    },
    {
      id: "2",
      name: "Pure Virgin Coconut Oil",
      price: 249,
      originalPrice: 299,
      image: coconutOil,
      rating: 4.9,
      reviews: 95,
      category: "Virgin Oils",
      isOrganic: true,
      discount: 17,
    },
    {
      id: "3",
      name: "Fresh Groundnut Oil",
      price: 189,
      image: groundnutOil,
      rating: 4.7,
      reviews: 73,
      category: "Cooking Oils",
      isOrganic: true,
    },
  ];

  const categories = [
    { name: "Cold-Pressed Oils", count: 12, icon: "🥥" },
    { name: "Cooking Oils", count: 8, icon: "🌻" },
    { name: "Organic Spices", count: 24, icon: "🌶️" },
    { name: "Farm Fresh Honey", count: 6, icon: "🍯" },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      rating: 5,
      comment: "The quality of SeviPure's mustard oil is exceptional. You can taste the freshness!",
      location: "Mumbai",
    },
    {
      name: "Rajesh Kumar",
      rating: 5,
      comment: "Finally found a brand that delivers truly organic products. Highly recommended!",
      location: "Delhi",
    },
    {
      name: "Anita Patel",
      rating: 5,
      comment: "Their coconut oil is pure and natural. My family loves the authentic taste.",
      location: "Bangalore",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[600px] bg-cover bg-center bg-no-repeat flex items-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-3xl animate-fade-in">
            <Badge variant="secondary" className="mb-4">
              🌱 100% Organic & Natural
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Pure From the Farm –
              <span className="block text-accent">Delivered to Your Door</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Experience the finest organic oils and farm-fresh products, 
              sourced directly from trusted farmers across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-slide-up">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Organic</h3>
              <p className="text-muted-foreground">
                Certified organic products sourced directly from sustainable farms
              </p>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Fresh products delivered to your doorstep within 24-48 hours
              </p>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-muted-foreground">
                Rigorous quality checks ensure you get only the best products
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of premium organic oils and farm-fresh products
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-xl text-muted-foreground">
              Explore our wide range of organic products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-natural transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {category.count} products
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-muted-foreground">
              Trusted by thousands of families across India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.comment}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Updated with SeviPure
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Get the latest updates on new products, special offers, and organic living tips
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-foreground"
            />
            <Button variant="secondary" size="lg">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;