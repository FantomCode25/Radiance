import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// The CartItemProps interface from TypeScript has been removed in this JavaScript version.
// The expected properties are: id (string), name (string), price (number), image (string),
// quantity (number), onUpdateQuantity (function), and onRemove (function).
const CartItem = ({
  id,
  name,
  price,
  image,
  quantity,
  onUpdateQuantity,
  onRemove
}) => {
  const incrementQuantity = () => {
    onUpdateQuantity(id, quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      onUpdateQuantity(id, quantity - 1);
    }
  };

  const handleRemove = () => {
    onRemove(id);
  };

  return (
    <div className="flex py-6 border-b border-gray-200">
      {/* Product image */}
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Product details */}
      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{name}</h3>
            <p className="ml-4">${(price * quantity).toFixed(2)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">${price.toFixed(2)} each</p>
        </div>
        
        <div className="flex flex-1 items-end justify-between text-sm">
          {/* Quantity controls */}
          <div className="flex items-center">
            <span className="text-gray-500 mr-3">Qty</span>
            <div className="flex items-center border border-gray-300 rounded">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-2 text-center w-8">{quantity}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={incrementQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Remove button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-500 hover:bg-red-50"
            onClick={handleRemove}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
