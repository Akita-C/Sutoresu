import { ComponentProps } from "react";
import { Button, buttonVariants } from "../../ui/button";
import styles from "./spring-button.module.css";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

type SpringButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

export default function SpringButton({ children, className, ...props }: SpringButtonProps) {
  return (
    <Button className={cn(styles.springButton, className)} {...props}>
      {children}
    </Button>
  );
}
