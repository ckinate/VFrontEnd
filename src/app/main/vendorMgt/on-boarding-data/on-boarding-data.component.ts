import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import {  DocumentServiceProxy, OnboardingVendorDto, VendorsServiceProxy } from '@shared/service-proxies/service-proxies';
import { DateTime } from 'luxon';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { BaseResponse } from '../vendor-invitation/invitationModel';
import { QueryDto, ResourceType } from './getQueriesModels';
import { OnboardingVendorQueryComponent } from './onboarding-vendor-query/onboarding-vendor-query.component';
import { ChangeVendorStateDto, CreateQueryDto, Item, LockUserDto, OnboardingStatus, OnboardVendorDto, ReplacementInvitationDto, Result, UpdateVendorDto } from './onboardingModel';
import { Table } from 'primeng';
import { NgForm } from '@angular/forms';
import { FileDownloadService } from '@shared/utils/file-download.service';

declare let html2pdf: any;


@Component({
  selector: 'app-on-boarding-data',
  templateUrl: './on-boarding-data.component.html',
  styleUrls: ['./on-boarding-data.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class OnBoardingDataComponent extends AppComponentBase implements OnInit, AfterViewInit {

  constructor(injector: Injector, private http: HttpClient, private _dateTimeService: DateTimeService, private _vendorsServiceProxy: VendorsServiceProxy, private _Documentservice: DocumentServiceProxy,
    private _fileDownloadService: FileDownloadService) {
    super(injector);
  }

  @ViewChild('vendorDetailsModal', { static: true }) modal: ModalDirective;
  @ViewChild('queryVendor', { static: true }) queryModal: ModalDirective;
  @ViewChild('VendorQueryResponse', { static: true }) VendorQueryResponse: ModalDirective;
  @ViewChild('uploadDocumentModal', { static: true }) uploadDocumentModal: ModalDirective;
  @ViewChild('queryVendorComp', { static: true }) queryVendorComp: OnboardingVendorQueryComponent;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('sendAdmainReplacement', { static: true }) adminReplaceModal: ModalDirective;


  options1 = {
    margin: 1,
    filename: 'vendor_details.pdf',
    image: {
      type: 'jpeg',
      quality: '0.90',
    },
    html2canvas: {
      scale: 2,
      dpi: 192,
      letterRendering: true
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'p'
    },
    pagebreak: { mode: 'avoid-all', after: '.breakPage' }
  }



  onboardingGetVendorsUrl =`${AppConsts.onboardingGetVendorsUrl}${"/api/Onboardings/GetVendors"}` ;
  vendorQueryUrl = `${AppConsts.onboardingGetVendorsUrl}${"/api/Queries"}`;
  queryWithResponseUrl = `${AppConsts.onboardingGetVendorsUrl}${"/api/Queries/GetQueries"}`;
  updateVendorStatusUrl = `${AppConsts.onboardingGetVendorsUrl}${"/api/Onboardings/UpdateVendorState"}`;
  updateVendorCodeUrl = `${AppConsts.onboardingGetVendorsUrl}${"/api/Onboardings/UpdateVendor"}`;
  lockUserUrl = `${AppConsts.onboardingGetVendorsUrl}${"/api/User/lockuser"}`;
  ReplaceAdminVendorUrl = `${AppConsts.onboardingGetVendorsUrl}${"/api/Invitations/CreateReplacementInvitation"}`;
  exportVendorUrl = `${AppConsts.onboardingGetVendorsUrl}${"/api/Onboardings/ExportVendors"}`;
  ItemVendorsData = [];
  itemData = {
    items:[]
  };
  OnboardingVendorsData = [];
  status =OnboardingStatus.Submitted;
  acceptStatus = OnboardingStatus.Processing;
  variousStatus = {
   NotStarted: 1,
   Submitted : 2,
   Processing : 3,
   Queried:4,
   Completed:5
}
  statusName: string;
  onboardingVendorsData:OnboardVendorDto ={
    success: false as boolean,
    message: "" as string,
    validationErrors:"" as any,
    result: {} as Result
  };
  filterVendorDetails: Item[]=[]
  allVendorsData :OnboardVendorDto ={
    success: false as boolean,
    message: "" as string,
    validationErrors:"" as any,
    result: {} as Result
  };
  createQueryDto : CreateQueryDto ={
    resourceReference: "",
    queryMessage: "",
    queryInitiator: "",
    hash: "",
    resourceType : ResourceType.Vendor

  }
  replacementInvitationDto: ReplacementInvitationDto = {
    vendorId: 0,
   adminName: '',
   adminEmail: '',
   hash: ''
  }
  queryDto: QueryDto ={
    success: false as boolean,
    message: "" as string,
    validationErrors:"" as any,
    result: []
  }
  isLoading:boolean = false;
  saving: boolean = false;
  processing: boolean = false;
  fieldSorted: string;
  searchWord: string = "";
  onboardingResultDto  = {
    items:[],
    pageNumber:1 ,
    totalPages: 1,
    totalCount: 1,
    pageSize: 10,
    hasPreviousPage: false,
    hasNextPage: false
  }
  public dateRange: DateTime[] = [
    this._dateTimeService.getStartOfDayForDate(
      this._dateTimeService.minusDays(this._dateTimeService.getStartOfDay(), 30)
    ),
    this._dateTimeService.getEndOfDayPlusDays(1)
  ];
  queryMessage: string;
  queryId: string;
  loadAllQueries: boolean = false;
  vendorId:string;
  documents: Document[] = [];
  processPdf = false;

  ngOnInit(): void {
   this.variousStatus.Completed
    this.getOnboardingVendorsData();
    this.getVendorsOnboardingData();
    console.log(`The name is ${this.appSession.user.name}`);
  }
  ngAfterViewInit(): void {
   this.getVendorsOnboardingData();

  }
  
  generatePDF() {
    this.processPdf = true;
    const pEl = document.getElementById('pEl');
    html2pdf().from(pEl).set(this.options1).save();

    this.processPdf = false;
  }
changeStatue(event: any){

    this.status = event;


}
queryAndResponse():Observable<QueryDto>{
    const reqHeader = new HttpHeaders({
        'Content-Type': 'application/json'
       });
       let queryParams = new HttpParams();
       queryParams = queryParams.append('vendorId',`${this.vendorId}`);
       queryParams = queryParams.append('loadAllQueries',`${this.loadAllQueries}`);

       console.log(`The query Parameters are ${ queryParams}`);
       return this.http.get<QueryDto>(this.queryWithResponseUrl, { headers: reqHeader, params:queryParams});

}
queryResponseDetailHttp(vendorId: number){

    const reqHeader = new HttpHeaders({
        'Content-Type': 'application/json'
       });
       let queryParams = new HttpParams();
       queryParams = queryParams.append('vendorId',`${vendorId}`);
       queryParams = queryParams.append('loadAllQueries',`${this.loadAllQueries}`);

       console.log(`The query Parameters are ${ queryParams}`);
       return this.http.get<QueryDto>(this.queryWithResponseUrl, { headers: reqHeader, params:queryParams});

}
lockUserHttpReq(lockDto:LockUserDto): Observable<BaseResponse>{
    const reqHeader = new HttpHeaders({
        'Content-Type': 'application/json'
       });
       return this.http.post<BaseResponse>(this.lockUserUrl,lockDto,{ headers: reqHeader});

}
updateVendorStatusHttpReq(changeStatus:ChangeVendorStateDto):Observable<BaseResponse>{
    const reqHeader = new HttpHeaders({
        'Content-Type': 'application/json'
       });
       let queryParams = new HttpParams();
       queryParams = queryParams.append('vendorId',`${changeStatus.vendorId}`);
       queryParams = queryParams.append('status',`${changeStatus.status}`);

       console.log(`The query Parameters are ${ queryParams}`);
       return this.http.post<BaseResponse>(this.updateVendorStatusUrl,changeStatus,{ headers: reqHeader});


}
 getQueryAndResponse(){
    this.showMainSpinner();
    this.queryAndResponse().subscribe(res =>{
        this.queryDto = res;

        this.hideMainSpinner()
    },error=>{
        this.message.error("Sorry!, an error occur while getting the queries");
        this.hideMainSpinner();
    })
 }
 getVendorDetailQueryResponse(vendorId:number){
    this.showMainSpinner();
    this.queryResponseDetailHttp(vendorId).subscribe(result =>{
        this.queryDto = result;
        this.hideMainSpinner()
    }, error=>{
        this.message.error("Sorry!, an error occur while getting the queries");
        this.hideMainSpinner();
    })

 }

  getOnboardingVendorsData():Observable<OnboardVendorDto>{

    const reqHeader = new HttpHeaders({
     'Content-Type': 'application/json'
    });
    let queryParams = new HttpParams();
    queryParams = queryParams.append('SearchText',`${this.searchWord}`);
    queryParams = queryParams.append('StartDate',`${this._dateTimeService.getStartOfDayForDate(this.dateRange[0]).toISODate()}`);
    queryParams = queryParams.append('EndDate',`${this._dateTimeService.getEndOfDayForDate(this.dateRange[1]).toISODate()}`);
    queryParams = queryParams.append('Status',`${this.status}`);
    queryParams = queryParams.append('PageIndex',`${this.onboardingResultDto.pageNumber}`);
    queryParams = queryParams.append('PageSize', `${this.onboardingResultDto.pageSize}`);
    console.log(`The query Parameters are ${ queryParams}`);
    return this.http.get<OnboardVendorDto>(this.onboardingGetVendorsUrl, { headers: reqHeader, params:queryParams});

  }
  
  exportVendorsService(): Observable<any> {

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
     });
     let queryParams = new HttpParams();
     queryParams = queryParams.append('SearchText',`${this.searchWord}`);
     queryParams = queryParams.append('StartDate',`${this._dateTimeService.getStartOfDayForDate(this.dateRange[0])}`);
     queryParams = queryParams.append('EndDate',`${this._dateTimeService.getEndOfDayForDate(this.dateRange[1])}`);
     queryParams = queryParams.append('Status',`${this.status}`);
     queryParams = queryParams.append('PageIndex',`${this.onboardingResultDto.pageNumber}`);
     queryParams = queryParams.append('PageSize', `${this.onboardingResultDto.pageSize}`);
     console.log(`The query Parameters are ${ queryParams}`);
     return this.http.get<any>(this.exportVendorUrl, { headers: reqHeader, params:queryParams});
    
  }

   // Function to save the file
   private saveFile(data: ArrayBuffer, fileName: string) {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }

  downloadExcelFile() {
    this.showMainSpinner();
    let queryParams = new HttpParams();
    queryParams = queryParams.append('SearchText',`${this.searchWord}`);
    queryParams = queryParams.append('StartDate',`${this._dateTimeService.getStartOfDayForDate(this.dateRange[0])}`);
    queryParams = queryParams.append('EndDate',`${this._dateTimeService.getEndOfDayForDate(this.dateRange[1])}`);
    queryParams = queryParams.append('Status',`${this.status}`);
    queryParams = queryParams.append('PageIndex',`${this.onboardingResultDto.pageNumber}`);
    queryParams = queryParams.append('PageSize', `${this.onboardingResultDto.pageSize}`);
   

    this.http.get(this.exportVendorUrl, {
      responseType: 'arraybuffer', // Specify the response type as arraybuffer
      params: queryParams,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }).subscribe((response: ArrayBuffer) => {
      this.saveFile(response, 'excel-file.xlsx'); // Specify the filename as needed
      this.hideMainSpinner();
    }, error => {
      this.hideMainSpinner();
    });
  }

    downloadCSVFile() {
       let queryParams = new HttpParams();
    queryParams = queryParams.append('SearchText',`${this.searchWord}`);
    queryParams = queryParams.append('StartDate',`${this._dateTimeService.getStartOfDayForDate(this.dateRange[0])}`);
    queryParams = queryParams.append('EndDate',`${this._dateTimeService.getEndOfDayForDate(this.dateRange[1])}`);
    queryParams = queryParams.append('Status',`${this.status}`);
    queryParams = queryParams.append('PageIndex',`${this.onboardingResultDto.pageNumber}`);
    queryParams = queryParams.append('PageSize', `${this.onboardingResultDto.pageSize}`);

    this.http.get(this.exportVendorUrl, {
      responseType: 'text', // Specify the response type as text for CSV
      params: queryParams,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }).subscribe((response: string) => {
      this.saveFileToCsv(response, 'Vendors.csv'); // Specify the filename as needed
    });
  }

  // Function to save the file
  private saveFileToCsv(data: string, fileName: string) {
    const blob = new Blob([data], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }

   saveQuery(queryDto:CreateQueryDto): Observable<any>{
    return this.http.post<any>(this.vendorQueryUrl, queryDto);
   }
   updateVendorCode(updateDto:UpdateVendorDto): Observable<BaseResponse>{

    const reqHeader = new HttpHeaders({
        'Content-Type': 'application/json'
       });
       return this.http.post<BaseResponse>(this.updateVendorCodeUrl,updateDto,{ headers: reqHeader});

   }
   saveAdminReplaceHttp(ReplaceAdminDto:ReplacementInvitationDto): Observable<BaseResponse>{
    return this.http.post<BaseResponse>(this.ReplaceAdminVendorUrl, ReplaceAdminDto);
   }
   
  exportVendorToExcel() {
    this.showMainSpinner();
    this.exportVendorsService().subscribe((response) => {
      this._fileDownloadService.downloadTempFile(response);
      this.hideMainSpinner();
    }, error => {
      this.hideMainSpinner();
    });
   }
   getVendorsOnboardingData(){
    this.primengTableHelper.isLoading = true;
    this.isLoading = true;
    this.showMainSpinner();

    this.getOnboardingVendorsData().subscribe(res =>{

           //  this.onboardingResultDataDto = res;
             this.onboardingVendorsData = res;
             this.allVendorsData = res;

             this.onboardingResultDto.pageNumber = res.result.pageNumber;

             this.onboardingResultDto.totalCount = res.result.totalCount;
             this.onboardingResultDto.totalPages = res.result.totalPages;
             this.onboardingResultDto.hasNextPage = res.result.hasNextPage;
             this.onboardingResultDto.hasPreviousPage = res.result.hasPreviousPage;
             this.primengTableHelper.isLoading = false;
             this.isLoading = false;
             console.log(`The value of Onboarding data is ${JSON.stringify(this.onboardingVendorsData.result.items)}`)
             this.hideMainSpinner();

    }, error =>{
     //   this.message.error(`Sorry an error Occur while getting data from Vendor Portal`);
        this.primengTableHelper.isLoading = false;
        this.hideMainSpinner();
        console.log(`The error that occur while getting data from Vendor Portal is ${JSON.stringify(error)}`);
    })
   }

   async search(event?: any) : Promise<void> {
    this. getVendorsOnboardingData();
  }

  async searchInit() {
    this.onboardingResultDto.pageNumber  = 1;
    this.onboardingResultDto .pageSize = 10;
    this.search()
  }

  onChange() {
    if (this.searchWord.length <=0) {
      this.searchInit()
    }
  }
  viewDetails(Id: number){

    this.filterVendorDetails = [];
    this.filterVendorDetails = this.onboardingVendorsData.result.items.filter(e=>e.id == Id);
    this.modal.show();
  }
  closeAdminReplaceModal() {
    this.adminReplaceModal.hide()
  }
  showAdminReplaceModal(Id: number) {
    this.replacementInvitationDto.vendorId = Id;
    this.adminReplaceModal.show();
  }
  saveAdminReplacement(ngform: NgForm) { 

    this.message.confirm(
      this.l("You want to Replace Admin Info"),
              this.l("AreYouSure"),
              (isConfirmed)=>{
                  if(isConfirmed){
                       this.saving = true;

                      this.saveAdminReplaceHttp(this.replacementInvitationDto).subscribe((res)=>{
                          console.log(`The message is ${JSON.stringify(res)}`);
                          if(res.success == true){
                              this.message.success("Sent Successfully");
                              this.saving = false;
                              this.getVendorsOnboardingData();
                              ngform.resetForm();
                              this.closeAdminReplaceModal();
                          }
                          else if(res.success == false){
                              this.saving = false;
                            this.message.error(`Oops,an error:${res.message}`);
                          }



                      }, error =>{
                          this.saving = false;
                        //  this.message.error(`Oops, an error: ${error.message}`);
                          console.log(`The error is ${JSON.stringify(error)}`);
                      })

                  }
              }
  )
    
   
  }


  AcceptVendor(DataItem:OnboardingVendorDto){
   var VendorCode = "";
    if(DataItem.code !=null || DataItem.code != undefined){
     VendorCode = DataItem.code;
    }
    else{
        VendorCode = DataItem.companyName;
    }

    this.message.confirm(
        this.l("You want to Accept"),
                this.l("AreYouSure"),
                (isConfirmed)=>{
                    if(isConfirmed){
                        this.showMainSpinner();
                        let changeStatus :ChangeVendorStateDto ={
                            vendorId:DataItem.id,
                            status:OnboardingStatus.Processing
                        }

                        this.processing = true;
                        this._Documentservice.deleteDocumentBaseOnRef(VendorCode).subscribe(()=>{
                            this._vendorsServiceProxy.acceptOnboardingData(DataItem).subscribe((vendorNo)=>{

                                let updateVendorDto:UpdateVendorDto ={
                                    onlyStatus:false,
                                    status: OnboardingStatus.Processing,
                                    vendorCode: vendorNo,
                                    vendorId: DataItem.id
                                }
                                this.updateVendorCode(updateVendorDto).subscribe((updateVendRes)=>{
                                    if(updateVendRes.success == true){
                                        this.message.success("Sent Successfully for Approval");
                                        this.processing = false;
                                        this.getVendorsOnboardingData();

                                        this.hideMainSpinner();

                                    }
                                    else if(updateVendRes.success == false){

                                        this.processing = false;
                                        this.message.error(`Sent for Approval but fail to update Vendor Code with error:${updateVendRes.message}`);
                                       this.hideMainSpinner();

                                    }
                                })



                              },error=>{
                                this.processing = false;
                                this.hideMainSpinner();
                               // this.message.error(error.message);
                              })
                         });


                    }
                }
    )

  }
  lockUser(DataItem:OnboardingVendorDto){
    this.message.confirm(
               this.l("You want to lock this vendor"),
                this.l("AreYouSure"),
                (isConfirmed)=>{
                    if(isConfirmed){
                        let lockuserDto:LockUserDto ={
                            vendorId: DataItem.id,
                            lock:true
                        }
                          this.showMainSpinner();
                        this.lockUserHttpReq(lockuserDto).subscribe(res=>{
                            if(res.success == true){
                                this.message.success("Successfully Lock the Vendor");
                                this.getVendorsOnboardingData();
                                this.hideMainSpinner();
                            }
                            else if(res.success == false){
                              this.message.error(res.message);
                              this.hideMainSpinner();
                            }
                        },error=>{
                            this.hideMainSpinner();
                        })
                    }
                }
    )

  }
  UnlockUser(DataItem:OnboardingVendorDto){
    DataItem.isLock
    this.message.confirm(
               this.l("You want to unlock this vendor"),
                this.l("AreYouSure"),
                (isConfirmed)=>{
                    if(isConfirmed){
                        let lockuserDto:LockUserDto ={
                            vendorId: DataItem.id,
                            lock:false
                        }
                          this.showMainSpinner();
                        this.lockUserHttpReq(lockuserDto).subscribe(res=>{
                            if(res.success == true){
                                this.message.success("Successfully UnLock the Vendor");
                                this.getVendorsOnboardingData();
                                this.hideMainSpinner();
                            }
                            else if(res.success == false){
                              this.message.error(res.message);
                              this.hideMainSpinner();
                            }
                        },error=>{
                            this.hideMainSpinner();
                        })
                    }
                }
    )

  }
  refresh(){
    window.location.reload();
  }
  CompleteVendorOboarding(DataItem:OnboardingVendorDto){
    let completeStatus = OnboardingStatus.Completed


    this.message.confirm(
        this.l("You want to Complete"),
                this.l("AreYouSure"),
                (isConfirmed)=>{
                    if(isConfirmed){
                        this.showMainSpinner();


                        let updateVendorDto:UpdateVendorDto ={
                            onlyStatus:true,
                            status: OnboardingStatus.Completed,
                            vendorCode: DataItem.code,
                            vendorId: DataItem.id
                        }
                        this.processing = true;
                        this._vendorsServiceProxy.isVendorInWorkFlow(DataItem.companyName).subscribe((res)=>{
                            if(res==true){
                                this.processing = false;
                                this.hideMainSpinner();
                             return this.message.error("Vendor has not yet been approved");
                            }
                            else{

                                this.updateVendorCode(updateVendorDto).subscribe((updateVendRes)=>{
                                    if(updateVendRes.success == true){
                                        this.message.success("Vendor Completed Successfully");
                                        this.processing = false;
                                        this.getVendorsOnboardingData();

                                        this.hideMainSpinner();

                                    }
                                    else if(updateVendRes.success == false){

                                        this.processing = false;
                                        this.message.error(`Sent for Approval but fail to update Vendor Code with error:${updateVendRes.message}`);
                                       this.hideMainSpinner();

                                    }
                                })


                            }

                        })


                    }
                }
    )

  }
  QueryVendor(DataItem:OnboardingVendorDto){

    this._vendorsServiceProxy.isVendorHasPendingApproval(DataItem.code).subscribe(()=>{
        this.queryId = `${DataItem.id}`;
        this.vendorId = `${DataItem.id}`;
        this.queryVendorComp.QueryVendor(DataItem);

      this.queryVendorComp.ViewQueryResponse(DataItem.id);

    })

  //  this. getQueryAndResponse();
   // this.queryModal.show();

  }
  sendQuery(){

    this.message.confirm(
        this.l("You want to send query"),
                this.l("AreYouSure"),
                (isConfirmed)=>{
                    if(isConfirmed){
                         this.saving = true;
                        this.createQueryDto.queryInitiator = `${this.appSession.user.name} ${this.appSession.user.surname}`;
                        this.createQueryDto.queryMessage = this.queryMessage;
                        this.createQueryDto.resourceReference = this.queryId;
                        this.createQueryDto.resourceType =  ResourceType.Vendor;
                        console.log(`The query Parameter is ${JSON.stringify( this.createQueryDto)}`);
                        this.saveQuery(this.createQueryDto).subscribe(()=>{
                            this.message.success("Query Sent Successfully");
                            this.closeQueryModal();
                            this.saving = false;
                            this.queryMessage = "";
                        }, error =>{
                            this.saving = false;
                            this.message.error("Sorry!, an error occur while sending query");
                            console.log(`Error that occur while sending query is ${JSON.stringify(error)}`);
                        })

                    }
                }
    )

  }
  ViewQueryResponse(Id: number){
    this. getVendorDetailQueryResponse(Id);
    this.VendorQueryResponse.show();
  }

  closeVendorQueryResponse(){
    this.VendorQueryResponse.hide();
  }
  changeSize(num: number) {
    this.onboardingResultDto.pageSize = num;
    this.onboardingResultDto.pageNumber = 1;
    this.getVendorsOnboardingData();
  }

  previousPage() {
    this.onboardingResultDto.pageNumber = Number(this.onboardingResultDto.pageNumber) -1;
    this.getVendorsOnboardingData();
  }

  nextPage() {
    this.onboardingResultDto.pageNumber = Number(this.onboardingResultDto.pageNumber) + 1;
    this.getVendorsOnboardingData();
  }

  async sort(field) {
    if (this.fieldSorted === field) {
        this.onboardingVendorsData.result.items = this.allVendorsData.result.items.sort((a, b) => {
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
    this.onboardingVendorsData.result.items= this.allVendorsData.result.items.sort((a,b) => {
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
  closeModal(){
    this.modal.hide();
  }
  closeQueryModal(){
    this.queryModal.hide();
  }


  documentModal(document: Document[]){
    this.documents = document;
    this.uploadDocumentModal.show()
  }
  closeDocumentModal(){
    this.uploadDocumentModal.hide();
  }

}
