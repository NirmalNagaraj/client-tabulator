"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Pizza, Coffee, Soup, Beef } from 'lucide-react';
import { Button } from '@/components/ui/button';

const foodIcons = [
  <Pizza key="pizza" className="w-12 h-12" />,
  <Coffee key="coffee" className="w-12 h-12" />,
  <Soup key="soup" className="w-12 h-12" />,
  <Beef key="beef" className="w-12 h-12" />,
];

// Define the type for order details
interface OrderDetails {
  amount: number;
  tableNumber: string;
}

export default function OrderSuccess() {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [showIframe, setShowIframe] = useState(false);

  useEffect(() => {
    const details = sessionStorage.getItem('orderDetails');
    const storedTableNumber = sessionStorage.getItem('tableNumber');
    
    if (details) {
      setOrderDetails(JSON.parse(details));
    }
    if (storedTableNumber) {
      setTableNumber(storedTableNumber);
    }
  }, []);

  const handleReorder = () => {
    if (tableNumber) {
      router.push(`/?tableNumber=${tableNumber}`);
    }
  };

  const handlePlayAndWin = () => {
    setShowIframe(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <motion.div
          className="flex justify-center gap-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {foodIcons.map((icon, index) => (
            <motion.div
              key={index}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.4 + index * 0.1,
                type: "spring",
                bounce: 0.6
              }}
            >
              {icon}
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your delicious food will be served soon at your table.
          </p>
          
          {orderDetails && (
            <div className="text-left bg-muted p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">Order Details</h2>
              <div className="space-y-2">
                <p>Order Total: ₹{orderDetails.amount}</p>
                <p>Table Number: {orderDetails.tableNumber}</p>
              </div>
            </div>
          )}

          <Button onClick={handleReorder} className="w-full">
            Place Another Order
          </Button>

          {/* Play & win coupons button */}
          <Button onClick={handlePlayAndWin} className="w-full mt-4">
            Play & Win Coupons
          </Button>

          {/* Show the iframe if the button is clicked */}
          {showIframe && (
            <div className="mt-8">
              <iframe 
                src="https://game-tabulator.vercel.app/" 
                width="100%" 
                height="500" 
                style={{ border: 'none' }} 
                title="Game Tabulator"
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
