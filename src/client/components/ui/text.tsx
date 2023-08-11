import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/utils/utils";

const textVariants = cva([], {
  variants: {
    variant: {
      default: "font-normal",
      secondary: "font-semibold text-primary",
      accent: "font-normal text-accent",
      destructive: "font-normal text-destructive",
      ghost: "font-normal text-muted",
    },
    size: {
      default: "text-base",
      sm: "text-sm",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-xl md:text-2xl",
      "3xl": "text-2xl md:text-3xl",
      "4xl": "text-3xl md:text-4xl",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface TextProps
  extends React.ParamHTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  asChild?: boolean;
}
const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "p";
    return (
        <Comp
          className={cn(textVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
    );
  }
);
Text.displayName = "Text";

export { Text, textVariants };
