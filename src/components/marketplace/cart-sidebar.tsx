import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CartItem as CartItemType } from '@/types/marketplace';
import { ShoppingCart } from 'lucide-react';

import CartItem from './cart-item';

interface CartSidebarProps {
  cart: CartItemType[];
  subtotal: number;
  updateQuantity: (id: string | number, quantity: number) => void;
  removeFromCart: (id: string | number) => void;
  handleCheckout: () => void;
}

export default function CartSidebar({
  cart,
  subtotal,
  updateQuantity,
  removeFromCart,
  handleCheckout,
}: CartSidebarProps) {
  return (
    <Card className="w-full lg:w-[400px] rounded-[32px] shadow-2xl shadow-green-900/5 border-none h-fit sticky top-10 bg-white overflow-hidden transition-all">
      <CardHeader className="pb-6 pt-8 px-8 border-b border-gray-50 flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-black text-gray-900 flex items-center gap-3">
          <ShoppingCart className="w-6 h-6 text-[#7CB342]" />
          Smart AI Cart
        </CardTitle>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
          {cart.length} Items
        </span>
      </CardHeader>

      <CardContent className="p-8">
        <ScrollArea className="h-[350px] pr-4 -mr-4">
          <div className="flex flex-col gap-4 pb-6">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
                <ShoppingCart className="w-12 h-12 mb-3" />
                <p className="text-sm font-bold">Your cart is feeling lonely</p>
              </div>
            ) : (
              cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <div className="px-8">
        <Separator className="bg-gray-100" />
      </div>

      <CardFooter className="flex-col p-8 gap-6">
        <div className="flex justify-between w-full">
          <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            Estimated Total
          </span>
          <span className="font-black text-2xl text-gray-900">
            Rp {subtotal.toLocaleString()}
          </span>
        </div>
        <Button
          onClick={handleCheckout}
          disabled={cart.length === 0}
          className="w-full bg-gray-900 hover:bg-black text-white py-8 rounded-[20px] text-lg font-black shadow-xl shadow-gray-200 transition-all active:scale-[0.98] disabled:opacity-20"
        >
          Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  );
}
