export interface VendorUpdateRequestDtoPaginatedList {
    success: boolean
    message: string
    validationErrors: any[]
    result: Result
  }

  export interface Result {
    items: VendorUpdateRequestDto[]
    pageNumber: number
    totalPages: number
    totalCount: number
    hasPreviousPage: boolean
    hasNextPage: boolean
  }



export interface VendorUpdateRequestDto {
    id: number
    resourceType: string
    resourceId: number
    resourceDescription: string
    note: string
    entryDate: string
    lastProcessDate: any
    requesterName: string
    requesterEmail: string
    status: number
    availableChangeTags: string[]
    officialInformation: OfficialInformation
    contactsInformation: ContactsInformation
    channelsInformation: ChannelsInformation
    accountsInformation: AccountsInformation
    questionsInformation: QuestionsInformation
    documentsInformation: DocumentsInformation
}

export interface OfficialInformation {
    changeTag: string
    newDetail: NewDetailOfficialInformation
    oldDetail: OldDetailOfficialInformation
    isNew: boolean
    modify: boolean
}
  
export interface NewDetailOfficialInformation {
    id: number
    code: string
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
    email: string
    fax: string
    website: string
    categoryId: number
    categoryName: string
    subCategoryIds: string
    subCategoryNames: string
    useForeignAccount: boolean
    isPublic: boolean
    isLock: boolean
    includeLocalAccount: boolean
    dueDiligenceCompleted: boolean
    canUpdate: boolean
    status: number
    contactPersons: UpsertContactPersonDto[]
    contactChannels: UpsertContactChannelDto[]
    bankAccounts: UpsertBankAccountDto[]
    questionnaires: UpsertQuestionnaireDto[]
    documents: UpsertDocumentDto[]
}

export interface OldDetailOfficialInformation {
    id: number
    code: string
    companyName: string
    registrationCertificateNumber: string
    incorporationDate: string
    registerAddress: string
    taxIdentificationNumber: any
    country: string
    officePhoneCallCode: any
    officePhoneNumber: any
    mobilePhoneCallCode: any
    mobilePhoneNumber: any
    email: any
    fax: any
    website: any
    categoryId: any
    categoryName: any
    subCategoryIds: string
    subCategoryNames: string
    useForeignAccount: boolean
    isPublic: boolean
    isLock: boolean
    includeLocalAccount: boolean
    dueDiligenceCompleted: boolean
    canUpdate: boolean
    status: number
    contactPersons: UpsertContactPersonDto[]
    contactChannels: UpsertContactChannelDto[]
    bankAccounts: UpsertBankAccountDto[]
    questionnaires: UpsertQuestionnaireDto[]
    documents: UpsertDocumentDto[]
}

export interface ContactsInformation {
    changeTag: string
    newDetail: NewDetailContactsInformation[]
    oldDetail: OldDetailContactsInformation[]
    isNew: boolean
    modify: boolean
}

export interface NewDetailContactsInformation {
    name: string
    email: string
    mobilePhoneCallCode: string
    mobilePhoneNumber: string
    designation: string
    default: boolean
  }
  
  export interface OldDetailContactsInformation {
    name: string
    email: string
    mobilePhoneCallCode: string
    mobilePhoneNumber: string
    designation: string
    default: boolean
}

export interface ChannelsInformation {
    changeTag: string
    newDetail: NewDetailChannelsInformation[]
    oldDetail: OldDetailChannelsInformation[]
    isNew: boolean
    modify: boolean
  }
  
  export interface NewDetailChannelsInformation {
    type: number
    email: string
    mobilePhoneCallCode: string
    mobilePhoneNumber: string
  }
  
  export interface OldDetailChannelsInformation {
    type: number
    email: string
    mobilePhoneCallCode: string
    mobilePhoneNumber: string
}
  
