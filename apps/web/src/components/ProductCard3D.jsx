import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

const ProductCard3D = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const displayVariant = product.variants[0];
  const hasSale = displayVariant && displayVariant.sale_price_in_cents !== null;
  const displayPrice = hasSale ? displayVariant.sale_price_formatted : displayVariant.price_formatted;
  const originalPrice = hasSale ? displayVariant.price_formatted : null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addToCart(product, displayVariant, 1, displayVariant.inventory_quantity);
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="h-full"
    >
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className="card-3d soft-reflection h-full flex flex-col overflow-hidden group">
          <div className="relative overflow-hidden">
            <img
              src={product.image || placeholderImage}
              alt={product.title}
              className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {product.ribbon_text && (
              <div className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-3d-md">
                {product.ribbon_text}
              </div>
            )}
          </div>
          
          <div className="p-5 flex flex-col flex-grow">
            <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors" style={{letterSpacing: '-0.01em'}}>
              {product.title}
            </h3>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
              {product.subtitle || 'Premium digital product'}
            </p>
            
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold text-primary">
                {displayPrice}
              </span>
              {hasSale && (
                <span className="text-sm text-muted-foreground line-through">
                  {originalPrice}
                </span>
              )}
            </div>
            
            <Button 
              onClick={handleAddToCart}
              className="w-full mt-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-3d-sm hover:shadow-3d-md transition-all active:scale-[0.98]"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to cart
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard3D;