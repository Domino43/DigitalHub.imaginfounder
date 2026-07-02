import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Users, Download, Star } from 'lucide-react';
import { getProducts, getProductQuantities } from '@/api/EcommerceApi';
import ProductCard3D from '@/components/ProductCard3D';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const categories = [
  { name: 'Website Templates', icon: '🌐' },
  { name: 'Children\'s Books', icon: '📚' },
  { name: 'Ebooks', icon: '📖' },
  { name: 'Gallery Apps', icon: '🖼️' },
  { name: 'Software Tools', icon: '🛠️' },
  { name: 'T-Shirt Designs', icon: '👕' },
  { name: 'UI Kits', icon: '🎨' },
  { name: 'Fonts & Typography', icon: '✍️' },
  { name: 'Stock Photos', icon: '📸' }
];

const HomePage = ({ setIsCartOpen }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const productsResponse = await getProducts({ limit: '8' });
        
        if (productsResponse.products.length > 0) {
          const productIds = productsResponse.products.map(p => p.id);
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

          setFeaturedProducts(productsWithQuantities);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <>
      <Helmet>
        <title>DigitalHub - Premium Digital Products</title>
        <meta name="description" content="Discover premium digital products including templates, ebooks, software tools, and more. Quality resources for creators and developers." />
      </Helmet>
      <Header setIsCartOpen={setIsCartOpen} />
      
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1646041293779-2466bf622784"
            alt="Modern workspace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-background/75" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance" style={{letterSpacing: '-0.02em'}}>
              Premium digital products for modern creators
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Discover high-quality templates, tools, and resources to elevate your projects
            </p>
            <Link to="/products">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-3d-lg hover:shadow-3d-xl transition-all text-lg px-8 py-6">
                Explore Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{letterSpacing: '-0.02em'}}>
              Featured products
            </h2>
            <p className="text-lg text-muted-foreground">
              Hand-picked premium digital products
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card-3d h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <ProductCard3D key={product.id} product={product} index={index} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/products">
              <Button variant="outline" size="lg" className="shadow-3d-md hover:shadow-3d-lg transition-all">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{letterSpacing: '-0.02em'}}>
              Browse by category
            </h2>
            <p className="text-lg text-muted-foreground">
              Find exactly what you need
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link to={`/products?category=${encodeURIComponent(category.name)}`}>
                  <div className="card-3d soft-reflection p-8 text-center group cursor-pointer">
                    <div className="text-5xl mb-4">{category.icon}</div>
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, label: 'Active creators', value: '12,847' },
              { icon: Download, label: 'Downloads', value: '47,293' },
              { icon: Star, label: 'Average rating', value: '4.8/5' },
              { icon: CheckCircle, label: 'Products', value: '200+' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4 shadow-3d-md">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;