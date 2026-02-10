import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 9999,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    const newQuantity = Math.max(min, quantity - 1);
    onChange(newQuantity);
  };

  const handleIncrement = () => {
    const newQuantity = Math.min(max, quantity + 1);
    onChange(newQuantity);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      onChange(min);
      return;
    }
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      onChange(clamped);
    }
  };

  const handleBlur = () => {
    if (quantity < min) {
      onChange(min);
    } else if (quantity > max) {
      onChange(max);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleDecrement}
        disabled={quantity <= min}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className="h-8 w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        min={min}
        max={max}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleIncrement}
        disabled={quantity >= max}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
