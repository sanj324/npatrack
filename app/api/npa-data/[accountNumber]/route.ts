import { NextResponse } from "next/server"
import type { NPARecord } from "@/app/utils/dataImport"

const npaData: NPARecord[] = []

export async function GET(request: Request, { params }: { params: { accountNumber: string } }) {
  const accountNumber = params.accountNumber
  const account = npaData.find((acc) => acc.ACC_CODE === accountNumber)

  if (account) {
    return NextResponse.json(account)
  } else {
    return NextResponse.json({ error: "Account not found" }, { status: 404 })
  }
}

export async function POST(request: Request) {
  const data = await request.json()
  const existingIndex = npaData.findIndex((acc) => acc.ACC_CODE === data.ACC_CODE)

  if (existingIndex !== -1) {
    npaData[existingIndex] = data
  } else {
    npaData.push(data)
  }

  return NextResponse.json({ success: true })
}

