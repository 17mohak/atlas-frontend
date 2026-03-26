import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, MapPin, Layers, LayoutDashboard } from "lucide-react"
import { RoomsTable } from "@/components/dashboard/rooms-table"
import { TableSkeleton } from "@/components/dashboard/table-skeleton"
import { getRooms } from "@/services/rooms.service"

async function RoomsData() {
  const data = await getRooms()
  return <RoomsTable data={data} />
}

export default function RoomsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-indigo-950 dark:text-indigo-50">Room Management</h2>
        <div className="flex items-center space-x-2">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Room
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3 mb-4">
        <Card className="border-indigo-100 dark:border-indigo-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-900 dark:text-indigo-100">Total Rooms</CardTitle>
            <Layers className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-950 dark:text-indigo-50">142</div>
            <p className="text-xs text-muted-foreground">+3 added this month</p>
          </CardContent>
        </Card>
        <Card className="border-indigo-100 dark:border-indigo-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-900 dark:text-indigo-100">Total Capacity</CardTitle>
            <MapPin className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-950 dark:text-indigo-50">5,840</div>
            <p className="text-xs text-muted-foreground">Seats across campus</p>
          </CardContent>
        </Card>
        <Card className="border-indigo-100 dark:border-indigo-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-900 dark:text-indigo-100">Labs</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-950 dark:text-indigo-50">24</div>
            <p className="text-xs text-muted-foreground">Specialized facilities</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-indigo-100 dark:border-indigo-900/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-indigo-900 dark:text-indigo-100">Campus Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4 space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by room name, building, or type..."
                className="pl-8 bg-white dark:bg-zinc-950"
              />
            </div>
            <Button variant="outline" className="border-indigo-200 dark:border-indigo-800">
              Filter by Type
            </Button>
          </div>
          
          <Suspense fallback={<TableSkeleton />}>
            <RoomsData />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}