import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "default" | "outline";
  className?: string;
  children: React.ReactNode;
};

export function Button({
  asChild = false,
  variant = "default",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "",
    outline: "",
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      className: `${base} ${variants[variant]} ${className} ${(children as React.ReactElement<any>).props.className || ""}`,
      ...props,
    });
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}