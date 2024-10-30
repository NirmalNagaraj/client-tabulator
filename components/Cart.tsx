"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/types';
import { X, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { OTPInput } from '@/components/OTPInput';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveFromCart: (item: CartItem) => void;
}

export default function Cart({
  isOpen,
  onClose,
  cartItems,
  onRemoveFromCart,
}: CartProps) {
  const router = useRouter();
  const [step, setStep] = useState<'cart' | 'contact' | 'otp'>('cart');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verified = sessionStorage.getItem('isVerified') === 'true';
    const storedPhone = sessionStorage.getItem('phoneNumber');
    const storedEmail = sessionStorage.getItem('email');
    
    setIsVerified(verified);
    if (verified && storedPhone && storedEmail) {
      setPhoneNumber(storedPhone);
      setEmail(storedEmail);
    }
  }, []);

  const totalCost = cartItems.reduce(
    (sum, item) => sum + item.itemCost * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    if (isVerified) {
      handleOrderSubmission();
    } else {
      setStep('contact');
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length === 10 && email) {
      sessionStorage.setItem('phoneNumber', phoneNumber);
      sessionStorage.setItem('email', email);
      setStep('otp');
    }
  };

  const handleOrderSubmission = async () => {
    const tableNumber = sessionStorage.getItem('tableNumber');
    const orderData = {
      amount: totalCost,
      mobile: phoneNumber,
      email,
      tableNumber,
      items: cartItems.map(item => ({
        itemId: item.id,
        itemName: item.itemName,
        itemCost: item.itemCost,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch('https://tabulator-backend.vercel.app/api/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        sessionStorage.setItem('isVerified', 'true');
        sessionStorage.setItem('orderDetails', JSON.stringify(orderData));
        router.push(`/order-success?tableNumber=${tableNumber}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const handleOtpComplete = async (value: string) => {
    if (value.length === 4) {
      handleOrderSubmission();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex justify-end">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          className="w-full max-w-md h-full bg-background"
        >
          <Card className="w-full h-full border-0 rounded-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                Your Plate
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {step === 'cart' && (
                  <motion.div
                    key="cart"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {cartItems.length === 0 ? (
                      <p className="text-muted-foreground">Your plate is empty.</p>
                    ) : (
                      <>
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between py-4 border-b">
                            <div>
                              <h3 className="font-medium">{item.itemName}</h3>
                              <p className="text-sm text-muted-foreground">
                                {item.quantity} x ₹{item.itemCost}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              onClick={() => onRemoveFromCart(item)}
                              className="text-destructive hover:text-destructive/90"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <div className="mt-6">
                          <p className="text-xl font-bold">Total: ₹{totalCost.toFixed(2)}</p>
                        </div>
                        <Button 
                          className="w-full mt-4"
                          onClick={handlePlaceOrder}
                        >
                          Place Order
                        </Button>
                      </>
                    )}
                  </motion.div>
                )}

                {!isVerified && step === 'contact' && (
                  <motion.form
                    key="contact"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={handleContactSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <label htmlFor="email" className="text-sm font-medium block mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="text-sm font-medium block mb-2">
                        Mobile Number
                      </label>
                      <Input
                        type="tel"
                        id="phone"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="10-digit mobile number"
                        className="text-lg"
                        required
                        pattern="[0-9]{10}"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Send OTP
                    </Button>
                  </motion.form>
                )}

                {!isVerified && step === 'otp' && (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center">
                      <h3 className="text-lg font-medium mb-2">Enter OTP</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        We've sent a code to {phoneNumber}
                      </p>
                    </div>
                    <OTPInput
                      value={otp}
                      onChange={setOtp}
                      onComplete={handleOtpComplete}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}