import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60 disabled:pointer-events-none";

const variants = {
  primary: "bg-brand text-white hover:bg-brand-hover active:bg-brand-hover",
  secondary: "bg-surface text-ink border border-line hover:border-ink/30 hover:bg-white",
  ghost: "text-ink hover:bg-ink/5",
  dark: "bg-night text-white hover:bg-night/85",
} as const;

const sizes = {
  md: "h-11 px-6 text-[0.95rem]",
  lg: "h-13 px-8 text-base",
  sm: "h-9 px-4 text-sm",
} as const;

export type ButtonStyleProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function buttonClasses({ variant = "primary", size = "md" }: ButtonStyleProps = {}) {
  return cn(base, variants[variant], sizes[size]);
}

type ButtonProps = ButtonStyleProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string };

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={cn(buttonClasses({ variant, size }), className)} {...props} />;
}
