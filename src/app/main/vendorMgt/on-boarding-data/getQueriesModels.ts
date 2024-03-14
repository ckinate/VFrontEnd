
export interface QueryDto {
    success: boolean
    message: string
    validationErrors: any
    result: Result[]
  }

  export interface BaseDto {
    id: number | null;
    created: string;
    createdBy: string | null;
    lastModified: string | null;
    lastModifiedBy: string | null;
}

export interface Result extends BaseDto {
    resourceType: string;
    resourceReference: string | null;
    queryMessage: string | null;
    queryInitiator: string | null;
    entryDate: string;
    queryTo: string | null;
    queryResponse: string | null;
    isPending: boolean;
    responseDate: string | null;
    vendorName: string | null;
    vendorCode: string | null;
}

export enum ResourceType {
    Vendor = 1
}
