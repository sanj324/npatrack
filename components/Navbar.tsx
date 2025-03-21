import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-blue-800">
            Co-op Bank MIS
          </Link>
          <div className="flex flex-wrap space-x-2 space-y-2 sm:space-y-0">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/data-entry">
              <Button variant="ghost">Data Entry</Button>
            </Link>
            <Link href="/reports">
              <Button variant="ghost">Reports</Button>
            </Link>
            <Link href="/advanced-features">
              <Button variant="ghost">Advanced Features</Button>
            </Link>
            <Link href="/compliance">
              <Button variant="ghost">Compliance</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

