import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { OnboardingVendorDto, VendorsServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../vendor-invitation/invitationModel';
import { QueryDto, ResourceType } from '../getQueriesModels';
import { CreateQueryDto } from '../onboardingModel';

@Component({
  selector: 'onboarding-vendor-query',
  templateUrl: './onboarding-vendor-query.component.html',
  styleUrls: ['./onboarding-vendor-query.component.css']
})
export class OnboardingVendorQueryComponent extends AppComponentBase implements OnInit {

  constructor(injector: Injector, private http: HttpClient, private _vendorsServiceProxy: VendorsServiceProxy) {
    super(injector);
   }

   @ViewChild('queryVendor', { static: true }) queryModal: ModalDirective;
   @ViewChild('VendorQueryResponse', { static: true }) VendorQueryResponse: ModalDirective;
   @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

   vendorQueryUrl = `${AppConsts.onboardingGetVendorsUrl}${"/api/Queries"}`;
  queryWithResponseUrl = `${AppConsts.onboardingGetVendorsUrl}${"/api/Queries/GetQueries"}`;
  saving: boolean = false;
  processing: boolean = false;
  queryDto: QueryDto ={
    success: false as boolean,
    message: "" as string,
    validationErrors:"" as any,
    result: []
  }
  createQueryDto : CreateQueryDto ={
    resourceReference: "",
    queryMessage: "",
    queryInitiator: "",
    hash: "",
    resourceType : ResourceType.Vendor

  }

  queryMessage: string;
  queryId: string;
  loadAllQueries: boolean = true;
  vendorId:string;



  ngOnInit(): void {
  }

  saveQuery(queryDto:CreateQueryDto): Observable<BaseResponse>{
    return this.http.post<BaseResponse>(this.vendorQueryUrl, queryDto);
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


getQueryAndResponse(){
    this.showMainSpinner();
    this.queryAndResponse().subscribe(res =>{
        this.queryDto = res;

        console.log(`The value of query Response is ${JSON.stringify(res.result)}`);

        this.hideMainSpinner()
    },error=>{
        this.message.error(`${error.message}`);
        this.hideMainSpinner();
    })
 }

 getVendorDetailQueryResponse(vendorId:number){
    this.showMainSpinner();
    this.queryResponseDetailHttp(vendorId).subscribe(result =>{
        this.queryDto = result;
        this.hideMainSpinner()
    }, error=>{
        this.message.error(`Oops, an error:${error.message}`);
        this.hideMainSpinner();
    })

 }
 QueryVendor(DataItem:OnboardingVendorDto){
    this.queryId = `${DataItem.id}`;
   this.vendorId = `${DataItem.id}`;
   console.log(`The Vendor Code is ${DataItem.code}`);
   console.log(`The Vendor Id is ${DataItem.id}`);
   console.log(`The Value of Data Item is ${JSON.stringify(DataItem)}`);
    this.showMainSpinner()
    this._vendorsServiceProxy.isVendorHasPendingApproval(DataItem.code).subscribe(()=>{
        this. getQueryAndResponse();
        this.hideMainSpinner()
        this.queryModal.show();

    },error=>{
        this.hideMainSpinner();
    })


  }
  ViewQueryResponse(Id: number){
    this. getVendorDetailQueryResponse(Id);
    this.VendorQueryResponse.show();
  }

  closeVendorQueryResponse(){
    this.VendorQueryResponse.hide();
  }

 sendQuery(){


    this.message.confirm(
        this.l("You want to send this Enquiry"),
                this.l("AreYouSure"),
                (isConfirmed)=>{
                    if(isConfirmed){
                         this.saving = true;
                        this.createQueryDto.queryInitiator = `${this.appSession.user.name} ${this.appSession.user.surname}`;
                        this.createQueryDto.queryMessage = this.queryMessage;
                        this.createQueryDto.resourceReference = this.queryId;
                        this.createQueryDto.resourceType =  ResourceType.Vendor;
                        console.log(`The query Parameter is ${JSON.stringify( this.createQueryDto)}`);
                        this.saveQuery(this.createQueryDto).subscribe((res)=>{
                            this.message.success("Enquiry Sent Successfully");
                            this.modalSave.emit(null);
                            this.closeQueryModal();

                            this.saving = false;
                            this.queryMessage = "";
                        }, error =>{
                            this.saving = false;
                            this.message.error(`Oops,an error: ${error.message}`);
                            console.log(`Error that occur while sending query is ${JSON.stringify(error)}`);
                        })

                    }
                }
    )

  }
  refresh(){
    window.location.reload();
  }

  closeQueryModal(){
    this.queryModal.hide();
  }
  onShown(){}

}
