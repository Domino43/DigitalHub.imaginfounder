import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const categories = [
  'All Products',
  'Website Templates',
  'Children\'s Books',
  'Ebooks',
  'Gallery Apps',
  'Software Tools',
  'T-Shirt Designs',
  'UI Kits',
  'Fonts & Typography',
  'Stock Photos'
];

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3">
        {categories.map((category, index) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Button
              onClick={() => onCategoryChange(category)}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className={`transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground shadow-3d-md'
                  : 'bg-card text-card-foreground hover:bg-muted border-border shadow-3d-sm hover:shadow-3d-md'
              }`}
            >
              {category}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;