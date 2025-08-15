import { useState } from "react";
import { Filter, Grid3x3, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import ProductCard from "@/components/Product/ProductCard";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import mustardOil from "@/assets/mustard-oil.jpg";
import coconutOil from "@/assets/coconut-oil.jpg";
import groundnutOil from "@/assets/groundnut-oil.jpg";

const Products = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const products = [
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
    // Duplicate products to show more
    {
      id: "4",
      name: "Organic Sesame Oil",
      price: 349,
      originalPrice: 399,
      image: mustardOil,
      rating: 4.6,
      reviews: 84,
      category: "Cold-Pressed Oils",
      isOrganic: true,
      discount: 13,
    },
    {
      id: "5",
      name: "Pure Sunflower Oil",
      price: 199,
      image: coconutOil,
      rating: 4.5,
      reviews: 112,
      category: "Cooking Oils",
      isOrganic: true,
    },
    {
      id: "6",
      name: "Cold-Pressed Olive Oil",
      price: 599,
      originalPrice: 699,
      image: groundnutOil,
      rating: 4.9,
      reviews: 67,
      category: "Premium Oils",
      isOrganic: true,
      discount: 14,
    },
  ];

  const categories = [
    "Cold-Pressed Oils",
    "Cooking Oils",
    "Virgin Oils",
    "Premium Oils",
    "Organic Spices",
    "Farm Fresh Honey",
  ];

  const priceRanges = [
    "Under ₹200",
    "₹200 - ₹400",
    "₹400 - ₹600",
    "Above ₹600",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shop All Products</h1>
          <p className="text-muted-foreground">Discover our complete range of organic products</p>
        </div>

        {/* Search and Filters Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <Select>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Customer Rating</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 space-y-6`}>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Categories</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox id={category} />
                      <label
                        htmlFor={category}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Price Range</h3>
                <div className="space-y-3">
                  {priceRanges.map((range) => (
                    <div key={range} className="flex items-center space-x-2">
                      <Checkbox id={range} />
                      <label
                        htmlFor={range}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {range}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="organic" />
                    <label htmlFor="organic" className="text-sm font-medium">
                      Organic Certified
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cold-pressed" />
                    <label htmlFor="cold-pressed" className="text-sm font-medium">
                      Cold-Pressed
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="on-sale" />
                    <label htmlFor="on-sale" className="text-sm font-medium">
                      On Sale
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <span className="text-muted-foreground">
                Showing {products.length} products
              </span>
            </div>

            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex gap-2">
                <Button variant="outline" disabled>
                  Previous
                </Button>
                <Button variant="default">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Products;