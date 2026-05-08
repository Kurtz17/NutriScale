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
import { AlertCircle, CheckCircle2, ShoppingCart } from 'lucide-react';

import CartItem from './cart-item';

interface CartSidebarProps {
  cart: CartItemType[];
  totalCalories: number;
  targetCalories: number;
  subtotal: number;
  updateQuantity: (id: string | number, quantity: number) => void;
  removeFromCart: (id: string | number) => void;
  handleCheckout: () => void;
}

export default function CartSidebar({
  cart,
  totalCalories,
  targetCalories,
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
        {/* AI Calorie Meter */}
        <div
          className={`rounded-2xl p-5 mb-8 transition-all ${
            cart.length === 0
              ? 'bg-gray-50'
              : totalCalories > targetCalories
                ? 'bg-red-50 border border-red-100'
                : 'bg-[#F1F8E9] border border-[#DCEDC8]'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                AI Health Check
              </p>
              <p className="font-black text-3xl text-gray-900">
                {totalCalories}{' '}
                <span className="text-sm font-bold text-gray-500">kcal</span>
              </p>
            </div>
            {cart.length > 0 &&
              (totalCalories > targetCalories ? (
                <AlertCircle className="w-6 h-6 text-red-500 animate-pulse" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-[#7CB342]" />
              ))}
          </div>

          <div className="mt-4">
            {cart.length === 0 ? (
              <p className="text-sm text-gray-400 font-medium italic">
                Add some items to start AI analysis...
              </p>
            ) : totalCalories > targetCalories ? (
              <div className="flex flex-col gap-1">
                <p className="text-sm text-red-600 font-bold">
                  ⚠️ Exceeds daily needs
                </p>
                <div className="w-full bg-red-100 h-1.5 rounded-full mt-1">
                  <div
                    className="bg-red-500 h-full rounded-full"
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>
            ) : totalCalories < targetCalories * 0.5 ? (
              <div className="flex flex-col gap-1">
                <p className="text-sm text-amber-600 font-bold">
                  ⚠️ Below daily target
                </p>
                <div className="w-full bg-amber-100 h-1.5 rounded-full mt-1">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{
                      width: `${(totalCalories / targetCalories) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <p className="text-sm text-[#7CB342] font-bold">
                  ✓ Perfect Balance
                </p>
                <div className="w-full bg-green-100 h-1.5 rounded-full mt-1">
                  <div
                    className="bg-[#7CB342] h-full rounded-full"
                    style={{
                      width: `${(totalCalories / targetCalories) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

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
