import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-indigo-100/50 dark:bg-indigo-900/30", className)}
      {...props}
    />
  )
}

export { Skeleton }