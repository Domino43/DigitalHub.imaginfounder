import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { getProducts, getProductQuantities } from '@/api/EcommerceApi';
import ProductCard3D from '@/components/ProductCard3D';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';

const ProductsList = ({ setIsCartOpen }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All Products';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'All Products') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  useEffect(() => {
    const fetchProductsWithQuantities = async () => {
      try {
        setLoading(true);
        setError(null);

        const productsResponse = await getProducts();

        if (productsResponse.products.length === 0) {
          setProducts([]);
          return;
        }

        const productIds = productsResponse.products.map(product => product.id);

        const quantitiesResponse = await getProductQuantities({
          fields: 'inventory_quantity',
          product_ids: productIds
        });

        const variantQuantityMap = new Map();
        quantitiesResponse.variants.forEach(variant => {
          variantQuantityMap.set(variant.id, variant.inventory_quantity);
        });

        const productsWithQuantities = productsResponse.products.map(product => ({
          ...product,
          variants: product.variants.map(variant => ({
            ...variant,
            inventory_quantity: variantQuantityMap.get(variant.id) ?? variant.inventory_quantity
          }))
        }));

        setProducts(productsWithQuantities);
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProductsWithQuantities();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== 'All Products') {
      filtered = filtered.filter(product => 
        product.type?.value === selectedCategory
      );
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(lowerSearch) ||
        product.description?.toLowerCase().includes(lowerSearch) ||
        product.subtitle?.toLowerCase().includes(lowerSearch)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.variants[0].price_in_cents - b.variants[0].price_in_cents;
        case 'price-high':
          return b.variants[0].price_in_cents - a.variants[0].price_in_cents;
        case 'popular':
          return b.order - a.order;
        case 'newest':
        default:
          return new Date(b.updated_at) - new Date(a.updated_at);
      }
    });

    return sorted;
  }, [products, selectedCategory, searchTerm, sortBy]);

  if (loading) {
    return (
      <>
        <Header setIsCartOpen={setIsCartOpen} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Skeleton className="h-10 w-full max-w-md mb-4" />
            <div className="flex gap-3 flex-wrap">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-32" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card-3d p-0 overflow-hidden">
                <Skeleton className="w-full h-56" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header setIsCartOpen={setIsCartOpen} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-destructive p-8 card-3d">
            <p>Error loading products: {error}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Products - DigitalHub</title>
        <meta name="description" content="Browse our collection of premium digital products including templates, ebooks, software tools, and more." />
      </Helmet>
      <Header setIsCartOpen={setIsCartOpen} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{letterSpacing: '-0.02em'}}>
            Explore our products
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover {products.length} premium digital products
          </p>
        </div>

        <SearchBar
          searchTerm={searchTerm}
          sortBy={sortBy}
          onSearchChange={setSearchTerm}
          onSortChange={setSortBy}
        />

        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16 card-3d">
            <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product, index) => (
              <ProductCard3D key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductsList;