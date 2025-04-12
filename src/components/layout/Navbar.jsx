
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MentalHealthDropdown from './MentalHealthDropdown';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="Mental Oasis Logo" 
              className="h-10 mr-2" 
            />
            <span className="text-xl font-medium text-oasis-dark">ZenZone</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/quiz" className="text-gray-700 hover:text-oasis-primary">Mental Assessment</Link>
            <Link to="/therapists" className="text-gray-700 hover:text-oasis-primary">Therapists</Link>
            <Link to="/products" className="text-gray-700 hover:text-oasis-primary">Wellness Products</Link>
            <MentalHealthDropdown />
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5 text-gray-700 hover:text-oasis-primary" />
                </Link>
                <Link to="/profile">
                  <User className="h-5 w-5 text-gray-700 hover:text-oasis-primary" />
                </Link>
                <Button 
                  variant="outline" 
                  onClick={logout}
                  className="border-oasis-primary text-oasis-primary hover:bg-oasis-primary hover:text-white"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline" className="border-oasis-primary text-oasis-primary hover:bg-oasis-primary hover:text-white">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-oasis-primary hover:bg-oasis-primary/90 text-white">
                    Sign Up
                  </Button>
                </Link>
                <Link to="/therapist-login">
                  <Button variant="outline" className="border-oasis-primary text-oasis-primary hover:bg-oasis-primary hover:text-white">
                    Therapist Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/quiz" 
                className="text-gray-700 hover:text-oasis-primary py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Mental Assessment
              </Link>
              <Link 
                to="/therapists" 
                className="text-gray-700 hover:text-oasis-primary py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Therapists
              </Link>
              <Link 
                to="/products" 
                className="text-gray-700 hover:text-oasis-primary py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Wellness Products
              </Link>
              <MentalHealthDropdown isMobile={true} />
              
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-4 py-2">
                    <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                      <ShoppingCart className="h-5 w-5 text-gray-700" />
                    </Link>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <User className="h-5 w-5 text-gray-700" />
                    </Link>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="border-oasis-primary text-oasis-primary w-full"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant="outline" className="border-oasis-primary text-oasis-primary w-full">
                      Login
                    </Button>
                  </Link>
                  <Link 
                    to="/signup" 
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="bg-oasis-primary text-white w-full">
                      Sign Up
                    </Button>
                  </Link>
                  <Link 
                    to="/therapist-signup" 
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="bg-oasis-primary text-white w-full">
                      Therapist Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
