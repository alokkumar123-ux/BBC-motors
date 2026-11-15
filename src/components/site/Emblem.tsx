import emblem from "@/assets/emblem.png";
import { cn } from "@/lib/utils";

export function Emblem({ className }: { className?: string }) {
  return (
    <img
      src={emblem}
      alt="State emblem"
      width={256}
      height={256}
      className={cn("h-10 w-10 object-contain", className)}
    />
  );
}
