import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Console } from 'console';
import { DateTime } from 'luxon';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { BaseResponse, CreateInvitationDto, InvitationDto, InvitationUsedSearch, Result, UseInvitationDto } from './invitationModel';
import { Table } from 'primeng';

@Component({
  selector: 'app-vendor-invitation',
  templateUrl: './vendor-invitation.component.html',
  styleUrls: ['./vendor-invitation.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class VendorInvitationComponent extends AppComponentBase implements OnInit , AfterViewInit {

  constructor(injector: Injector, private http: HttpClient, private _dateTimeService: DateTimeService) {
    super(injector);
  }
    ngAfterViewInit(): void {
         this.getAllVendorsInvitationData();
    }

    @ViewChild('sendVendorInvitation', { static: true }) sendInviteModal: ModalDirective;
  @ViewChild('reSendVendorInvitation', { static: true }) reSendInviteModal: ModalDirective;
  @ViewChild('dataTable', { static: true }) dataTable: Table;

    CreateVendorsInvitationUrl =`${AppConsts.onboardingGetVendorsUrl}${"/api/Invitations"}`;
    getvendorsInvitationUrl = `${AppConsts.onboardingGetVendorsUrl}${"/api/Invitations"}` ;
    EditVendorsInvitationUrl = `${AppConsts.onboardingGetVendorsUrl}${"/api/Invitations"}` ;

  public dateRange: DateTime[] = [
    this._dateTimeService.getStartOfDayForDate(
      this._dateTimeService.minusDays(this._dateTimeService.getStartOfDay(), 60)
    ),
    this._dateTimeService.getEndOfDayPlusDays(1)
  ];
  searchWord : string = "";
  status = InvitationUsedSearch.All;
  statusName: string;
  fieldSorted: string;
  isLoading: boolean = false;
  vendorInvitationCode: string;
  vendorsInvitationData:InvitationDto ={
    success: false as boolean,
    message: "" as string,
    validationErrors:"" as any,
    result: []
  };
 allvendorsInvitationData:InvitationDto ={
    success: false as boolean,
    message: "" as string,
    validationErrors:"" as any,
    result: []
  };
  saving: boolean = false;
  loading: boolean = false;

  createInvitationDto : CreateInvitationDto ={
    companyName: "",
    adminName: "",
    adminEmail: "",
    hash: ""
  }
  editInvitationDto:CreateInvitationDto ={
    companyName: "",
    adminName: "",
    adminEmail: "",
    hash: ""
  }

  ngOnInit(): void {
    this.AllVendorsInvitationData();
    this.getAllVendorsInvitationData();

  }

  AllVendorsInvitationData():Observable<InvitationDto>{

    const reqHeader = new HttpHeaders({
     'Content-Type': 'application/json'
    });
    let queryParams = new HttpParams();
    queryParams = queryParams.append('SearchText',`${this.searchWord}`);
    queryParams = queryParams.append('StartDate',`${this._dateTimeService.getStartOfDayForDate(this.dateRange[0]).toISODate()}`);
    queryParams = queryParams.append('EndDate',`${this._dateTimeService.getEndOfDayForDate(this.dateRange[1]).toISODate()}`);
    queryParams = queryParams.append('Status',`${this.status}`);

    console.log(`The query Parameters are ${ queryParams}`);
    return this.http.get<InvitationDto>(this. getvendorsInvitationUrl, { headers: reqHeader, params:queryParams});

   }

   getAllVendorsInvitationData(){
    this.primengTableHelper.isLoading = true;
    this.isLoading = true;
    this.showMainSpinner();

    this.AllVendorsInvitationData().subscribe(res =>{

             this.vendorsInvitationData = res;
             this.allvendorsInvitationData = res;


             this.primengTableHelper.isLoading = false;
             this.isLoading = false;
             this.hideMainSpinner();

             console.log(`All Vendors Invitation Data ${JSON.stringify(this.vendorsInvitationData)}`);

    }, error =>{
      //  this.message.error("Sorry, an error occur while getting Data from Vendor Portal");
        this.primengTableHelper.isLoading = false;
        this.isLoading = false;
        console.log(`Error that occured is ${ this.allvendorsInvitationData.message}`);
        this.hideMainSpinner();
    })
   }

  async search(event?: any) : Promise<void> {
    this.getAllVendorsInvitationData();
  }

  async searchInit() {

    this.search()
  }

  onChange() {
    if (this.searchWord.length <=0) {
      this.searchInit()
    }
  }
  changeStatue(event: any){
    this.status = event;
}

async sort(field) {
    if (this.fieldSorted === field) {
        this.vendorsInvitationData.result = this. allvendorsInvitationData.result.sort((a, b) => {
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
    this.vendorsInvitationData.result= this. allvendorsInvitationData.result.sort((a,b) => {
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

  resendInvitation(InvitationResultDto:Result){
    this.message.confirm(
        this.l("You want to Send Invitation"),
                this.l("AreYouSure"),
                (isConfirmed)=>{
                  if (isConfirmed) {
                    this.loading = true;
                    this.showMainSpinner();
                        let createInvitation:CreateInvitationDto ={
                            companyName:InvitationResultDto.companyName,
                            adminName: InvitationResultDto.adminName,
                            adminEmail: InvitationResultDto.adminEmail,
                            hash:""
                        }
                       
                         
                         console.log(`The resend invitation Data is ${JSON.stringify(createInvitation)}`)
                        this.saveInvite(createInvitation).subscribe(()=>{
                          this.message.success("Invitation Sent Successfully");
                          this.loading = false;
                          
                          this.hideMainSpinner();
                            this.getAllVendorsInvitationData();

                            this. closeSendInviteModal();

                        }, error =>{
                         
                          this.loading = false;
                            this.hideMainSpinner();
                            this.message.error(`Oops, an error:${error.message}`);
                        })

                    }
                }
    )

  }
  saveInvite(InvitationDto:CreateInvitationDto): Observable<BaseResponse>{
    return this.http.post<BaseResponse>(this.CreateVendorsInvitationUrl, InvitationDto);
   }
   editInvite(useInvitationDto: UseInvitationDto): Observable<BaseResponse>{
    return this.http.put<BaseResponse>(this.EditVendorsInvitationUrl, useInvitationDto);
   }

   sendInvitation(ngform:NgForm){


    this.message.confirm(
        this.l("You want to Send Invitation"),
                this.l("AreYouSure"),
                (isConfirmed)=>{
                    if(isConfirmed){
                         this.saving = true;

                        this.saveInvite(this.createInvitationDto).subscribe((res)=>{
                            console.log(`The message is ${JSON.stringify(res)}`);
                            if(res.success == true){
                                this.message.success("Invitation Sent Successfully");
                                this.saving = false;
                                this.getAllVendorsInvitationData();
                                ngform.resetForm();
                                this. closeSendInviteModal();
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

  saveEditInvitation(){


    this.message.confirm(
        this.l("You want to Send Invitation"),
                this.l("AreYouSure"),
                (isConfirmed)=>{
                    if(isConfirmed){
                         this.saving = true;
                         let vendorEditModel:UseInvitationDto ={
                            code:this.vendorInvitationCode
                         }

                        this.editInvite(vendorEditModel).subscribe((res)=>{
                            if(res.success == true){
                                this.message.success("Invitation Sent Successfully");
                                this.saving = false;
                                this.getAllVendorsInvitationData();

                                this.closeReSendInviteModal();
                            }
                            else if(res.success == false){
                                this.saving = false;
                              this.message.error(`Oops,an error:${res.message}`);
                            }



                        }, error =>{
                            this.saving = false;
                            this.message.error(`Oops, an error ${error.message}`);
                            console.log(`The error from saving edited Invitation is ${JSON.stringify(error)}`)
                        })

                    }
                }
    )

  }


  closeSendInviteModal(){
   this.sendInviteModal.hide();
  }

  openSendInvitationModal(){
    this.sendInviteModal.show();
  }

  showEdit(result: Result){
    this.editInvitationDto.adminEmail = result.adminEmail;
    this.editInvitationDto.adminName = result.adminName;
    this.editInvitationDto.companyName = result.companyName;
    this.vendorInvitationCode = result.code;


    this.reSendInviteModal.show();
  }

  closeReSendInviteModal(){
     this.reSendInviteModal.hide();
  }


}
