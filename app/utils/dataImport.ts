import Papa from "papaparse"

export interface NPARecord {
  // Basic Account Info
  NPA_TYPE: string
  ACTYP: string
  ACC_CODE: string
  BRANCH_CODE: string

  // Customer Details
  NAME: string
  LIMIT: number
  ADDRESS: string
  MOBILE_NUMBER: string

  // Guarantor Information (1-5)
  G_NAME_1: string
  ADD1_GUAR1: string
  MOBILE_NO1: string
  G_NAME_2: string
  ADD1_GUAR2: string
  MOBILE_NO2: string
  G_NAME_3: string
  ADD1_GUAR3: string
  MOBILE_NO3: string
  G_NAME_4: string
  ADD1_GUAR4: string
  MOBILE_NO4: string
  G_NAME_5: string
  ADD1_GUAR5: string
  MOBILE_NO5: string

  // Financial Details
  OVERDRAW: number
  OP_BAL: number
  OPDATE: string
  RENEW_DATE: string
  F_INST_DATE: string
  INSDUE: number
  INSTAMT: number
  NOINST: number
  NO_ODMTH: number
  OVER_AMT: number
  INST_PEND_FROM: string
  NPA_DATE: string

  // Quarterly Details
  QTR1_INT: number
  QTR2_INT: number
  QTR3_INT: number
  QTR4_INT: number
  QTR1_CR: number
  QTR2_CR: number
  QTR3_CR: number
  QTR4_CR: number

  // Provision Details
  SEC_PROV_RT: number
  PROV_AMT: number
  UN_SEC_PROV_RT: number
  UN_SEC_PROV: number

  // Dates and Status
  LAS_DATE: string
  LST_CR_DATE: string
  LST_OD_DATE: string

  // Type Information
  INSTYP: string
  EMI_TYPE: string
  SEC_UNSEC_TYP: string

  // Additional Details
  TOT_CREDIT: number
  DESCRIP: string
  ACDESC: string
  REASONS: string
  INT_PROV: number
  CO_SEC_AMT: number
  P_SECU_AMT: number
  BANKNAME: string
  PRIN_SEC_AMT: number
  PRIN_DESC1: string
  CONTACT_NO: string
  MSNO: string
  DESC1: string
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
            // Convert string values to numbers for numeric fields
            LIMIT: Number(record.LIMIT),
            OVERDRAW: Number(record.OVERDRAW),
            OP_BAL: Number(record.OP_BAL),
            INSDUE: Number(record.INSDUE),
            INSTAMT: Number(record.INSTAMT),
            NOINST: Number(record.NOINST),
            NO_ODMTH: Number(record.NO_ODMTH),
            OVER_AMT: Number(record.OVER_AMT),
            QTR1_INT: Number(record.QTR1_INT),
            QTR2_INT: Number(record.QTR2_INT),
            QTR3_INT: Number(record.QTR3_INT),
            QTR4_INT: Number(record.QTR4_INT),
            QTR1_CR: Number(record.QTR1_CR),
            QTR2_CR: Number(record.QTR2_CR),
            QTR3_CR: Number(record.QTR3_CR),
            QTR4_CR: Number(record.QTR4_CR),
            SEC_PROV_RT: Number(record.SEC_PROV_RT),
            PROV_AMT: Number(record.PROV_AMT),
            UN_SEC_PROV_RT: Number(record.UN_SEC_PROV_RT),
            UN_SEC_PROV: Number(record.UN_SEC_PROV),
            TOT_CREDIT: Number(record.TOT_CREDIT),
            INT_PROV: Number(record.INT_PROV),
            CO_SEC_AMT: Number(record.CO_SEC_AMT),
            P_SECU_AMT: Number(record.P_SECU_AMT),
            PRIN_SEC_AMT: Number(record.PRIN_SEC_AMT),
          })),
        )
      },
      error: (error) => {
        reject(error)
      },
    })
  })
}

