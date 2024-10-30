"use client";

import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
}

export function OTPInput({ value, onChange, onComplete }: OTPInputProps) {
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value.replace(/\D/g, '');
    if (newValue.length <= 1) {
      const newOtp = value.split('');
      newOtp[index] = newValue;
      const finalOtp = newOtp.join('');
      onChange(finalOtp);
      
      if (newValue.length === 1 && index < 3) {
        setActiveInput(index + 1);
        inputRefs.current[index + 1]?.focus();
      }

      if (finalOtp.length === 4) {
        onComplete?.(finalOtp);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      setActiveInput(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    setActiveInput(index);
  };

  return (
    <div className="flex justify-center gap-2">
      {[0, 1, 2, 3].map((index) => (
        <Input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="text"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={() => handleFocus(index)}
          className="w-14 h-14 text-center text-2xl"
          autoFocus={index === 0}
        />
      ))}
    </div>
  );
}