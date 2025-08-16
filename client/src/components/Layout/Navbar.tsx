import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, LogOut, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  // Get display name (full name or first name if full name is not available)
  const getDisplayName = (): string => {
    if (user?.fullName) {
      return user.fullName;
    }
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.firstName || 'User';
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-primary">
              <img className="h-14 rounded-lg" src="/logo.jpeg" alt="" />
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for organic products..."
                className="pl-10 pr-4 w-full rounded-lg"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-foreground hover:text-primary transition-colors">
              Products
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            {isAuthenticated && (
              <Link to="/my-orders" className="text-foreground hover:text-primary transition-colors">
                My Orders
              </Link>
            )}
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{getDisplayName()}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-orders" className="flex items-center space-x-2">
                      <span>My Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
            )}
            
            <Button variant="ghost" size="sm" className="relative" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" onClick={() => setIsMenuOpen(false)} />
          <div className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-background z-50 transform transition-transform duration-300 ease-in-out">
            <div className="px-4 pt-6 pb-8 h-full flex flex-col space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-3 text-base rounded-lg"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-2">
                <Link
                  to="/"
                  className="block px-4 py-3 text-lg font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className="block px-4 py-3 text-lg font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  to="/contact"
                  className="block px-4 py-3 text-lg font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/my-orders"
                    className="block px-4 py-3 text-lg font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                )}
              </div>

              {/* Mobile Action Buttons */}
              <div className="flex flex-col space-y-3 pt-4 border-t border-border">
                {isAuthenticated && user ? (
                  <>
                    <Button variant="outline" size="lg" className="w-full text-lg" asChild>
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                        <Settings className="h-5 w-5 mr-2" />
                        Profile
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="w-full text-lg" asChild>
                      <Link to="/my-orders" onClick={() => setIsMenuOpen(false)}>
                        My Orders
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="w-full text-lg" onClick={handleLogout}>
                      <LogOut className="h-5 w-5 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="lg" className="w-full text-lg" asChild>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <User className="h-5 w-5 mr-2" />
                      Login
                    </Link>
                  </Button>
                )}
                
                <Button variant="outline" size="lg" className="w-full relative text-lg" asChild>
                  <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Cart
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-6 w-6 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;