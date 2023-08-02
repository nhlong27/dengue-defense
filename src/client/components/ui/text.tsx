import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { Balancer } from "react-wrap-balancer";
import { cn } from "@/utils/utils";

const textVariants = cva([], {
  variants: {
    variant: {
      default: "font-normal",
      primary: "font-semibold text-primary dark:text-primary-dark",
      accent: "font-normal text-accent dark:text-accent-dark",
      destructive: "font-normal text-destructive dark:text-destructive-dark",
      tertiary: "font-normal text-tertiary dark:text-tertiary-dark",
      ghost: "font-normal text-ghost dark:text-ghost-dark",
      link: "underline font-normal text-link dark:text-link-dark",
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
      <Balancer>
        <Comp
          className={cn(textVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      </Balancer>
    );
  }
);
Text.displayName = "Text";

export { Text, textVariants };
