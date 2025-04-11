import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartItem from '@/components/products/CartItem';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   image: string;
//   isOnSale?: boolean;
//   salePrice?: number;
// }

// interface CartItemType {
//   id: string;
//   quantity: number;
// }

// Mock data for products (simplified version from Products.tsx)
const productsData = [
  {
    id: '1',
    name: 'Mindfulness Journal',
    price: 24.99,
    image: '/product-1.jpg',
  },
  {
    id: '2',
    name: 'Lavender Essential Oil',
    price: 18.99,
    image: '/product-2.jpg',
    isOnSale: true,
    salePrice: 14.99
  },
  {
    id: '3',
    name: 'Meditation Cushion Set',
    price: 49.99,
    image: '/product-3.jpg',
  },
  {
    id: '4',
    name: 'Sleep Sound Machine',
    price: 39.99,
    image: '/product-4.jpg',
  },
  {
    id: '5',
    name: 'Stress Relief Tea',
    price: 12.99,
    image: '/product-5.jpg',
    isOnSale: true,
    salePrice: 9.99
  },
  {
    id: '6',
    name: 'Anxiety Relief Supplement',
    price: 29.99,
    image: '/product-6.jpg',
  },
  {
    id: '7',
    name: 'Self-Care Gift Box',
    price: 59.99,
    image: '/product-7.jpg',
  },
  {
    id: '8',
    name: 'Weighted Blanket',
    price: 79.99,
    image: '/product-8.jpg',
  },
  {
    id: '9',
    name: 'Anti-Stress Massage Ball Set',
    price: 15.99,
    image: '/product-9.jpg',
  },
  {
    id: '10',
    name: 'Guided Meditation Cards',
    price: 19.99,
    image: '/product-10.jpg',
    isOnSale: true,
    salePrice: 16.99
  },
  {
    id: '11',
    name: 'Light Therapy Lamp',
    price: 69.99,
    image: '/product-11.jpg',
  },
  {
    id: '12',
    name: 'Gratitude Journal',
    price: 22.99,
    image: '/product-12.jpg',
  }
];

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Map cart items to products
  useEffect(() => {
    const products = cartItems.map(item => {
      const product = productsData.find(p => p.id === item.id);
      if (!product) return null;
      
      return {
        ...product,
        quantity: item.quantity
      };
    }).filter(Boolean);
    
    setCartProducts(products);
  }, [cartItems]);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleUpdateQuantity = (id, newQuantity) => {
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    
    toast({
      title: "Cart updated",
      description: "Item quantity has been updated.",
    });
  };

  const handleRemoveItem = id => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
    
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartProducts.reduce((total, item) => {
      const price = item.isOnSale && item.salePrice ? item.salePrice : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  // Calculate shipping cost (free shipping over $50)
  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 50 ? 0 : 5.99;
  };

  // Calculate taxes (assuming 8% tax rate)
  const calculateTax = () => {
    return calculateSubtotal() * 0.08;
  };

  // Calculate total
  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-oasis-dark mb-4">Your Cart</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Review your selected wellness products before proceeding to checkout.
            </p>
          </div>
          
          {cartProducts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Shopping Cart ({cartProducts.length} {cartProducts.length === 1 ? 'item' : 'items'})
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearCart}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                    >
                      Clear Cart
                    </Button>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {cartProducts.map(item => (
                      <CartItem
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        price={item.isOnSale && item.salePrice ? item.salePrice : item.price}
                        image={item.image}
                        quantity={item.quantity}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveItem}
                      />
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <Link to="/products">
                      <Button variant="outline" className="text-oasis-primary border-oasis-primary">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {calculateShipping() === 0 ? 'Free' : `$${calculateShipping().toFixed(2)}`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (8%)</span>
                      <span className="font-medium">${calculateTax().toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-lg font-bold">${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-oasis-primary hover:bg-oasis-primary/90 py-6 mt-4"
                    >
                      Proceed to Checkout
                    </Button>
                    
                    <div className="text-xs text-center text-gray-500 mt-4">
                      <p>Secure checkout powered by Razorpay</p>
                      <p className="mt-1">Free shipping on orders over $50</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-6 mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any wellness products to your cart yet.
                Browse our collection to find products that support your mental health journey.
              </p>
              <Link to="/products">
                <Button className="bg-oasis-primary hover:bg-oasis-primary/90">
                  Browse Products
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
