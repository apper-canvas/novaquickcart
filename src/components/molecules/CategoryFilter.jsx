import React from "react";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const CategoryFilter = ({ categories, selectedCategory, onCategorySelect }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Badge
        variant={selectedCategory === "all" ? "primary" : "outline"}
        className={cn(
          "cursor-pointer transition-all duration-200 hover:scale-105",
          selectedCategory === "all" && "shadow-lg"
        )}
        onClick={() => onCategorySelect("all")}
      >
        All Products
      </Badge>
      {categories.map((category) => (
        <Badge
          key={category}
          variant={selectedCategory === category ? "primary" : "outline"}
          className={cn(
            "cursor-pointer transition-all duration-200 hover:scale-105",
            selectedCategory === category && "shadow-lg"
          )}
          onClick={() => onCategorySelect(category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
};

export default CategoryFilter;