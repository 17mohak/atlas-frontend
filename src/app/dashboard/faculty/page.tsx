import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus } from "lucide-react"
import { FacultyTable } from "@/components/dashboard/faculty-table"
import { TableSkeleton } from "@/components/dashboard/table-skeleton"
import { getFaculty } from "@/services/faculty.service"

async function FacultyData() {
  const data = await getFaculty()
  return <FacultyTable data={data} />
}

export default function FacultyPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-indigo-950 dark:text-indigo-50">Faculty Management</h2>
        <div className="flex items-center space-x-2">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Faculty
          </Button>
        </div>
      </div>
      
      <Card className="border-indigo-100 dark:border-indigo-900/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-indigo-900 dark:text-indigo-100">Faculty Roster</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4 space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, department, or email..."
                className="pl-8 bg-white dark:bg-zinc-950"
              />
            </div>
            <Button variant="outline" className="border-indigo-200 dark:border-indigo-800">
              Filters
            </Button>
          </div>
          
          <Suspense fallback={<TableSkeleton />}>
            <FacultyData />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}