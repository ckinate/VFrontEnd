import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { FileuploadComponent } from '@app/main/FileDocuments/fileupload/fileupload.component';
import { Country, ICountry } from '@app/shared/common/helper/country';
import { AppComponentBase } from '@shared/common/app-component-base';
import { BankDto, BankServiceServiceProxy, CashAdvanceServiceServiceProxy, CreateVendorAContactInput, CreateVendorEmailAndPhoneNumberInput, CreateVendorForeignAccountInput, CreateVendorQuestionairInput, DocumentServiceProxy, DocumentUploadDto, DocumentUploadsServiceProxy, EditVendorBeneficiaryAccountProfileInput, EditVendorContactInput, EditVendorEmailAndPhoneNumberInput, EditVendorForeignAccountInput, EditVendorInput, EditVendorWithDetailsInput, QuestionaresServiceProxy, UserServiceProxy, VendorCategoryDto, VendorsServiceProxy, VendorSubCategoryDto } from '@shared/service-proxies/service-proxies';
import { DateTime } from 'luxon';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FileItem } from 'ng2-file-upload';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'edit-unapproved-vendor',
  templateUrl: './edit-unapproved-vendor.component.html',
  styleUrls: ['./edit-unapproved-vendor.component.css']
})
export class EditUnapprovedVendorComponent extends AppComponentBase implements OnInit {

    @ViewChild('editVendorModal', { static: true }) modal: ModalDirective;
    @ViewChild('appfileupload', { static: true }) appfileupload: FileItem;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    // @ViewChild('appdocuments', { static: true }) appdocuments: DocumentsComponent;
    @ViewChild('fileUpload', { static: true }) fileUpload: FileuploadComponent;

    active = false;
    saving = false;
    EditVendor: EditVendorWithDetailsInput = new EditVendorWithDetailsInput();
    vendor: EditVendorInput = new EditVendorInput();
    Questionarelist: any;
    userBankProfile: EditVendorBeneficiaryAccountProfileInput = new EditVendorBeneficiaryAccountProfileInput();
    vendorEmailAndPhoneNumberDto: EditVendorEmailAndPhoneNumberInput = new EditVendorEmailAndPhoneNumberInput();
    vendorContactDetailsDto: EditVendorContactInput = new EditVendorContactInput();
    vendorForeignAccountDto: EditVendorForeignAccountInput = new EditVendorForeignAccountInput();
    vendorContactDetailsList: any;
    vendorEmailAndPhoneNumberList: any;
    vendorForeignAccountDtoList: any;
    docUplSetupList: DocumentUploadDto[];
    VendorQueResp = [];
    VendorId: any;
    SubCategory: VendorSubCategoryDto[] = [];
    VenCategory: VendorCategoryDto[] = [];
    vcid: any;
    VendorCategoryId: any;
    Banks: BankDto[] = [];
    selectedBank: string = null;
    selectedoperationId = 23;
    listOfCountries: ICountry[];
    selectedCountry: ICountry;
    //subcategoryId : any = null;
    selectedMobileCountry: ICountry;
    selectedContactCountry: ICountry;
    selectedExContactCountry: ICountry;
    selectedCountryEmail: ICountry;
    officePhone = '';
    phone = "";
    myDate: string = '2022-03-02';


    id: string;
    filterText = '';
    companyNameFilter = '';
    addressFilter = '';
    officePhoneFilter = '';
    mobileFilter = '';
    emailFilter = '';
    maxDateRegisteredFilter = DateTime.local();
    minDateRegisteredFilter = DateTime.local();
    maxTaxIdentificationNumberFilter: number;
    maxTaxIdentificationNumberFilterEmpty: number;
    minTaxIdentificationNumberFilter: number;
    minTaxIdentificationNumberFilterEmpty: number;
    contactPersonFilter = '';
    contactDesignationFilter = '';
    contactPhoneFilter = '';
    contactEmailFilter = '';
    faxFilter = '';
    websiteFilter = '';
    companyTypeFilter = '';
    vendorStatus = 2;
    vendorNumber = '';
    ContactPhone = '';
    ContactEmail = '';
    AddMoreEmail = '';
    date = new Date();
    //==============================
    attachId: string;
    bsValue = new Date();
    bsRangeValue: Date[];
    maxDate = new Date();
    isAddMoreContactDetails = false;
    isAddMoreEmailDetails = false;
    isAddMoreForeignDetails = false;
    mobile = "";
    phoneNumber = "";
    subcategoryId : any = null;
  vendorCategoryId : number;
   isComment: boolean = false ;
   subCategoryArray: VendorSubCategoryDto[] = []

