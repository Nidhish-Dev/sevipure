import { useState } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  isOrganic?: boolean;
  discount?: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // TODO: Replace with backend API integration
  // - POST /api/wishlist/add - add product to user's wishlist
  // - DELETE /api/wishlist/remove - remove from wishlist
  // - GET /api/wishlist - fetch user's wishlist items
  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Backend API call would go here
    console.log(isWishlisted ? "Removed from wishlist:" : "Added to wishlist:", product.name);
  };

  // TODO: Replace with backend API integration
  // - POST /api/cart/add - add product to user's cart
  // - PUT /api/cart/update - update quantity
  // - GET /api/cart - fetch cart items
  const handleAddToCart = () => {
    // Backend API call would go here
    console.log("Added to cart:", product.name);
  };

  return (
    <Card className="group hover:shadow-natural transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {product.isOrganic && (
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              Organic
            </Badge>
          )}
          {product.discount && (
            <Badge variant="destructive">
              {product.discount}% OFF
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 text-white hover:text-red-500 bg-black/20 hover:bg-white/90"
          onClick={handleWishlist}
        >
          <Heart
            className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
          />
        </Button>

        {/* Quick Add to Cart */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            onClick={handleAddToCart}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <span className="text-sm text-muted-foreground">{product.category}</span>
        </div>
        
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground ml-1">
            ({product.reviews})
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-primary">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;