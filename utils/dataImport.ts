import Papa from "papaparse"

export interface NPARecord {
  accountNo: string
  outstandingAmount: number
  daysPastDue: number
  npaCategory: string
  accountType: string
  interestRate: number
  lastPaymentDate: string
}

export async function importNPAData(file: File): Promise<NPARecord[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const data = results.data as NPARecord[]
        resolve(
          data.map((record) => ({
            ...record,
            outstandingAmount: Number(record.outstandingAmount),
            daysPastDue: Number(record.daysPastDue),
            interestRate: Number(record.interestRate),
          })),
        )
      },
      error: (error) => {
        reject(error)
      },
    })
  })
}