  constructor( injector: Injector,
    private _vendorsServiceProxy: VendorsServiceProxy,
    private _DocUp: DocumentUploadsServiceProxy,
    private _Quest: QuestionaresServiceProxy,
    private _userService: UserServiceProxy,
    private _bankService: BankServiceServiceProxy,
    private _cashAdvance: CashAdvanceServiceServiceProxy,
    private _documentService: DocumentServiceProxy,) {
    super(injector);
    this.listOfCountries = Country.listOfCountries;
  }

  dropdownSettings : IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'narration',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 10,
    allowSearchFilter: true
  };
  @ViewChild('testSubCategory') testSubCategory;

  ngOnInit(): void {
    this.getQuestionaire();
    this.getDocumentUpload();
    this.getVenCategory();

    this.loadBankList();
    this.onCountryPressForEmailandPhone(document.getElementById('dial_codeId'));

    this.bsRangeValue = [this.bsValue, this.maxDate];
    this.listOfCountries = Country.listOfCountries;
    this.bsRangeValue = [this.bsValue, this.maxDate];
    this.selectedCountry = this.listOfCountries.find(x => x.code === 'NG');
    this.selectedMobileCountry = this.listOfCountries.find(x=>x.code === 'NG');
    this.selectedContactCountry = this.listOfCountries.find(x=>x.code === 'NG');
    this.selectedExContactCountry = this.listOfCountries.find(x=>x.code === 'NG');
    this.selectedCountryEmail = this.listOfCountries.find(x=>x.code === 'NG');
  }

  selectFeeType(event:any){
    console.log(`The value selected is ${JSON.stringify(event)}`);
    console.log(`The value of selected Items is ${JSON.stringify(this.subCategoryArray)}`);
}
onSelectAllFeeType(items: any) {
  console.log(`The value of unselected Item is ${items}`);

}
onDeSelectFeeType(items: any) {}

show(vendorId): void {

  this.isComment = false

  this.isAddMoreContactDetails = false;
  this.isAddMoreEmailDetails = false;
  this.isAddMoreForeignDetails = false;
  this._vendorsServiceProxy.getUnApprovedVendorForModification(vendorId).subscribe(result => {
    this.vendor = result.vendor;

    this.bsValue = new Date(result.vendor.dateRegistered.toISODate()) ;
    this.vendorCategoryId = result.vendor.vendorCategoryId;
    this.subcategoryId = result.vendor.subcategoryId;


    console.log(`The value of vendor reason is ${this.vendor.reason}`);
    if(this.vendor.reason != null){
       this.isComment = true;
    }
    //Office Phone
    let phoneNumberSpliter = result.vendor.officePhone.split('-');
    let pN = "";
    for(let i = 1; i<phoneNumberSpliter.length; i++)
    {
      if (i==1) {
        pN += phoneNumberSpliter [i];
      }
      else{
        pN += '-' + phoneNumberSpliter [i];
      }

    }
    let code = pN ?? undefined;
    this.officePhone = code ?? result.vendor.officePhone;
    this.selectedCountry = code === undefined ? this.listOfCountries.find(x => x.code === 'NG') : this.listOfCountries.find(x => x.dial_code === result.vendor.officePhone.split('-')[0]);

     //Mobile
     let mobileSpliter = result.vendor.mobile.split('-');
     let mN = '';
     for(let i = 1; i<mobileSpliter.length; i++)
     {
      if (i==1) {
        mN += mobileSpliter [i];
      }
      else{
        mN += '-' + mobileSpliter [i];
      }

     }

     let MobileCode = mN ?? undefined;
     this.mobile = MobileCode ?? result.vendor.mobile;
     this.selectedMobileCountry = MobileCode === undefined ? this.listOfCountries.find(x => x.code === 'NG') : this.listOfCountries.find(x => x.dial_code === result.vendor.mobile.split('-')[0]);
     mN = result.vendor.mobile

    let contactSpliter = result.vendor.contactPhone === null ? '': result.vendor.contactPhone.split('-');
    let cP = '';
    for(let i = 1; i<contactSpliter.length; i++)
    {
      if (i==1) {
        cP += contactSpliter [i];
      }
      else{
        cP += '-' + contactSpliter [i];
      }

    }

    let contactCode = cP ?? undefined;
    this.ContactPhone = contactCode ?? result.vendor.contactPhone;
    this.selectedContactCountry = contactCode === '' ? this.listOfCountries.find(x => x.code === 'NG') : this.listOfCountries.find(x => x.dial_code === result.vendor.contactPhone.split('-')[0]);
    cP = result.vendor.contactPhone

    this.userBankProfile = result.bankProfile;
    this.Questionarelist = result.questResponse;
    this.vendorContactDetailsList = result.extraContatPerson;
    this.vendorEmailAndPhoneNumberList = result.extraEmailAndPhone;
    this.vendorForeignAccountDtoList = result.extraForeignAccount;
    if (this.vendorContactDetailsList) {
      this.isAddMoreContactDetails = this.vendorForeignAccountDtoList.length;
    }
    if (this.vendorEmailAndPhoneNumberList) {
      this.isAddMoreEmailDetails = this.vendorForeignAccountDtoList.length;
    }
    if (this.vendorForeignAccountDtoList) {
      this.isAddMoreForeignDetails = this.vendorForeignAccountDtoList.length;
    }
    if (this.vendor.vendorCategoryId != null) {


      this.SubCategory = [];

      this._vendorsServiceProxy.getVendorSubCatByCatId(this.vendor.vendorCategoryId).subscribe((result: any) => {


        this.vendor.subCategoryIds.forEach(x=>{
          result.forEach(y=>{
              if(y.id==x){


                this.subCategoryArray.push(y);
              }
          })
          this.SubCategory = result;


       })
       console.log(`The subCategory Array data is ${JSON.stringify(this.subCategoryArray) }`);
       console.log(`The subCategoryID Array  is ${JSON.stringify(this.SubCategory) }`);
      });

    }


    this.active = true;
    this.modal.show();
  });
}



