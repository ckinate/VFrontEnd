import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { AppConsts } from '@shared/AppConsts';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { OnboardingVendorDto, UpsertBankAccountDto, UpsertContactChannelDto, UpsertContactPersonDto, UpsertDocumentDto, UpsertQuestionnaireDto, VendorsServiceProxy } from '@shared/service-proxies/service-proxies';
import { DateTime } from 'luxon';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { OnboardVendorUpdateDtoBaseResponse, ResourceUpdateRequestStatus, Result, UpdateVendorRequestStateDto, VendorUpdateRequestDto, VendorUpdateRequestDtoPaginatedList } from './vendorUpdateRequestsModel';
import { Observable } from 'rxjs';
import { result } from 'lodash-es';
import { OnboardingVendorQueryComponent } from '../onboarding-vendor-query/onboarding-vendor-query.component';

@Component({
  selector: 'app-vendor-update-requests',
  templateUrl: './vendor-update-requests.component.html',
  styleUrls: ['./vendor-update-requests.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class VendorUpdateRequestsComponent extends AppComponentBase implements OnInit {

  constructor(injector: Injector, private http: HttpClient, private _dateTimeService: DateTimeService, private _vendorsServiceProxy: VendorsServiceProxy) {
    super(injector);
  }
  
  @ViewChild('vendorUpdateDetailsModal', { static: true }) modal: ModalDirective;
  @ViewChild('queryVendorComp', { static: true }) queryVendorComp: OnboardingVendorQueryComponent;
  @ViewChild('rejectModal', { static: true }) rejectmodal: ModalDirective;
  @ViewChild('rejectNoteModal', { static: true }) rejectNoteModal: ModalDirective;


  getVendorUpdateRequestsUrl = `${AppConsts.onboardingGetVendorsUrl}${"/api/Onboardings/GetVendorUpdateRequests"}`;
  updateVendorRequestStateUrl = `${AppConsts.onboardingGetVendorsUrl}${"/api/Onboardings/UpdateVendorRequestState"}`;
  

  searchWord: string = "";
  status = ResourceUpdateRequestStatus.New;
  fieldSorted: string;
  
  statusList = {"All": "" as any, "New": ResourceUpdateRequestStatus.New, "Accepted": ResourceUpdateRequestStatus.Accepted, "Completed": ResourceUpdateRequestStatus.Completed, " Return": ResourceUpdateRequestStatus.Rejected }
  availableChangeTag = {"Official Information": "OfficialInformation", "Contacts Information": "ContactsInformation", "Channels Information": "ChannelsInformation", "Accounts Information":"AccountsInformation", "Questionnaires Information":"QuestionnairesInformation", "Documents Information": "DocumentsInformation" }
  public dateRange: DateTime[] = [
    this._dateTimeService.getStartOfDayForDate(
      this._dateTimeService.minusDays(this._dateTimeService.getStartOfDay(), 30)
    ),
    this._dateTimeService.getEndOfDayPlusDays(1)
  ];
  vendorUpdateRequestResultDto  = {
    items:[],
    pageNumber:1 ,
    totalPages: 1,
    totalCount: 1,
    pageSize: 10,
    hasPreviousPage: false,
    hasNextPage: false
  }
  vendorsUpdateRequestDataDto:VendorUpdateRequestDtoPaginatedList ={
    success: false as boolean,
    message: "" as string,
    validationErrors:[],
    result: {} as Result
  };
  allVendorsUpdateRequestDataDto :VendorUpdateRequestDtoPaginatedList ={
    success: false as boolean,
    message: "" as string,
    validationErrors:[] as any,
    result: {} as Result
  };
  variousStatus = {
    New :1,
    Accepted: 2,
    Queried:3,
    Completed: 4,
    Rejected: 5
  }
  isLoading: boolean = false;
  filterVendorDetails: VendorUpdateRequestDto[] = [];
  vendorChangeInfo: string;
  returnRemark: string = "";
  isSavingReject: boolean;
  returnId: number;
  returnNote: string ="";

  ngOnInit(): void {
    this.getVendorsUpdateRequestData();
  }




  getVendorsUpdateRequestService():Observable<VendorUpdateRequestDtoPaginatedList>{

    const reqHeader = new HttpHeaders({
     'Content-Type': 'application/json'
    });
    let queryParams = new HttpParams();
    queryParams = queryParams.append('SearchText',`${this.searchWord}`);
    queryParams = queryParams.append('StartDate',`${this._dateTimeService.getStartOfDayForDate(this.dateRange[0]).toISODate()}`);
    queryParams = queryParams.append('EndDate',`${this._dateTimeService.getEndOfDayForDate(this.dateRange[1]).toISODate()}`);
    queryParams = queryParams.append('Status',`${this.status}`);
    queryParams = queryParams.append('PageIndex',`${this. vendorUpdateRequestResultDto.pageNumber}`);
    queryParams = queryParams.append('PageSize', `${this. vendorUpdateRequestResultDto.pageSize}`);
  
    return this.http.get<VendorUpdateRequestDtoPaginatedList>(this.getVendorUpdateRequestsUrl, { headers: reqHeader, params:queryParams});

  }
  postupdateVendorRequestState(updateVendorRequestStateDto: UpdateVendorRequestStateDto): Observable<OnboardVendorUpdateDtoBaseResponse> {
    
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
     });
    
     return this.http.post<OnboardVendorUpdateDtoBaseResponse>(this.updateVendorRequestStateUrl,updateVendorRequestStateDto,{ headers: reqHeader});
    
  }
  


  getVendorsUpdateRequestData() {
    this.showMainSpinner();
    this.isLoading = true;
    this.getVendorsUpdateRequestService().subscribe(res => {
      this.vendorsUpdateRequestDataDto = res;
      this.allVendorsUpdateRequestDataDto = res;
      this.vendorUpdateRequestResultDto.totalPages = res.result.totalPages;
      this.vendorUpdateRequestResultDto.pageNumber = res.result.pageNumber;

      this.vendorUpdateRequestResultDto.totalCount = res.result.totalCount;
    
      this.vendorUpdateRequestResultDto.hasNextPage = res.result.hasNextPage;
      this.vendorUpdateRequestResultDto.hasPreviousPage = res.result.hasPreviousPage;
      this.isLoading = false;
      this.hideMainSpinner();
    }, error => {
      this.isLoading = false;
      this.hideMainSpinner();
    })

  }

  async search(event?: any) : Promise<void> {
    this. getVendorsUpdateRequestData();
  }

  async searchInit() {
    this.vendorUpdateRequestResultDto.pageNumber  = 1;
    this.vendorUpdateRequestResultDto.pageSize = 10;
    this.search()
  }

  onChange() {
    if (this.searchWord.length <=0) {
      this.searchInit()
    }
  }
  refresh(){
    //  window.location.reload();
    this. getVendorsUpdateRequestData();
  }
  changeSize(num: number) {
    this.vendorUpdateRequestResultDto.pageSize = num;
    this.vendorUpdateRequestResultDto.pageNumber = 1;
    this.getVendorsUpdateRequestData();
  }

  previousPage() {
    this.vendorUpdateRequestResultDto.pageNumber = Number(this.vendorUpdateRequestResultDto.pageNumber) -1;
    this.getVendorsUpdateRequestData();
  }

  nextPage() {
    this.vendorUpdateRequestResultDto.pageNumber = Number(this.vendorUpdateRequestResultDto.pageNumber) + 1;
    this.getVendorsUpdateRequestData();
  }

  async sort(field) {
    if (this.fieldSorted === field) {
        this.vendorsUpdateRequestDataDto.result.items = this.allVendorsUpdateRequestDataDto.result.items.sort((a, b) => {
        if (a[`${field}`] > b[`${field}`]) {
          return 1
        } else if (a[`${field}`] < b[`${field}`]) {
          return -1
        } else {
          return 0
        }
      });
      this.fieldSorted = null;
      return;
    }
    this.vendorsUpdateRequestDataDto.result.items= this.allVendorsUpdateRequestDataDto.result.items.sort((a,b) => {
      if (a[`${field}`] < b[`${field}`]) {
        return 1
      } else if (a[`${field}`] > b[`${field}`]) {
        return -1
      } else {
        return 0
      }
    })
    this.fieldSorted = field;
  }
  getSortClass(field) {
    return this.fieldSorted !== field ? 'fas fa-caret-down': 'fas fa-caret-up'
  }

  viewDetails(Id: number) {
    
    this.filterVendorDetails = [];
    this.filterVendorDetails = this.vendorsUpdateRequestDataDto.result.items.filter(e=>e.id == Id);
    this.modal.show();
    
  }
  closeModal(){
    this.modal.hide();
  }
  AcceptVendor(Id: number) {
    this.message.confirm(
      this.l("You want to Accept"),
              this.l("AreYouSure"),
              (isConfirmed)=>{
                  if(isConfirmed){
                      this.showMainSpinner();
                      let updateStatus :UpdateVendorRequestStateDto ={
                        requestId: Id,
                        status: ResourceUpdateRequestStatus.Accepted,
                          remark: ""
                      }
                    this.postupdateVendorRequestState(updateStatus).subscribe(res => {
                      
                      console.log(`The value of updateData is ${JSON.stringify(res)}`);
                      
                      let DataItem: OnboardingVendorDto = new OnboardingVendorDto();
                      DataItem.bankAccounts = [];
                      DataItem.contactChannels = [];
                      DataItem.contactPersons = [];
                      DataItem.documents = [];
                      DataItem.questionnaires = [];
                      
                      DataItem.id = res.result.id;
                      DataItem.companyName = res.result.companyName;
                      DataItem.categoryId = res.result.categoryId;
                      DataItem.categoryName = res.result.categoryName;
                      DataItem.code = res.result.code;
                      DataItem.country = res.result.country;
                      DataItem.email = res.result.email;
                      DataItem.fax = res.result.fax;
                      DataItem.includeLocalAccount = res.result.includeLocalAccount;
                      DataItem.incorporationDate = res.result.incorporationDate;
                      DataItem.isLock = res.result.isLock;
                      DataItem.isPublic = res.result.isPublic;
                      DataItem.mobilePhoneCallCode = res.result.mobilePhoneCallCode;
                      DataItem.mobilePhoneNumber = res.result.mobilePhoneNumber;
                      DataItem.officePhoneCallCode = res.result.officePhoneCallCode;
                      DataItem.officePhoneNumber = res.result.officePhoneNumber;
                      DataItem.registerAddress = res.result.registerAddress;
                      DataItem.registrationCertificateNumber = res.result.registrationCertificateNumber;
                      DataItem.status = res.result.status;
                      DataItem.subCategoryIds = res.result.subCategoryIds;
                      DataItem.subCategoryNames = res.result.subCategoryNames;
                      DataItem.taxIdentificationNumber = res.result.taxIdentificationNumber;
                      DataItem.useForeignAccount = res.result.useForeignAccount;
                      DataItem.website = res.result.website;

                      res.result.bankAccounts.forEach(i => {
                        let upsertBankAccountDto = new UpsertBankAccountDto();
                        upsertBankAccountDto.accountName = i.accountName;
                        upsertBankAccountDto.accountNumber = i.accountNumber;
                        upsertBankAccountDto.bankAddress = i.bankAddress;
                        upsertBankAccountDto.bankCode = i.bankCode;
                        upsertBankAccountDto.bankName = i.bankName;
                        upsertBankAccountDto.country = i.country;
                        upsertBankAccountDto.currencyCode = i.currencyCode;
                        upsertBankAccountDto.currencyName = i.currencyName;
                        upsertBankAccountDto.intermediaryAccountNumber = i.intermediaryAccountNumber;
                        upsertBankAccountDto.intermediaryBankName = i.intermediaryBankName;
                        upsertBankAccountDto.intermediarySortCode = i.intermediarySortCode;
                        upsertBankAccountDto.intermediarySwiftCode = i.intermediarySwiftCode;
                        upsertBankAccountDto.isLocalAccount = i.isLocalAccount;
                        upsertBankAccountDto.validated = i.validated;
                        
                        DataItem.bankAccounts.push(upsertBankAccountDto);
                      })

                      res.result.contactChannels.forEach(cont => {
                        let upsertContactChannelDto = new UpsertContactChannelDto();
                        upsertContactChannelDto.email = cont.email;
                        upsertContactChannelDto.mobilePhoneCallCode = cont.mobilePhoneCallCode;
                        upsertContactChannelDto.mobilePhoneNumber = cont.mobilePhoneNumber;
                        upsertContactChannelDto.type = cont.type

                        DataItem.contactChannels.push(upsertContactChannelDto);
                      })

                      res.result.contactPersons.forEach(p => {
                        let upsertContactPersonDto = new UpsertContactPersonDto();
                        upsertContactPersonDto.default = p.default;
                        upsertContactPersonDto.designation = p.designation;
                        upsertContactPersonDto.email = p.email;
                        upsertContactPersonDto.mobilePhoneCallCode = p.mobilePhoneCallCode;
                        upsertContactPersonDto.mobilePhoneNumber = p.mobilePhoneNumber;
                        upsertContactPersonDto.name = p.name;

                        DataItem.contactPersons.push(upsertContactPersonDto);
                      })

                      res.result.questionnaires.forEach(q => {
                        let upsertQuestionnaireDto = new UpsertQuestionnaireDto();
                        upsertQuestionnaireDto.compulsory = q.compulsory;
                        upsertQuestionnaireDto.question = q.question;
                        upsertQuestionnaireDto.questionId = q.questionId;
                        upsertQuestionnaireDto.response = q.response;
                        DataItem.questionnaires.push(upsertQuestionnaireDto);
                      })

                      res.result.documents.forEach(d => {
                        let upsertDocumentDto = new UpsertDocumentDto();
                        upsertDocumentDto.contentType = d.contentType;
                        upsertDocumentDto.fileData = d.fileData;
                        upsertDocumentDto.locationUrl = d.locationUrl;
                        upsertDocumentDto.size = d.size;
                        upsertDocumentDto.title = d.title;

                        DataItem.documents.push(upsertDocumentDto);
                      })

                      this._vendorsServiceProxy.acceptVendorUpdateRequestData( DataItem).subscribe((res) => {
                       
                        this.hideMainSpinner();
                        this.message.success("Sent Successfully for Approval");
                     
                        this.getVendorsUpdateRequestData();
                       
                      }, error => {
                        this.hideMainSpinner();
                        this.message.error(error.message)
                     })


                    }, error => {
                      this.hideMainSpinner();
                      this.message.error(error.message)
                     
                    })
                    
                      


                  }
              }
  )
    
  }
  Reject() {
    
    this.message.confirm(
      this.l("You want to Return"),
              this.l("AreYouSure"),
              (isConfirmed)=>{
                if (isConfirmed) {
                    this.isSavingReject = true
                      this.showMainSpinner();
                      let updateStatus :UpdateVendorRequestStateDto ={
                        requestId: this.returnId,
                        status: ResourceUpdateRequestStatus.Rejected,
                          remark: this.returnRemark
                      }
                    this.postupdateVendorRequestState(updateStatus).subscribe(res => {
                      
                      this.getVendorsUpdateRequestData();
                      this.hideMainSpinner();
                      this.isSavingReject = false;
                      this.returnRemark = "";
                      this.closeRejectModal();
                      this.message.success('Returned Successfully');

                    }, error => {
                      this.isSavingReject = false;
                      this.hideMainSpinner();
                    })
                    
                      


                  }
              }
  )
    
  }
  closeRejectModal() {
    this.rejectmodal.hide();
  }
  openRejectModal(Id: number) {
    this.returnId = Id;
    this.rejectmodal.show();
  }
  openReturnNoteModal(note:string) {
    this.returnNote = note;
    this.rejectNoteModal.show();
  }
  closeReturnNoteModal() {
    this.rejectNoteModal.hide();
  }
  CompleteVendorUpdateRequest(Id: number) {
    
    this.message.confirm(
      this.l("You want to Complete Update"),
              this.l("AreYouSure"),
              (isConfirmed)=>{
                  if(isConfirmed){
                      this.showMainSpinner();
                      let updateStatus :UpdateVendorRequestStateDto ={
                        requestId: Id,
                        status: ResourceUpdateRequestStatus.Completed,
                          remark: ""
                      }
                    this.postupdateVendorRequestState(updateStatus).subscribe(res => {
                      
                      this.getVendorsUpdateRequestData();
                      this.hideMainSpinner();
                      this.message.success('Completed Successfully');

                    }, error => {
                      this.hideMainSpinner();
                    })
                    
                      


                  }
              }
  )
    
  }

}
