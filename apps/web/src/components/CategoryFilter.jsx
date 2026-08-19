import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CATEGORY_TREE } from '@/data/categories';

const CategoryFilter = ({
  selectedCategory,
  selectedSubcategory,
  onCategoryChange,
  onSubcategoryChange,
}) => {
  const activeParent = CATEGORY_TREE.find((c) => c.name === selectedCategory);

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={() => onCategoryChange('All Products')}
            variant={selectedCategory === 'All Products' ? 'default' : 'outline'}
            className={`transition-all duration-300 ${
              selectedCategory === 'All Products'
                ? 'bg-primary text-primary-foreground shadow-3d-md'
                : 'bg-card text-card-foreground hover:bg-muted border-border shadow-3d-sm hover:shadow-3d-md'
            }`}
          >
            All Products
          </Button>
        </motion.div>

        {CATEGORY_TREE.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
          >
            <Button
              onClick={() => onCategoryChange(category.name)}
              variant={selectedCategory === category.name ? 'default' : 'outline'}
              className={`transition-all duration-300 ${
                selectedCategory === category.name
                  ? 'bg-primary text-primary-foreground shadow-3d-md'
                  : 'bg-card text-card-foreground hover:bg-muted border-border shadow-3d-sm hover:shadow-3d-md'
              }`}
            >
              <span className="mr-1.5">{category.icon}</span>
              {category.name}
            </Button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeParent?.children?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">
                {activeParent.name} subcategories
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => onSubcategoryChange(null)}
                  variant={!selectedSubcategory ? 'default' : 'outline'}
                  size="sm"
                  className={`rounded-full ${
                    !selectedSubcategory
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-card text-card-foreground hover:bg-muted'
                  }`}
                >
                  All {activeParent.name}
                </Button>
                {activeParent.children.map((child) => (
                  <Button
                    key={child}
                    onClick={() => onSubcategoryChange(child)}
                    variant={selectedSubcategory === child ? 'default' : 'outline'}
                    size="sm"
                    className={`rounded-full ${
                      selectedSubcategory === child
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-card text-card-foreground hover:bg-muted'
                    }`}
                  >
                    {child}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryFilter;
