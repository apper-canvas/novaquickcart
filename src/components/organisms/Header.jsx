import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ cartItemCount = 0, onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  const navItems = [
    { path: "/", label: "Home", icon: "Home" },
    { path: "/orders", label: "Orders", icon: "Package" }
  ];

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-md bg-white/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
              Q
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                QuickCart
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Fast & Easy Shopping</p>
            </div>
          </div>

          {/* Desktop Search */}
          {onSearch && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <SearchBar onSearch={onSearch} />
            </div>
          )}

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

            {/* Cart Button */}
            <Button
              variant={location.pathname === "/cart" ? "primary" : "ghost"}
              onClick={() => navigate("/cart")}
              size="sm"
              className="relative hidden md:flex"
            >
              <ApperIcon name="ShoppingCart" size={16} className="mr-2" />
              Cart
              {cartItemCount > 0 && (
                <Badge 
                  variant="accent" 
                  className="absolute -top-2 -right-2 min-w-[18px] h-5 flex items-center justify-center text-xs font-bold"
                >
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </Badge>
              )}
            </Button>

            {/* User Menu & Logout */}
            {user && (
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-gray-600">Hello, {user.firstName || user.name || 'User'}!</span>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  size="sm"
                  className="text-gray-600 hover:text-error"
                >
                  <ApperIcon name="LogOut" size={16} className="mr-1" />
                  Logout
                </Button>
              </div>
            )}
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
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex flex-col items-center p-3 text-gray-600"
          >
            <ApperIcon name="LogOut" size={20} />
            <span className="text-xs mt-1">Logout</span>
          </Button>
        </div>
      </nav>
    </header>
);
};

export default Header;