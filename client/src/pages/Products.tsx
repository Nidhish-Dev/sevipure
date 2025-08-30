import { useState, useEffect } from "react";
import { Grid3x3, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import ProductCard from "@/components/Product/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  _id: string;
  name: string;
  price: number;
  rating?: number;
  createdAt?: string;
  [key: string]: any;
}

const Products = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<string>("popularity");
  const [page, setPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    setLoading(true);
    fetch("https://sevipure-server.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => {
        const fetchedProducts = (data.products || []) as Product[];
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load products");
        setLoading(false);
      });
  }, []);

  // Handle search and sort
  useEffect(() => {
    let updatedProducts = [...products];

    // Filter by search query
    if (searchQuery.trim()) {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    switch (sortOption) {
      case "price-low":
        updatedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        updatedProducts.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        updatedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        updatedProducts.sort((a, b) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        break;
      default:
        // Popularity (default, no specific sorting logic, assume API returns popular first)
        break;
    }

    setFilteredProducts(updatedProducts);
    setPage(1); // Reset to first page on search or sort
  }, [searchQuery, sortOption, products]);

  const paginate = (data: Product[]) => {
    const start = (page - 1) * productsPerPage;
    return data.slice(start, start + productsPerPage);
  };

  // Animation variants for product cards
  const cardVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-green-50/50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Shop All Products
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our premium range of organic products
          </p>
        </motion.div>

        {/* Search and Sort Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-10 flex flex-col lg:flex-row gap-4 items-center justify-between"
        >
          <div className="relative w-full lg:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full bg-white border-gray-200 focus:ring-2 focus:ring-green-500 rounded-lg shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4 items-center">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-48 bg-white border-gray-200 focus:ring-2 focus:ring-green-500 rounded-lg shadow-sm">
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
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`rounded-lg ${viewMode === "grid" ? "bg-green-600 hover:bg-green-700 text-white" : "border-gray-200 text-gray-900 hover:bg-green-50"}`}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`rounded-lg ${viewMode === "list" ? "bg-green-600 hover:bg-green-700 text-white" : "border-gray-200 text-gray-900 hover:bg-green-50"}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Products Section */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-6 flex justify-between items-center"
          >
            <span className="text-gray-600 font-medium">
              Showing {filteredProducts.length} products
            </span>
          </motion.div>
          <div
            className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
          >
            <AnimatePresence>
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center text-gray-600 font-medium"
                >
                  Loading products...
                </motion.div>
              ) : error ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center text-red-500 font-medium"
                >
                  {error}
                </motion.div>
              ) : filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center text-gray-600 font-medium"
                >
                  No products found.
                </motion.div>
              ) : (
                paginate(filteredProducts).map((product) => (
                  <motion.div
                    key={product._id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
          {/* Pagination */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-12 flex justify-center"
          >
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="border-gray-200 text-gray-900 hover:bg-green-50 rounded-lg"
              >
                Previous
              </Button>
              {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => i + 1).map(
                (pageNum) => (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    onClick={() => setPage(pageNum)}
                    className={`${
                      page === pageNum ? "bg-green-600 hover:bg-green-700 text-white" : "border-gray-200 text-gray-900 hover:bg-green-50"
                    } rounded-lg`}
                  >
                    {pageNum}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page === Math.ceil(filteredProducts.length / productsPerPage)}
                className="border-gray-200 text-gray-900 hover:bg-green-50 rounded-lg"
              >
                Next
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;