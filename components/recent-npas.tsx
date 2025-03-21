import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { NPARecord } from "@/app/utils/dataImport"

interface RecentNPAsProps {
  data: NPARecord[]
}

export function RecentNPAs({ data }: RecentNPAsProps) {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const recentNPAs = data
    .filter((npa) => new Date(npa.NPA_DATE) >= thirtyDaysAgo)
    .sort((a, b) => new Date(b.NPA_DATE).getTime() - new Date(a.NPA_DATE).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {recentNPAs.map((npa) => (
        <div key={npa.ACC_CODE} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{npa.NAME[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{npa.NAME}</p>
            <p className="text-sm text-muted-foreground">{npa.ACC_CODE}</p>
          </div>
          <div className="ml-auto font-medium">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(npa.OVER_AMT)}
          </div>
        </div>
      ))}
    </div>
  )
}

