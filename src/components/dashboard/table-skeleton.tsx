import { Skeleton } from "@/components/ui/skeleton"

export function TableSkeleton() {
  return (
    <div className="w-full">
      <div className="rounded-md border border-indigo-100 dark:border-indigo-900 overflow-hidden">
        <div className="h-12 w-full bg-indigo-50/50 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-900" />
        <div className="divide-y divide-indigo-50 dark:divide-indigo-900/50 bg-white dark:bg-zinc-950">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center px-6 py-4 space-x-4">
              <Skeleton className="h-4 w-[20%]" />
              <Skeleton className="h-4 w-[25%]" />
              <Skeleton className="h-4 w-[35%]" />
              <Skeleton className="h-6 w-[10%] rounded-full" />
              <Skeleton className="h-8 w-8 ml-auto rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}