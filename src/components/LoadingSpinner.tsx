import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: string;
  className?: string;
}

export function LoadingSpinner({ size = "h-5 w-5", className }: LoadingSpinnerProps) {
  return <Loader2 className={cn("animate-spin", size, className)} />;
}
