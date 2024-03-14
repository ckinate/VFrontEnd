import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CurrencyDto, GeneralOperationsServiceServiceProxy, VendorOnlineSettingDto, VendorsServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-email-notification-vendor-online',
  templateUrl: './email-notification-vendor-online.component.html',
  styleUrls: ['./email-notification-vendor-online.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class EmailNotificationVendorOnlineComponent extends AppComponentBase implements OnInit {

  constructor(injector: Injector, private _vendorsServiceProxy: VendorsServiceProxy, private _generalOperationsService:GeneralOperationsServiceServiceProxy) {
    super(injector);
  }
  getOnlineSetting : VendorOnlineSettingDto = new VendorOnlineSettingDto();
    createOrEditEmail: VendorOnlineSettingDto = new VendorOnlineSettingDto();
    currencyDtoList: CurrencyDto[] = [];
  saving:boolean = false;

  ngOnInit(): void {
      this.getEmailSetting();
      this.getCurrency();
      

  }

    getCurrency() {
        this.showMainSpinner();
        this._generalOperationsService.getCurrencyList().subscribe(res => {
            this.currencyDtoList = res;
            this.hideMainSpinner();
        }, error => {
            this.hideMainSpinner();
        })
 }


  getEmailSetting(){
    this.showMainSpinner();
    this._vendorsServiceProxy.getVendorSetting().subscribe(res=>{
                      this.getOnlineSetting = res;
                      this.createOrEditEmail = res;
                      console.log(`The value of Notification Email is ${JSON.stringify(this.getOnlineSetting)}`);
                      this.hideMainSpinner();
    },error =>{
       
        this.hideMainSpinner();
    })

  }
  Edit(Id: number){
    if(Id == null){
     this.createOrEditEmail = new VendorOnlineSettingDto();
    }
    else if(Id == undefined){
        this.createOrEditEmail = new VendorOnlineSettingDto();
    }
    else{
        this.showMainSpinner();
        this._vendorsServiceProxy.getVendorSettingById(Id).subscribe(res=>{
            this.createOrEditEmail = res;
            this.hideMainSpinner();
        },error =>{
            this.hideMainSpinner();
        })
    }
  }

  Save(ngForm: NgForm){
    if( this.createOrEditEmail.id == undefined){

        this.message.confirm(
            this.l("Do you want to Proceed"),
            this.l("AreYouSure"),
            (isConfirmed)=>{
                if(isConfirmed){
                    this.saving = true;
                    console.log(`The  createOrEditEmail is ${JSON.stringify(this.createOrEditEmail)}`);
                    this._vendorsServiceProxy.vendorOnlineEmailReceiverSetting(this.createOrEditEmail).subscribe(()=>{
                        this.message.success("Save successfully");
                        this.getEmailSetting();
                      //  ngForm.resetForm();
                        this.saving = false;
                    }, error =>{
                        this.saving = false;
                        this.message.error('An error occur while saving');
                    })
                }
            }
        )
    }
    else{

        this.message.confirm(
            this.l("Do you want to Proceed"),
            this.l("AreYouSure"),
            (isConfirmed)=>{
                if(isConfirmed){
                    this.saving = true;
                    console.log(`The  createOrEditEmail is ${JSON.stringify(this.createOrEditEmail)}`);
                    this._vendorsServiceProxy.updateVendorOnlineEmailReceiverSetting(this.createOrEditEmail).subscribe(()=>{
                        this.message.success("Updated successfully");
                        this.getEmailSetting();
                        this.saving = false;
                    }, error =>{
                        this.saving = false;
                        this.message.error('An error occur while saving');
                    })
                }
            }
        )

    }

  }

}
