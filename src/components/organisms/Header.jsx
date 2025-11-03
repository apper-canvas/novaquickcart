import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ cartItemCount = 0, onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/", icon: "Home" },
    { label: "Orders", path: "/orders", icon: "Package" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="ShoppingBag" size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              QuickCart
            </h1>
          </div>

          {/* Search Bar - Hidden on mobile, shown on larger screens */}
          {onSearch && (
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <SearchBar onSearch={onSearch} />
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? "primary" : "ghost"}
                  onClick={() => navigate(item.path)}
                  size="sm"
                >
                  <ApperIcon name={item.icon} size={16} className="mr-2" />
                  {item.label}
                </Button>
              ))}
            </nav>

            {/* Cart Icon */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => navigate("/cart")}
                className="relative p-2"
              >
                <ApperIcon name="ShoppingCart" size={20} />
                {cartItemCount > 0 && (
                  <Badge 
                    variant="accent" 
                    className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center text-xs font-bold animate-pulse"
                  >
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {onSearch && (
          <div className="md:hidden pb-4">
            <SearchBar onSearch={onSearch} />
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center p-3 ${
                location.pathname === item.path ? "text-primary" : "text-gray-600"
              }`}
            >
              <ApperIcon name={item.icon} size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          ))}
          <Button
            variant="ghost"
            onClick={() => navigate("/cart")}
            className={`flex flex-col items-center p-3 relative ${
              location.pathname === "/cart" ? "text-primary" : "text-gray-600"
            }`}
          >
            <ApperIcon name="ShoppingCart" size={20} />
            <span className="text-xs mt-1">Cart</span>
            {cartItemCount > 0 && (
              <Badge 
                variant="accent" 
                className="absolute -top-1 -right-1 min-w-[16px] h-4 flex items-center justify-center text-xs font-bold"
              >
                {cartItemCount > 9 ? "9+" : cartItemCount}
              </Badge>
            )}
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;