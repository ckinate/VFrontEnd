



  export interface OnboardVendorDto {
    success: boolean
    message: string
    validationErrors: any
    result: Result
  }

  export interface Result {
    items: Item[]
    pageNumber: number
    totalPages: number
    totalCount: number
    hasPreviousPage: boolean
    hasNextPage: boolean
  }

  export interface Item {
    id: number
    companyName: string
    registrationCertificateNumber: string
    incorporationDate: string
    registerAddress: string
    taxIdentificationNumber: string
    country: string
    officePhoneCallCode: string
    officePhoneNumber: string
    mobilePhoneCallCode: string
    mobilePhoneNumber: string
    code:string
    email: string
    fax: string
    website: string
    categoryId: number
    categoryName: string
    subCategoryIds: string
    subCategoryNames: string
    useForeignAccount: boolean
    isPublic : boolean
    isLock: boolean
    includeLocalAccount:boolean
    status: OnboardingStatus
    created: any
    createdBy: string
    lastModifiedBy: string
    lastModified: any
    contactPersons: ContactPerson[]
    contactChannels: ContactChannel[]
    bankAccounts: BankAccount[]
    questionnaires: Questionnaire[]
    documents: Document[]
  }

  export interface ContactPerson {
    name: string
    email: string
    mobilePhoneCallCode: string
    mobilePhoneNumber: string
    designation: string
    default: boolean
  }

  export interface ContactChannel {
    type: number
    email: string
    mobilePhoneCallCode: string
    mobilePhoneNumber: string
  }

  export interface BankAccount {
    bankName: string
    bankCode: string
    country: string
    bankAddress: string
    accountName: string
    accountNumber: string
    isLocalAccount: boolean
    validated: boolean
    currencyName: string | null
    currencyCode: string | null
    intermediaryBankName: string | null
    intermediaryAccountNumber: string | null
    intermediarySortCode: string | null
    intermediarySwiftCode:string | null
  }

  export interface Questionnaire {
    questionId: number
    question: string
    response: string
    compulsory: boolean
  }
  export interface Document {
    title: string
    fileData: any
    contentType: string
    size: number
    documentId: number
    locationUrl: string
  }


export interface CreateQueryDto {
    resourceReference: string | null;
    queryMessage: string | null;
    queryInitiator: string | null;
    hash: string | null;
    resourceType :ResourceType;
}

export interface ChangeVendorStateDto {
    vendorId: number;
    status: OnboardingStatus;
}

export enum OnboardingStatus {
    NotStarted = 1,
    Submitted = 2,
    Processing = 3,
    Queried = 4,
    Completed = 5
}

export enum ResourceType {
    Vendor = 1
}
// export interface UpdateVendorDto {
//     vendorId: number;
//     vendorCode: string;
// }
export interface UpdateVendorDto {
    vendorId: number;
    vendorCode: string | null;
    onlyStatus: boolean;
    status: OnboardingStatus | null;
}

export interface LockUserDto {
    vendorId: number;
    lock: boolean;
}

export interface ReplacementInvitationDto {
  vendorId: number;
  adminName: string | null;
  adminEmail: string | null;
  hash: string | null;
}

export interface UpdateDueDeligenceDto {
  vendorId: number;
  dueDeligenceCompleted: boolean;
}



