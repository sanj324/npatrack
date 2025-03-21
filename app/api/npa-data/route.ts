import { NextResponse } from "next/server"
import type { NPARecord } from "@/app/utils/dataImport"

// This is a temporary solution to store data between requests
let npaData: NPARecord[] = []

export async function GET() {
  return NextResponse.json(npaData)
}

export async function POST(request: Request) {
  const data = await request.json()
  npaData = data
  return NextResponse.json({ success: true })
}

