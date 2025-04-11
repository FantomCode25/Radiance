import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import { useAuth } from '@/hooks/useAuth';

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {string} image
 * @property {string} category
 * @property {number} rating
 * @property {number} reviewCount
 * @property {boolean} [isOnSale]
 * @property {number} [salePrice]
 * @property {string} [description]
 * @property {boolean} [inStock]
 */

// Mock data for products
const productsData = [
  {
    id: '1',
    name: 'Mindfulness Journal',
    price: 24.99,
    image: '/product-1.jpg',
    category: 'Books & Journals',
    rating: 4.7,
    reviewCount: 128,
    description: 'Daily prompts and exercises to build a mindfulness practice.',
    inStock: true
  },
  {
    id: '2',
    name: 'Lavender Essential Oil',
    price: 18.99,
    image: '/product-2.jpg',
    category: 'Aromatherapy',
    rating: 4.9,
    reviewCount: 256,
    description: 'Pure lavender oil to promote relaxation and better sleep.',
    inStock: true,
    isOnSale: true,
    salePrice: 14.99
  },
  {
    id: '3',
    name: 'Meditation Cushion Set',
    price: 49.99,
    image: '/product-3.jpg',
    category: 'Meditation Tools',
    rating: 4.6,
    reviewCount: 94,
    description: 'Comfortable cushion and mat for meditation practice.',
    inStock: true
  },
  {
    id: '4',
    name: 'Sleep Sound Machine',
    price: 39.99,
    image: '/product-4.jpg',
    category: 'Sleep Aids',
    rating: 4.5,
    reviewCount: 187,
    description: 'Multiple soothing sounds to help you fall asleep faster.',
    inStock: true
  },
  {
    id: '5',
    name: 'Stress Relief Tea',
    price: 12.99,
    image: '/product-5.jpg',
    category: 'Supplements',
    rating: 4.8,
    reviewCount: 213,
    description: 'Organic herbal blend to reduce stress and promote calm.',
    inStock: true,
    isOnSale: true,
    salePrice: 9.99
  },
  {
    id: '6',
    name: 'Anxiety Relief Supplement',
    price: 29.99,
    image: '/product-6.jpg',
    category: 'Supplements',
    rating: 4.3,
    reviewCount: 156,
    description: 'Natural supplement to support reduced anxiety and stress.',
    inStock: false
  },
  {
    id: '7',
    name: 'Self-Care Gift Box',
    price: 59.99,
    image: '/product-7.jpg',
    category: 'Self-Care Kits',
    rating: 4.9,
    reviewCount: 78,
    description: 'Complete self-care package with multiple wellness products.',
    inStock: true
  },
  {
    id: '8',
    name: 'Weighted Blanket',
    price: 79.99,
    image: '/product-8.jpg',
    category: 'Sleep Aids',
    rating: 4.7,
    reviewCount: 302,
    description: '15lb weighted blanket for better sleep and reduced anxiety.',
    inStock: true
  },
  {
    id: '9',
    name: 'Anti-Stress Massage Ball Set',
    price: 15.99,
    image: '/product-9.jpg',
    category: 'Stress Relief Tools',
    rating: 4.4,
    reviewCount: 67,
    description: 'Set of 3 textured balls for stress relief and muscle tension.',
    inStock: true
  },
  {
    id: '10',
    name: 'Guided Meditation Cards',
    price: 19.99,
    image: '/product-10.jpg',
    category: 'Mindfulness Accessories',
    rating: 4.6,
    reviewCount: 124,
    description: '50 cards with different guided meditation exercises.',
    inStock: true,
    isOnSale: true,
    salePrice: 16.99
  },
  {
    id: '11',
    name: 'Light Therapy Lamp',
    price: 69.99,
    image: '/product-11.jpg',
    category: 'Stress Relief Tools',
    rating: 4.5,
    reviewCount: 143,
    description: 'Full spectrum light therapy for improved mood and energy.',
    inStock: true
  },
  {
    id: '12',
    name: 'Gratitude Journal',
    price: 22.99,
    image: '/product-12.jpg',
    category: 'Books & Journals',
    rating: 4.8,
    reviewCount: 231,
    description: 'Daily journal to practice gratitude and positive thinking.',
    inStock: true
  }
];

const Products = () => {
  const [filteredProducts, setFilteredProducts] = useState(productsData);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/products' } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Apply filters
  const handleFilterChange = (newFilters) => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let results = [...productsData];
      
      // Apply price range filter
      if (newFilters.priceRange) {
        results = results.filter(
          product =>
            product.price >= newFilters.priceRange[0] &&
            product.price <= newFilters.priceRange[1]
        );
      }
      
      // Apply category filter
      if (newFilters.categories && newFilters.categories.length > 0) {
        results = results.filter(product =>
          newFilters.categories.includes(product.category)
        );
      }
      
      // Apply rating filter
      if (newFilters.ratings) {
        results = results.filter(
          product => product.rating >= newFilters.ratings
        );
      }
      
      // Apply in-stock filter
      if (newFilters.inStock) {
        results = results.filter(product => product.inStock !== false);
      }
      
      // Apply on-sale filter
      if (newFilters.onSaleOnly) {
        results = results.filter(product => product.isOnSale === true);
      }
      
      // Apply sorting
      if (newFilters.sortBy) {
        switch (newFilters.sortBy) {
          case 'priceAsc':
            results.sort((a, b) => {
              const priceA = a.isOnSale && a.salePrice ? a.salePrice : a.price;
              const priceB = b.isOnSale && b.salePrice ? b.salePrice : b.price;
              return priceA - priceB;
            });
            break;
          case 'priceDesc':
            results.sort((a, b) => {
              const priceA = a.isOnSale && a.salePrice ? a.salePrice : a.price;
              const priceB = b.isOnSale && b.salePrice ? b.salePrice : b.price;
              return priceB - priceA;
            });
            break;
          case 'ratings':
            results.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
            // In a real app, this would sort by date
            // For this demo, we'll just reverse the array to simulate "newest"
            results.reverse();
            break;
          default:
            // 'featured' is default, use the original order
            break;
        }
      }
      
      setFilteredProducts(results);
      setLoading(false);
    }, 500);
  };

  const handleAddToCart = (productId) => {
    // Check if item is already in cart
    const existingItemIndex = cartItems.findIndex(item => item.id === productId);
    
    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += 1;
      setCartItems(updatedCart);
    } else {
      // Add new item
      setCartItems([...cartItems, { id: productId, quantity: 1 }]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-oasis-dark mb-4">Wellness Products</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our curated collection of products designed to support your mental wellness journey.
              From stress relief to better sleep, we've got you covered.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar filters */}
            <div className="w-full md:w-64 flex-shrink-0">
              <ProductFilters onFilterChange={handleFilterChange} />
            </div>
            
            {/* Product cards grid */}
            <div className="flex-grow">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-oasis-primary"></div>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      {...product} 
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4 bg-white rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any products matching your criteria.
                    Try adjusting your filters to see more results.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
