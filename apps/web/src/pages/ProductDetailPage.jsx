import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProduct, getProductQuantities, getProducts } from '@/api/EcommerceApi';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Loader2, ArrowLeft, CheckCircle, Minus, Plus, XCircle, ChevronLeft, ChevronRight, Printer } from 'lucide-react';
import ProductCard3D from '@/components/ProductCard3D';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

function ProductDetailPage({ setIsCartOpen }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = useCallback(async () => {
    if (product && selectedVariant) {
      const availableQuantity = selectedVariant.inventory_quantity;
      try {
        await addToCart(product, selectedVariant, quantity, availableQuantity);
        toast({
          title: "Added to cart",
          description: `${quantity} x ${product.title} (${selectedVariant.title}) added.`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      }
    }
  }, [product, selectedVariant, quantity, addToCart, toast]);

  const handleQuantityChange = useCallback((amount) => {
    setQuantity(prevQuantity => {
      const newQuantity = prevQuantity + amount;
      if (newQuantity < 1) return 1;
      return newQuantity;
    });
  }, []);

  const handlePrevImage = useCallback(() => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1);
    }
  }, [product?.images?.length]);

  const handleNextImage = useCallback(() => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1);
    }
  }, [product?.images?.length]);

  const handleVariantSelect = useCallback((variant) => {
    setSelectedVariant(variant);

    if (variant.image_url && product?.images?.length > 0) {
      const imageIndex = product.images.findIndex(image => image.url === variant.image_url);

      if (imageIndex !== -1) {
        setCurrentImageIndex(imageIndex);
      }
    }
  }, [product?.images]);

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProduct = await getProduct(id);

        const quantitiesResponse = await getProductQuantities({
          fields: 'inventory_quantity',
          product_ids: [fetchedProduct.id]
        });

        const variantQuantityMap = new Map();
        quantitiesResponse.variants.forEach(variant => {
          variantQuantityMap.set(variant.id, variant.inventory_quantity);
        });

        const productWithQuantities = {
          ...fetchedProduct,
          variants: fetchedProduct.variants.map(variant => ({
            ...variant,
            inventory_quantity: variantQuantityMap.get(variant.id) ?? variant.inventory_quantity
          }))
        };

        setProduct(productWithQuantities);

        if (productWithQuantities.variants && productWithQuantities.variants.length > 0) {
          setSelectedVariant(productWithQuantities.variants[0]);
        }

        const relatedResponse = await getProducts({ limit: '6' });
        if (relatedResponse.products.length > 0) {
          const relatedIds = relatedResponse.products.map(p => p.id).filter(pid => pid !== id);
          const relatedQuantities = await getProductQuantities({
            fields: 'inventory_quantity',
            product_ids: relatedIds
          });

          const relatedQuantityMap = new Map();
          relatedQuantities.variants.forEach(variant => {
            relatedQuantityMap.set(variant.id, variant.inventory_quantity);
          });

          const relatedWithQuantities = relatedResponse.products
            .filter(p => p.id !== id)
            .slice(0, 4)
            .map(product => ({
              ...product,
              variants: product.variants.map(variant => ({
                ...variant,
                inventory_quantity: relatedQuantityMap.get(variant.id) ?? variant.inventory_quantity
              }))
            }));

          setRelatedProducts(relatedWithQuantities);
        }
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id, navigate]);

  if (loading) {
    return (
      <>
        <Header setIsCartOpen={setIsCartOpen} />
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-16 w-16 text-primary animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header setIsCartOpen={setIsCartOpen} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link to="/products" className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors mb-6 print:hidden">
            <ArrowLeft size={16} />
            Back to products
          </Link>
          <div className="text-center text-destructive p-8 card-3d">
            <XCircle className="mx-auto h-16 w-16 mb-4" />
            <p className="mb-6">Error loading product: {error}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const price = selectedVariant?.sale_price_formatted ?? selectedVariant?.price_formatted;
  const originalPrice = selectedVariant?.price_formatted;
  const availableStock = selectedVariant ? selectedVariant.inventory_quantity : 0;
  const isStockManaged = selectedVariant?.manage_inventory ?? false;
  const canAddToCart = !isStockManaged || quantity <= availableStock;

  const currentImage = product.images[currentImageIndex];
  const hasMultipleImages = product.images.length > 1;

  return (
    <>
      <Helmet>
        <title>{`${product.title} - DigitalHub`}</title>
        <meta name="description" content={product.description?.substring(0, 160) || product.title} />
      </Helmet>
      <Header setIsCartOpen={setIsCartOpen} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:block">
        
        {/* Print-only Header */}
        <div className="hidden print:block mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-black">{product.title}</h1>
          <p className="text-gray-600 mt-2">DigitalHub Product Details</p>
        </div>

        <div className="flex justify-between items-center mb-6 print:hidden">
          <Link to="/products" className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft size={16} />
            Back to products
          </Link>
          <Button onClick={handlePrint} variant="outline" className="shadow-3d-sm hover:shadow-3d-md transition-all">
            <Printer className="mr-2 h-4 w-4" />
            Print Details
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 mb-20 print:grid-cols-1 print:gap-8 print:mb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative print-break-inside-avoid"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-3d-xl h-96 md:h-[600px] card-3d print:shadow-none print:h-auto print:max-h-[400px] print:border print:border-gray-200">
              <img
                src={!currentImage?.url ? placeholderImage : currentImage.url}
                alt={`${product.title}${currentImage?.type ? ' - ' + currentImage.type.replace(/-/g, ' ') : ''}`}
                className="w-full h-full object-cover print:object-contain print:h-auto print:max-h-[400px]"
              />

              {hasMultipleImages && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card text-card-foreground p-3 rounded-full transition-all shadow-3d-md print:hidden"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card text-card-foreground p-3 rounded-full transition-all shadow-3d-md print:hidden"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {product.ribbon_text && (
                <div className="absolute top-4 left-4 bg-accent text-accent-foreground text-sm font-bold px-4 py-2 rounded-full shadow-3d-lg print:hidden">
                  {product.ribbon_text}
                </div>
              )}
            </div>

            {hasMultipleImages && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2 print:hidden">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shadow-3d-sm hover:shadow-3d-md ${
                      index === currentImageIndex ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <img
                      src={!image.url ? placeholderImage : image.url}
                      alt={`${product.title}${image.type ? ' - ' + image.type.replace(/-/g, ' ') : ''} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col print-break-inside-avoid"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3 print:hidden" style={{letterSpacing: '-0.02em'}}>
              {product.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-6 print:text-black">{product.subtitle}</p>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-5xl font-bold text-primary print:text-black">{price}</span>
              {selectedVariant?.sale_price_in_cents && (
                <span className="text-2xl text-muted-foreground line-through print:text-gray-500">{originalPrice}</span>
              )}
            </div>

            <div className="prose prose-sm max-w-none mb-8 text-foreground print:text-black" dangerouslySetInnerHTML={{ __html: product.description }} />

            {product.additional_info?.length > 0 && (
              <div className="mb-8 space-y-4 print-break-inside-avoid">
                {product.additional_info
                  .sort((a, b) => a.order - b.order)
                  .map((info) => (
                    <div key={info.id} className="border-l-2 border-primary/50 pl-4 print:border-gray-400">
                      <h3 className="text-lg font-semibold mb-2 print:text-black">{info.title}</h3>
                      <div className="prose prose-sm max-w-none text-muted-foreground print:text-black" dangerouslySetInnerHTML={{ __html: info.description }} />
                    </div>
                  ))}
              </div>
            )}

            {product.variants.length > 1 && (
              <div className="mb-6 print-break-inside-avoid">
                <h3 className="text-sm font-medium mb-3 print:text-black">Selected Variant</h3>
                <div className="flex flex-wrap gap-2 print:hidden">
                  {product.variants.map(variant => (
                    <Button
                      key={variant.id}
                      variant={selectedVariant?.id === variant.id ? 'default' : 'outline'}
                      onClick={() => handleVariantSelect(variant)}
                      className={`transition-all shadow-3d-sm hover:shadow-3d-md ${
                        selectedVariant?.id === variant.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-card text-card-foreground border-border'
                      }`}
                    >
                      {variant.title}
                    </Button>
                  ))}
                </div>
                <div className="hidden print:block text-black font-medium">
                  {selectedVariant?.title}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-8 print:hidden">
              <div className="flex items-center border border-border rounded-xl p-1 shadow-3d-sm">
                <Button 
                  onClick={() => handleQuantityChange(-1)} 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-lg h-10 w-10"
                >
                  <Minus size={16} />
                </Button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <Button 
                  onClick={() => handleQuantityChange(1)} 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-lg h-10 w-10"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>

            <div className="mt-auto print:hidden">
              <Button 
                onClick={handleAddToCart} 
                size="lg" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg shadow-3d-lg hover:shadow-3d-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]" 
                disabled={!canAddToCart || !product.purchasable}
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> 
                Add to cart
              </Button>

              {isStockManaged && canAddToCart && product.purchasable && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-3 flex items-center justify-center gap-2">
                  <CheckCircle size={16} /> {availableStock} in stock
                </p>
              )}

              {isStockManaged && !canAddToCart && product.purchasable && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-3 flex items-center justify-center gap-2">
                  <XCircle size={16} /> Not enough stock. Only {availableStock} left.
                </p>
              )}

              {!product.purchasable && (
                <p className="text-sm text-destructive mt-3 flex items-center justify-center gap-2">
                  <XCircle size={16} /> Currently unavailable
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="py-12 print:hidden">
            <h2 className="text-3xl font-bold mb-8" style={{letterSpacing: '-0.02em'}}>
              You might also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product, index) => (
                <ProductCard3D key={product.id} product={product} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </>
  );
}

export default ProductDetailPage;