export interface AccountsInformation {
    changeTag: string
    newDetail: NewDetailAccountsInformation[]
    oldDetail: OldDetailAccountsInformation[]
    isNew: boolean
    modify: boolean
  }
  
  export interface NewDetailAccountsInformation {
    bankName: string
    bankCode: string
    country: string
    bankAddress: string
    accountName: string
    accountNumber: string
    isLocalAccount: boolean
    validated: boolean
    currencyName: any
    currencyCode: any
    intermediaryBankName: string
    intermediaryAccountNumber: string
    intermediarySortCode: string
    intermediarySwiftCode: string
  }
  
  export interface OldDetailAccountsInformation {
    bankName: string
    bankCode: string
    country: string
    bankAddress: string
    accountName: string
    accountNumber: string
    isLocalAccount: boolean
    validated: boolean
    currencyName: any
    currencyCode: any
    intermediaryBankName: string
    intermediaryAccountNumber: string
    intermediarySortCode: string
    intermediarySwiftCode: string
}


  
  export interface DocumentsInformation {
    changeTag: string
    newDetail: NewDetailDocumentsInformation[]
    oldDetail: OldDetailDocumentsInformation[]
    isNew: boolean
    modify: boolean
  }
  
  export interface NewDetailDocumentsInformation {
    title: string
    fileData: any
    contentType: string
    size: number
    documentId: number
    locationUrl: string
    canUpdate: boolean
  }
  
  export interface OldDetailDocumentsInformation {
    title: string
    fileData: any
    contentType: string
    size: number
    documentId: any
    locationUrl: string
    canUpdate: boolean
}
export interface QuestionsInformation {
    changeTag: string
    newDetail: NewDetailQuestionsInformation[]
    oldDetail:  OldDetailQuestionsInformation[]
    isNew: boolean
    modify: boolean
}
export interface NewDetailQuestionsInformation {
    questionId: number;
    question: string;
    response: string;
    compulsory: boolean;
  }

export interface OldDetailQuestionsInformation {
    questionId: number;
    question: string;
    response: string;
    compulsory: boolean;
}



export interface UpdateVendorRequestStateDto {
    requestId: number;
  status: ResourceUpdateRequestStatus;
  remark: string
}

export enum ResourceUpdateRequestStatus {
    New = 1,
    Accepted = 2,
    Queried = 3,
    Completed = 4,
    Rejected = 5
}
export interface UpdateVendorRequestStateDto {
    requestId: number;
    status: ResourceUpdateRequestStatus;
}


export interface OnboardVendorUpdateDtoBaseResponse {
    success: boolean
    message: string
    validationErrors: any[]
    result: OnboardVendorDto
  }

 


export interface OnboardVendorDto {
    id: number;
    code: string;
    companyName: string;
    registrationCertificateNumber: string;
    incorporationDate: any;
    registerAddress: string;
    taxIdentificationNumber: string | null;
    country: string;
    officePhoneCallCode: string | null;
    officePhoneNumber: string | null;
    mobilePhoneCallCode: string | null;
    mobilePhoneNumber: string | null;
    email: string | null;
    fax: string | null;
    website: string | null;
    categoryId: number | null;
    categoryName: string | null;
    subCategoryIds: string;
    subCategoryNames: string;
    useForeignAccount: boolean;
    isPublic: boolean;
    isLock: boolean;
    includeLocalAccount: boolean;
    dueDiligenceCompleted: boolean;
    canUpdate: boolean;
    status: OnboardingStatus;
    contactPersons: UpsertContactPersonDto[];
    contactChannels: UpsertContactChannelDto[];
    bankAccounts: UpsertBankAccountDto[];
    questionnaires: UpsertQuestionnaireDto[];
    documents: UpsertDocumentDto[];
}

export interface UpsertContactPersonDto {
    name: string;
    email: string;
    mobilePhoneCallCode: string;
    mobilePhoneNumber: string;
    designation: string;
    default: boolean;
}

export interface UpsertContactChannelDto {
    type: ChannelType;
    email: string;
    mobilePhoneCallCode: string;
    mobilePhoneNumber: string;
}

export interface UpsertBankAccountDto {
    bankName: string;
    bankCode: string;
    country: string;
    bankAddress: string | null;
    accountName: string;
    accountNumber: string;
    isLocalAccount: boolean;
    validated: boolean;
    currencyName: string | null;
    currencyCode: string | null;
    intermediaryBankName: string | null;
    intermediaryAccountNumber: string | null;
    intermediarySortCode: string | null;
    intermediarySwiftCode: string | null;
}

export interface UpsertQuestionnaireDto {
    questionId: number;
    question: string;
    response: string;
    compulsory: boolean;
}

export interface UpsertDocumentDto {
    title: string;
    fileData: string;
    contentType: string;
    size: number;
    documentId: number | null;
    locationUrl: string;
    canUpdate: boolean;
}

export enum OnboardingStatus {
    NotStarted = 1,
    Submitted = 2,
    Processing = 3,
    Queried = 4,
    Completed = 5
}
export enum ChannelType {
    Email = 1,
    Phone = 2
}