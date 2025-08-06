import { useState } from "react";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Droplets, Sun, Wheat, FlowerIcon, Sprout } from "lucide-react";

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    {
      id: "cold-pressed",
      name: "Cold-Pressed Oils",
      description: "Pure, unrefined oils extracted using traditional methods",
      icon: Droplets,
      color: "bg-blue-50 border-blue-200",
      count: 12,
      products: ["Mustard Oil", "Coconut Oil", "Sesame Oil", "Groundnut Oil"]
    },
    {
      id: "cooking-oils",
      name: "Cooking Oils",
      description: "Premium quality oils perfect for everyday cooking",
      icon: Sun,
      color: "bg-orange-50 border-orange-200",
      count: 8,
      products: ["Sunflower Oil", "Rice Bran Oil", "Safflower Oil", "Corn Oil"]
    },
    {
      id: "organic-spices",
      name: "Organic Spices",
      description: "Farm-fresh spices and seasonings",
      icon: Leaf,
      color: "bg-green-50 border-green-200",
      count: 15,
      products: ["Turmeric", "Cumin", "Coriander", "Red Chili"]
    },
    {
      id: "grains-cereals",
      name: "Grains & Cereals",
      description: "Wholesome grains directly from our farms",
      icon: Wheat,
      color: "bg-amber-50 border-amber-200",
      count: 10,
      products: ["Brown Rice", "Quinoa", "Millets", "Oats"]
    },
    {
      id: "honey-sweeteners",
      name: "Honey & Natural Sweeteners",
      description: "Pure honey and natural sweetening alternatives",
      icon: FlowerIcon,
      color: "bg-yellow-50 border-yellow-200",
      count: 6,
      products: ["Raw Honey", "Jaggery", "Dates", "Maple Syrup"]
    },
    {
      id: "herbal-teas",
      name: "Herbal Teas",
      description: "Aromatic and healthy herbal tea blends",
      icon: Sprout,
      color: "bg-emerald-50 border-emerald-200",
      count: 9,
      products: ["Green Tea", "Chamomile", "Tulsi", "Ginger Tea"]
    }
  ];

  const filteredCategories = selectedCategory === "all" 
    ? categories 
    : categories.filter(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Explore Our Categories
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto">
            Discover our carefully curated selection of organic, farm-fresh products
          </p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="py-8 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className="transition-all duration-300"
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="transition-all duration-300"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card 
                  key={category.id} 
                  className={`${category.color} hover:shadow-natural transition-all duration-300 hover:scale-105 animate-fade-in group cursor-pointer`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <IconComponent className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300" />
                      <Badge variant="secondary" className="text-sm">
                        {category.count} Products
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-foreground">Popular Products:</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.products.slice(0, 3).map((product) => (
                          <Badge key={product} variant="outline" className="text-xs">
                            {product}
                          </Badge>
                        ))}
                        {category.products.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{category.products.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button className="w-full mt-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      Explore Category
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Categories;