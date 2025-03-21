export interface NPADataHeaders {
  // Basic Account Information
  ACC_CODE: string // Account Number
  NAME: string // Account Holder Name
  ACTYP: string // Account Type (TL/CC/OD etc)
  BRANCH_CODE: string // Branch Code
  ACDESC: string // Account Description

  // Financial Details
  LIMIT: number // Sanctioned Limit
  OP_BAL: number // Opening Balance
  OPDATE: string // Opening Date
  OVERDRAW: number // Overdrawn Amount
  OVER_AMT: number // Overdue Amount
  NO_ODMTH: number // Number of Overdue Months

  // NPA Classification
  NPA_TYPE: string // Sub-standard/Doubtful/Loss
  NPA_DATE: string // Date of NPA Classification
  REASONS: string // Reasons for NPA

  // Installment Details
  INSTYP: string // Installment Type
  INSTAMT: number // Installment Amount
  NOINST: number // Number of Installments
  INSDUE: number // Installment Due
  F_INST_DATE: string // First Installment Date
  INST_PEND_FROM: string // Installments Pending From

  // Security Details
  SEC_UNSEC_TYP: string // Secured/Unsecured Type
  PRIN_SEC_AMT: number // Principal Security Amount
  CO_SEC_AMT: number // Collateral Security Amount
  P_SECU_AMT: number // Primary Security Amount
  PRIN_DESC1: string // Principal Security Description

  // Customer Details
  ADDRESS: string // Customer Address
  MOBILE_NUMBER: string // Customer Mobile Number
  CONTACT_NO: string // Alternate Contact Number

  // Guarantor Information
  G_NAME_1: string // Guarantor 1 Name
  ADD1_GUAR1: string // Guarantor 1 Address
  MOBILE_NO1: string // Guarantor 1 Mobile
  G_NAME_2: string // Guarantor 2 Name
  ADD1_GUAR2: string // Guarantor 2 Address
  MOBILE_NO2: string // Guarantor 2 Mobile

  // Dates
  RENEW_DATE: string // Renewal Date
  LAS_DATE: string // Last Action Date
  LST_CR_DATE: string // Last Credit Date
  LST_OD_DATE: string // Last Overdue Date

  // Quarterly Details
  QTR1_INT: number // Quarter 1 Interest
  QTR2_INT: number // Quarter 2 Interest
  QTR3_INT: number // Quarter 3 Interest
  QTR4_INT: number // Quarter 4 Interest
  QTR1_CR: number // Quarter 1 Credit
  QTR2_CR: number // Quarter 2 Credit
  QTR3_CR: number // Quarter 3 Credit
  QTR4_CR: number // Quarter 4 Credit

  // Provision Details
  SEC_PROV_RT: number // Secured Provision Rate
  PROV_AMT: number // Provision Amount
  UN_SEC_PROV_RT: number // Unsecured Provision Rate
  UN_SEC_PROV: number // Unsecured Provision
  INT_PROV: number // Interest Provision

  // Additional Details
  TOT_CREDIT: number // Total Credit
  DESCRIP: string // Description
  BANKNAME: string // Bank Name
  MSNO: string // MS Number
  DESC1: string // Additional Description
}

export const columnGroups = {
  basicInfo: {
    label: "Basic Account Information",
    columns: ["ACC_CODE", "NAME", "ACTYP", "BRANCH_CODE", "ACDESC"],
  },
  financial: {
    label: "Financial Details",
    columns: ["LIMIT", "OP_BAL", "OPDATE", "OVERDRAW", "OVER_AMT", "NO_ODMTH"],
  },
  npaClass: {
    label: "NPA Classification",
    columns: ["NPA_TYPE", "NPA_DATE", "REASONS"],
  },
  installment: {
    label: "Installment Details",
    columns: ["INSTYP", "INSTAMT", "NOINST", "INSDUE", "F_INST_DATE", "INST_PEND_FROM"],
  },
  security: {
    label: "Security Details",
    columns: ["SEC_UNSEC_TYP", "PRIN_SEC_AMT", "CO_SEC_AMT", "P_SECU_AMT", "PRIN_DESC1"],
  },
  customer: {
    label: "Customer Details",
    columns: ["ADDRESS", "MOBILE_NUMBER", "CONTACT_NO"],
  },
  guarantor: {
    label: "Guarantor Information",
    columns: ["G_NAME_1", "ADD1_GUAR1", "MOBILE_NO1", "G_NAME_2", "ADD1_GUAR2", "MOBILE_NO2"],
  },
  dates: {
    label: "Important Dates",
    columns: ["RENEW_DATE", "LAS_DATE", "LST_CR_DATE", "LST_OD_DATE"],
  },
  quarterly: {
    label: "Quarterly Details",
    columns: ["QTR1_INT", "QTR2_INT", "QTR3_INT", "QTR4_INT", "QTR1_CR", "QTR2_CR", "QTR3_CR", "QTR4_CR"],
  },
  provision: {
    label: "Provision Details",
    columns: ["SEC_PROV_RT", "PROV_AMT", "UN_SEC_PROV_RT", "UN_SEC_PROV", "INT_PROV"],
  },
  additional: {
    label: "Additional Details",
    columns: ["TOT_CREDIT", "DESCRIP", "BANKNAME", "MSNO", "DESC1"],
  },
}

export const columnTypes: Record<string, "string" | "number" | "date"> = {
  ACC_CODE: "string",
  NAME: "string",
  ACTYP: "string",
  LIMIT: "number",
  OVER_AMT: "number",
  NPA_DATE: "date",
  // ... add types for all columns
}

