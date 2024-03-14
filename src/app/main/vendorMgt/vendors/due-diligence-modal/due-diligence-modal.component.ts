import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { FileuploadComponent } from '@app/main/FileDocuments/fileupload/fileupload.component';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { EditVendorInput, VendorDto, VendorsServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../vendor-invitation/invitationModel';
import { UpdateDueDeligenceDto } from '../../on-boarding-data/onboardingModel';

@Component({
  selector: 'app-due-diligence-modal',
  templateUrl: './due-diligence-modal.component.html',
  styleUrls: ['./due-diligence-modal.component.css']
})
export class DueDiligenceModalComponent extends AppComponentBase implements OnInit {

    @ViewChild('duediligent', { static: true }) duediligent: ModalDirective;
    @ViewChild('fileUpload', { static: true }) fileUpload: FileuploadComponent;
  @Output() duediligentSave: EventEmitter<any> = new EventEmitter<any>();
  updateDueDeligentUrl = `${AppConsts.onboardingGetVendorsUrl}${"/api/Onboardings/UpdateDueDeligence"}`;

    vendorData:EditVendorInput;
  RefNoforDueDiligent: string;
  VendorID: number;
  OnboardingVendorPortalID: number;
  saving = false;
  loading: boolean = false;
  updateDueDeligenceDto: UpdateDueDeligenceDto = {
    vendorId: 0,
    dueDeligenceCompleted:true
  }

    checkedDueDiligent: boolean = false;
    checkedNDA: boolean = false;

  constructor(injector: Injector, private _vendorsServiceProxy: VendorsServiceProxy, private http: HttpClient) {
    super(injector);
   }

  ngOnInit(): void {
  }

  updateDueDeligentHttp(updateDueDeligenceDto:UpdateDueDeligenceDto): Observable<BaseResponse>{
    return this.http.post<BaseResponse>(this.updateDueDeligentUrl, updateDueDeligenceDto);
  }
  updateVendorPortalDueDeligent(deligent: boolean): boolean {
    let returnValue ;
    this.updateDueDeligenceDto.dueDeligenceCompleted = deligent;
    this.updateDueDeligenceDto.vendorId = this.OnboardingVendorPortalID;
    this.updateDueDeligentHttp(this.updateDueDeligenceDto).subscribe(res => {
      returnValue = res.success;
      console.log(`The response1 from Vendor Portal is ${res.success}`);
      if(res.success == true){
        this.hideMainSpinner();
        this.message.success("Sucessfully Perform");
        this.saving = false;
       this.duediligentSave.emit(null);
        
      }
      else if(res.success == false){
        
        this.saving = false;
        this.hideMainSpinner();
        this.message.error(`${res.message} occur at Vendor Online Portal while updating`);
        this.duediligentSave.emit(null);
      
      }
  },error=>{
      this.hideMainSpinner();
    })
    
    return returnValue;
  }

  closeduediligenceModal(){
    this.duediligent.hide();
   }

   showDueDiligentModal(vendorDto:VendorDto){
     this.RefNoforDueDiligent = vendorDto.vendorNumber;

     this.OnboardingVendorPortalID = vendorDto.onboardingId
     console.log(`The Vendor Online Portal ID is ${this.OnboardingVendorPortalID}`);
       this.VendorID = vendorDto.id;
       this._vendorsServiceProxy.getVendorForVeiw(vendorDto.id).subscribe(res=>{
                 this.vendorData = res.vendor;
                 this.checkedDueDiligent = res.vendor.dueDiligence;
                 this.checkedNDA = res.vendor.nda;
                 this.duediligent.show();
       })

   }
  duediligentButton() {
    this.saving = true;
    this.showMainSpinner();
       this._vendorsServiceProxy.dueDiligence(this.RefNoforDueDiligent).subscribe((res)=>{
         this.checkedDueDiligent = res;
         if (this.OnboardingVendorPortalID != null) {
           this.updateVendorPortalDueDeligent(res);
           
         }
         else {
          this.hideMainSpinner();
          this.message.success("Sucessfully Perform");
          this.saving = false;
         this.duediligentSave.emit(null);
           
         }
        
          
       }, error => {
        this.hideMainSpinner();
         this.saving = false;
       })
   }
  ndaButton() {
    this.loading = true;
       this._vendorsServiceProxy.nda(this.RefNoforDueDiligent).subscribe((res)=>{
         this.checkedNDA = res;
         this.duediligentSave.emit(null);
         this.loading = false;

         this.message.success("Sucessfully Perform");
       }, error => {
        this.loading = false;
       })
   }

   UploadDocument() {

    this.fileUpload.ShowAttachment(this.RefNoforDueDiligent, 23);
  }

}