saveVendor(): void {
  this.vendor.subCategoryIds = []


  if( this.vendor.useforeignAccount == true && (this.vendorForeignAccountDtoList == undefined ||  this.vendorForeignAccountDtoList.length < 1)){

      return this.message.error(`Atleast one foreign Bank Accounts is Required`);

  }

  console.log(`The value of SubCategory array is ${JSON.stringify(this.vendor.subCategoryIds) }`)
  var IsQuestionaireOkay = true;
  this.Questionarelist.forEach(x=>{
      if(x.isCompulsory == true && x.response ==""){
          IsQuestionaireOkay = false;

      }
  })
  if(IsQuestionaireOkay == true){

      debugger;
  if (this.userBankProfile.beneficiaryAccountNumber.toString().length === 10 ) {
    if (this.mobile.toString().length > 10) {
      if (this.officePhone.toString().length > 10) {
              if (( this.subCategoryArray.length != 0)) {
                if ((this.vendorCategoryId != null || this.vendorCategoryId != 0)) {
                    this.subCategoryArray.forEach(x=>{
                        this.vendor.subCategoryIds.push(x.id)
                    });
                  this.saving = true;
                  this.userBankProfile.beneficiaryCurrencyCode = 'NGN';
                  this.userBankProfile.beneficiaryType = 2;
                  this.vendor.attatchId = this.id;
                  this.EditVendor.vendor = this.vendor;

                  this.EditVendor.vendor.vendorCategoryId = this.vendorCategoryId;


                  this.EditVendor.bankProfile = this.userBankProfile;
                  this.EditVendor.questResponse = this.Questionarelist;
                  this.EditVendor.extraContatPerson = this.vendorContactDetailsList;
                  this.EditVendor.extraEmailAndPhone = this.vendorEmailAndPhoneNumberList;
                  this.EditVendor.extraForeignAccount = this.vendorForeignAccountDtoList;
                    this._vendorsServiceProxy.addVendorToTemporaryTable(this.EditVendor)
                    .pipe(finalize(() => { this.saving = false; }))
                    .subscribe((result) => {
                      this.EditVendor.vendor = new EditVendorInput;
                      this.EditVendor.bankProfile = new EditVendorBeneficiaryAccountProfileInput;


                      localStorage.removeItem('attachId');
                      localStorage.clear();
                      this.notify.info(this.l('SavedSuccessfully'));
                      this.close();
                      this.modalSave.emit(null);
                    },(error)=>{
                      this.saving = false;

                    });
                }
                else{
                  this.message.error(this.l('Vendor Category Cannot be Blank'));
                }
              }
              else{
                this.message.error(this.l('Vendor Sub-Category Cannot be Blank'));
              }
      }
      else{
        alert('Office Phone must be Minimum of 11 (Eleven) characters!');
      }
    }
    else{
      alert('Mobile must be Minimum of 11 (Eleven) characters!');
    }
  }
    else{
      alert('Account Number must be 10 (ten) characters!');
  }

  }
  else{
      return this.message.error("One or More Questionaire Response is Required");
  }


}
onSelectedCountry(item: ICountry) {
  this.selectedCountry = item;
  this.vendor.officePhone = item.dial_code + '-'+ this.officePhone;
  console.log(this.vendor.officePhone);
}
onCountryPress(event) {
  this.officePhone = (<HTMLInputElement>event.target).value
  this.vendor.officePhone = this.selectedCountry.dial_code + '-'+ this.officePhone
  console.log(this.vendor.officePhone);
  let inp = String.fromCharCode(event.keyCode);
  if (/[0-9-+ ]/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

onSelectedCountryForMobile(item: ICountry) {
  this.selectedMobileCountry = item;
  this.vendor.mobile = item.dial_code +'-'+ this.mobile

}
onCountryPressForMobile(event) {
  this.mobile = (<HTMLInputElement>event.target).value
  this.vendor.mobile = this.selectedMobileCountry.dial_code +'-'+ this.mobile
  console.log(`The value of Mobile Number is ${ this.vendor.mobile}`);
  console.log(`The value of Mobile is ${this.mobile}`);
  let inp = String.fromCharCode(event.keyCode);
  if (/[0-9-+ ]/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

onSelectedCountryForContactP(item: ICountry) {
  this.selectedContactCountry = item;
  this.vendor.contactPhone = item.dial_code +'-'+ this.ContactPhone

}
onCountryPressForContactP(event) {
  this.ContactPhone = (<HTMLInputElement>event.target).value
      this.vendor.contactPhone = this.selectedContactCountry.dial_code +'-'+ this.ContactPhone
  console.log(this.vendor.contactPhone);
  let inp = String.fromCharCode(event.keyCode);
  if (/[0-9-+ ]/.test(inp)) {

    return true;
  } else {
    event.preventDefault();
    return false;
  }
}
CountryKeyPressForContactP(event) {

  let inp = String.fromCharCode(event.keyCode);
  if (/[0-9-+ ]/.test(inp)) {

    return true;
  } else {
    event.preventDefault();
    return false;
  }
}
onSelectedCountryForEmailandPhone(item: ICountry) {
  this.selectedCountryEmail = item;
  this.vendorEmailAndPhoneNumberDto.phoneNumber = item.dial_code +'-'+ this.phoneNumber

}
onCountryPressForEmailandPhone(event) {
  this.phoneNumber = (<HTMLInputElement>event.target).value
  this.vendorEmailAndPhoneNumberDto.phoneNumber = this.selectedCountryEmail.dial_code +'-'+ this.phoneNumber
  console.log(this.vendorEmailAndPhoneNumberDto.phoneNumber);
  let inp = String.fromCharCode(event.keyCode);
  if (/[0-9-+ ]/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}
onSelectedCountryForExtraCont(item: ICountry) {
  this.selectedExContactCountry = item;
  this.vendorContactDetailsDto.phone = item.dial_code +'-'+ this.phone

}
onCountryPressForExtraCont(event) {
  this.phone = (<HTMLInputElement>event.target).value
  this.vendorContactDetailsDto.phone = this.selectedExContactCountry.dial_code +'-'+ this.phone
  console.log(this.vendorContactDetailsDto.phone);
  let inp = String.fromCharCode(event.keyCode);
  if (/[0-9-+ ]/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}
getQuestionaire() {
  this.Questionarelist = new Array<CreateVendorQuestionairInput>();
  this._Quest.getAllQuestionairList().subscribe(items => {
    items.forEach(item => {
      let question = new CreateVendorQuestionairInput();
      question.question = item.question;
      question.isCompulsory = item.isCompulsory;
      question.questionareId = 0;
      question.response = '';
      this.Questionarelist.push(question);
    });
  });
}

getVenCategory() {
  this._vendorsServiceProxy.getVenCategory().subscribe((result: any) => {
    this.VenCategory = result;
  });
}

getVenSubCategory(vcid) {
  this.SubCategory = [];
  this._vendorsServiceProxy.getVendorSubCatByCatId(vcid).subscribe((result: any) => {
    this.SubCategory = result;
  });
}

OnSelectCategory(value) {
  this.subcategoryId = null;
  this.VendorCategoryId = value;
  this.getVenSubCategory(this.VendorCategoryId);
}

loadBankList() {
  this._bankService.getBankList().subscribe(result => {
    this.Banks = result;
    console.log('Bank: ' + result);
  }
  );
}

close(): void {
  this.active = false;
  this.modal.hide();
}

getDocumentUpload() {
  this._DocUp.getAllDocumentUploadList().subscribe(x => {
    this.docUplSetupList = x;
  });
}

keyPressNumbersDecimal(event) {
  let charCode = (event.which) ? event.which : event.keyCode;
  if (charCode !== 46 && charCode > 31
    && (charCode < 48 || charCode > 57)) {
    event.preventDefault();
    return false;
  }
  return true;
}

keyPressNumeric(event) {
  let inp = String.fromCharCode(event.keyCode);
  if (/[0-9]/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}
keyPressNumericWithHyphen(event) {
  let inp = String.fromCharCode(event.keyCode);
  if (/[0-9-]/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}
getAttach() {
  let getJSON = localStorage.getItem('attachId');
  if (getJSON) {
    localStorage.setItem('attachId', getJSON);
    this.attachId = JSON.parse(getJSON);
  }
}

checkLocalstorage() {
  this.getAttach();
  if (this.attachId === null || this.attachId === undefined) {
    this._cashAdvance.getAttachId().subscribe((x) => {
      let sendJSON = JSON.stringify(x);
      this.attachId = x;
      localStorage.setItem('attachId', sendJSON);
    });
  }
  this.vendor.attatchId = this.attachId;
}

showDocument() {
  this._cashAdvance.getAttachId().subscribe((x) => {
    this.id = x;

    this.fileUpload.ShowAttachment(this.id, 23);
  });
}

checkFileDetails(event) {

  for (let i = 0; i < event.target.files.length; i++) {
    let name = event.target.files[i].name;
    let type = event.target.files[i].type;
    let size = event.target.files[i].size;
    let modifiedDate = event.target.files[i].lastModifiedDate;
    if (Math.round(size / 1024) > 1024) {
      alert('The file exceed the file size.\n\nPlease ensure the file is within the right file size range!');
    }
  }
}

ViewDocument(id: any) {

  debugger;
  this._documentService.getFilesByUniqueIDAndOPID(id, this.selectedoperationId, 2).subscribe(x => {
    if (x.length > 0) {

      this.fileUpload.ShowAttachmentByRef(id, this.selectedoperationId);
    } else {
      this.message.warn(
        'No attachment was added'
      );
    }
  });
}
AddMoreContactDetails() {
  if (this.isAddMoreContactDetails === true) {
    this.isAddMoreContactDetails = false;
  } else if (this.isAddMoreContactDetails === false) {
    this.vendorContactDetailsDto = new EditVendorContactInput();
    this.isAddMoreContactDetails = true;
  } else {
    this.isAddMoreContactDetails = false;
  }
}

AddMoreEmailDetails() {
  if (this.isAddMoreEmailDetails === true) {
    this.isAddMoreEmailDetails = false;
  } else if (this.isAddMoreEmailDetails === false) {
    this.vendorEmailAndPhoneNumberDto = new EditVendorEmailAndPhoneNumberInput();
    this.isAddMoreEmailDetails = true;
  } else {
    this.isAddMoreEmailDetails = false;
  }
}

AddMoreForeignDetails() {
  if (this.isAddMoreForeignDetails === true) {
    this.isAddMoreForeignDetails = false;
  } else if (this.isAddMoreForeignDetails === false) {
    this.isAddMoreForeignDetails = true;
  } else {
    this.isAddMoreForeignDetails = false;
  }
}



AddMoreContactDetailsItem() {
  debugger;
  console.log(this.vendorContactDetailsDto.contactName );

  if (this.vendorContactDetailsList == null) {
    this.vendorContactDetailsList =  new Array<CreateVendorAContactInput>();
  }
  else if (this.vendorContactDetailsDto.contactName == undefined && this.vendorContactDetailsDto.email == undefined && this.phone == '' ) {
    this.message.error(this.l('Please Enter Value For Contact Name And Either Email Or Phone Number'));
  }
  else if (this.vendorContactDetailsDto.contactName != undefined && this.vendorContactDetailsDto.email == undefined && this.phone == '' ) {
    this.message.error(this.l('Please Enter Value For Either Email Or Phone Number'));
  }
  else if (this.vendorContactDetailsDto.contactName == undefined && this.vendorContactDetailsDto.email == undefined && this.phone != '' ) {
    this.message.error(this.l('Please Enter Value For Contact Name'));
  }
  else if (this.vendorContactDetailsDto.contactName == undefined && this.vendorContactDetailsDto.email != undefined && this.phone == '' ) {
    this.message.error(this.l('Please Enter Value For Contact Name'));
  }
  else if (this.vendorContactDetailsDto.contactName == undefined || this.vendorContactDetailsDto.contactName == '' && this.vendorContactDetailsDto.email != undefined && this.phone != '' ) {
    this.message.error(this.l('Please Enter Value For Contact Name'));
  }
  else if(this.phone == ''){
    this.vendorContactDetailsList.push(this.vendorContactDetailsDto);
    this.vendorContactDetailsDto = new EditVendorContactInput();
    console.log(this.vendorContactDetailsList);
  }
  else{
    this.vendorContactDetailsDto.phone = this.selectedExContactCountry.dial_code +'-'+ this.phone
    this.vendorContactDetailsList.push(this.vendorContactDetailsDto);
    this.vendorContactDetailsDto = new EditVendorContactInput();
    this.phone = '';
    console.log(this.vendorContactDetailsList);
  }

}
RemoveMoreContactDetailsItem(index: number) {
  this.vendorContactDetailsList.splice(index, 1);
}


AddMoreEmailDetailsItem() {
  debugger;
  console.log(this.phoneNumber);

  if (this.vendorEmailAndPhoneNumberList == null) {
    this.vendorEmailAndPhoneNumberList =  new Array<CreateVendorEmailAndPhoneNumberInput>();
  }
  if ((this.vendorEmailAndPhoneNumberDto.email == undefined || this.vendorEmailAndPhoneNumberDto.email === '') && this.phoneNumber == '' ) {
    this.message.error(this.l('Please Enter Value For Either Email Or Phone Number'));
  }
   else if(this.phoneNumber != '')
    {

    this.vendorEmailAndPhoneNumberDto.phoneNumber = this.selectedCountryEmail.dial_code +'-'+ this.phoneNumber;
    this.vendorEmailAndPhoneNumberList.push(this.vendorEmailAndPhoneNumberDto);
    this.vendorEmailAndPhoneNumberDto = new EditVendorEmailAndPhoneNumberInput();
    this.phoneNumber = '';
    console.log(this.vendorEmailAndPhoneNumberList);
   }
   else{
    this.vendorEmailAndPhoneNumberList.push(this.vendorEmailAndPhoneNumberDto);
    this.vendorEmailAndPhoneNumberDto = new EditVendorEmailAndPhoneNumberInput();
    this.phoneNumber = '';
    console.log(this.vendorEmailAndPhoneNumberList);
   }
}
RemoveGetMoreEmailDetailsItem(index: number) {
  this.vendorEmailAndPhoneNumberList.splice(index, 1);
}

AddMoreForeignDetailsItem() {
  debugger;
  if (this.vendorForeignAccountDtoList == null) {
    this.vendorForeignAccountDtoList = new Array<CreateVendorForeignAccountInput>();
  }
  if (this.vendorForeignAccountDto.foreignAccountName === '') {
    this.message.warn(this.l('Please Enter A Foreign AccountName!'));
  } else if (this.vendorForeignAccountDto.foreignAccountNumber === '') {
    this.message.warn(this.l('Please Enter A Foreign AccountNumber!'));
  } else if (this.vendorForeignAccountDto.foreignBank === '') {
    this.message.warn(this.l('Please Enter A Foreign Bank!'));
  } else if (this.vendorForeignAccountDto.foreignBankCode === '') {
    this.message.warn(this.l('Please Enter A Foreign BankCode!'));
  } else if (this.vendorForeignAccountDto.foreignCountry === '') {
    this.message.warn(this.l('Please Enter A Foreign Country!'));
  }

    this.vendorForeignAccountDtoList.push(this.vendorForeignAccountDto);
    this.vendorForeignAccountDto = new EditVendorForeignAccountInput();

}

RemoveForeignDetailsItem(index: number) {
  this.vendorForeignAccountDtoList.splice(index, 1);
}

keyPressAlphaNumericWithCharacters(event) {

  let inp = String.fromCharCode(event.keyCode);
  if (/[0-9-+ ]/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

}
