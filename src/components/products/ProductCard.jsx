import { useState } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Converted interface ProductProps to JSDoc for documentation purposes
/**
 * @typedef {Object} ProductProps
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
 * @property {(productId: string) => void} onAddToCart
 */

const ProductCard = ({
  id,
  name,
  price,
  image,
  category,
  rating,
  reviewCount,
  isOnSale = false,
  salePrice,
  description,
  inStock = true,
  onAddToCart
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = () => {
    onAddToCart(id);
    
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`
    });
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${name} has been ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`
    });
  };

  // Render stars for rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
        </svg>
      );
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="url(#half-star)" />
          <defs>
            <linearGradient id="half-star" x1="0" x2="100%" y1="0" y2="0">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="rgba(0,0,0,0.1)" />
            </linearGradient>
          </defs>
        </svg>
      );
    }
    
    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
        </svg>
      );
    }
    
    return stars;
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative">
        {/* Wishlist button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 z-10 rounded-full bg-white p-1.5 shadow-md transition-colors"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
          />
        </button>
        
        {/* Sale badge */}
        {isOnSale && (
          <Badge className="absolute top-3 left-3 z-10 bg-red-500 hover:bg-red-600">
            Sale
          </Badge>
        )}
        
        {/* Out of stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <Badge className="bg-gray-800 text-white text-lg py-1.5 px-4">
              Out of Stock
            </Badge>
          </div>
        )}
        
        {/* Product image */}
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover object-center"
        />
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        {/* Category */}
        <div className="mb-1">
          <span className="text-xs text-gray-500">{category}</span>
        </div>
        
        {/* Name */}
        <h3 className="text-lg font-medium text-gray-900 mb-1">{name}</h3>
        
        {/* Description (if provided) */}
        {description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
        )}
        
        {/* Rating */}
        <div className="flex items-center mb-2 mt-auto">
          <div className="flex">
            {renderStars()}
          </div>
          <span className="text-xs text-gray-500 ml-2">({reviewCount})</span>
        </div>
        
        {/* Price */}
        <div className="flex items-center mb-3">
          {isOnSale && salePrice ? (
            <>
              <span className="text-lg font-bold text-red-600 mr-2">
                ${salePrice.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ${price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Add to cart button */}
        <Button
          onClick={handleAddToCart}
          className="w-full bg-oasis-primary hover:bg-oasis-primary/90 text-white"
          disabled={!inStock}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
