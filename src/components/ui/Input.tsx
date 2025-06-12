import { InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
        props.className
      )}
    />
  );
}
