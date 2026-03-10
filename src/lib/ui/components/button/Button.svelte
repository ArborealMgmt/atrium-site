<script>
  import { cva } from 'class-variance-authority';
  let { children, variant = 'default', size = 'md' } = $props();

  const variants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50',
    {
      variants: {
        variant: {
          default: 'bg-primary text-primary-foreground hover:opacity-90',
          secondary: 'bg-secondary text-secondary-foreground hover:opacity-90',
          destructive: 'bg-destructive text-destructive-foreground',
          outline: 'border border-border bg-background hover:bg-accent',
          ghost: 'hover:bg-accent',
          link: 'underline underline-offset-4 text-primary',
        },
        size: {
          sm: 'h-9 px-3 rounded-md',
          md: 'h-10 px-4 rounded-md',
          lg: 'h-11 px-6 rounded-lg',
        },
      },
      defaultVariants: { variant: 'default', size: 'md' },
    }
  );
</script>

<button class={variants({ variant, size })}>{@render children?.()}</button>
