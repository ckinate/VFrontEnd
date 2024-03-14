
export interface InvitationDto {
    success: boolean
    message: string
    validationErrors: any
    result: Result[]
  }

  export interface Result {
    code: string
    companyName: string
    adminName: string
    adminEmail: string
    entryDate: string
    used: boolean
    usedDate?: string
    id: number
    created: string
    createdBy: any
    lastModified: string
    lastModifiedBy: any
  }

  export interface CreateInvitationDto {
    companyName: string | null;
    adminName: string | null;
    adminEmail: string | null;
    hash: string | null;
}

export enum InvitationUsedSearch {
    All = 0,
    Used = 2,
    Unused = 3
}

export interface BaseResponse {
    success: boolean;
    message: string;
    validationErrors: string[] | null;
    result: string;
}
export interface UseInvitationDto {
    code: string | null;
}
