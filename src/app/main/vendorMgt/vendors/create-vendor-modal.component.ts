import { Component, ViewChild, Injector, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { VendorsServiceProxy,
   DocumentServiceProxy,
   DocumentUploadDto,
   QuestionaresServiceProxy,
   DocumentUploadsServiceProxy,
   VendorSubCategoryDto,
   VendorCategoryDto,
   UserServiceProxy,
   BankServiceServiceProxy,
   BankDto,
   CashAdvanceServiceServiceProxy,
   CreateVendorWithDetailsInput,
   CreateVendorInput,
   CreateVendorQuestionairInput,
   CreateVendorBeneficiaryAccountProfileInput,
   CreateVendorEmailAndPhoneNumberInput,
   CreateVendorAContactInput,
   CreateVendorForeignAccountInput,
   BankManagerServiceServiceProxy,
   BeneficiaryAccountProfilesServiceProxy,
   CreateOrEditBeneficiaryAccountProfileDto,
   WorkflowServiceServiceProxy,
   WorkflowQueryDto,
   GeneralOperationsServiceServiceProxy,
   CurrencyDto} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import {CountryCode, getCountryCallingCode, parsePhoneNumber} from 'libphonenumber-js'
import { DateTime } from 'luxon';
//import { FileUploadModule } from 'ng2-file-upload/file-upload/file-upload.module';
import { FileItem } from 'ng2-file-upload';

import { FileuploadComponent } from '@app/main/FileDocuments/fileupload/fileupload.component';
import { Country, ICountry } from '@app/shared/common/helper/country';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SubCategoryModel } from './subCategoryModel';

@Component({
  selector: 'createVendorModal',
  templateUrl: './create-vendor-modal.component.html',
  styleUrls: ['./create-or-edit-vendor-modal.component.css']
})
export class CreateVendorModalComponent extends AppComponentBase implements OnInit {

  @ViewChild('createVendorModal', { static: true }) modal: ModalDirective;
  @ViewChild('appfileupload', { static: true }) appfileupload: FileItem;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  // @ViewChild('appdocuments', { static: true }) appdocuments: DocumentsComponent;
  @ViewChild('fileUpload', { static: true }) fileUpload: FileuploadComponent;

  active = false;
  saving = false;
  CreateVendor: CreateVendorWithDetailsInput = new CreateVendorWithDetailsInput();
  vendor: CreateVendorInput = new CreateVendorInput();

  Questionarelist: any;
  userBankProfile: CreateVendorBeneficiaryAccountProfileInput = new CreateVendorBeneficiaryAccountProfileInput();
  vendorEmailAndPhoneNumberDto: CreateVendorEmailAndPhoneNumberInput = new CreateVendorEmailAndPhoneNumberInput();
  vendorContactDetailsDto: CreateVendorAContactInput = new CreateVendorAContactInput();
  vendorForeignAccountDto: CreateVendorForeignAccountInput = new CreateVendorForeignAccountInput();
  BeneF: CreateOrEditBeneficiaryAccountProfileDto = new CreateOrEditBeneficiaryAccountProfileDto();
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
   listOfCountries : ICountry[];
selectedCountry: ICountry;
selectedMobileCountry: ICountry;
selectedContactCountry: ICountry;
selectedExContactCountry: ICountry;
selectedCountryEmail: ICountry;
officePhone = '';
subcategoryId : any = null;
vendorCategoryId : number;

  id: string;
  filterText = '';
  companyNameFilter = '';
  addressFilter = '';
  officePhoneFilter = '';
  mobile = '';
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
  phoneNumber = '';
  phone = '';
  processing: boolean = false;
  //==============================
  attachId: string;
 bsValue = new Date();
 bsRangeValue: Date[];
  maxDate = new Date();
  isAddMoreContactDetails = false;
  isAddMoreEmailDetails = false;
  isAddMoreForeignDetails = false;
  dateRegister = new Date();
  subCategoryArray: SubCategoryModel[] = []
  tinPattern: string[] = [];
  currencyDtoList: CurrencyDto[] = [];



  constructor(
    injector: Injector,
    private _vendorsServiceProxy: VendorsServiceProxy,
    private _DocUp: DocumentUploadsServiceProxy,
    private _Quest: QuestionaresServiceProxy,
    private _userService: UserServiceProxy,
    private _BenService: BeneficiaryAccountProfilesServiceProxy,
    private _bankService: BankServiceServiceProxy,
    private _Bservice: BankManagerServiceServiceProxy,
    private _cashAdvance: CashAdvanceServiceServiceProxy,
    private _documentService: DocumentServiceProxy,
    private _generalOperationsService:GeneralOperationsServiceServiceProxy

  ) {
    super(injector);
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

  ngOnInit(): void {
    this.checkLocalstorage();
    this.getQuestionaire();
    this.getDocumentUpload();
    this.getVenCategory();
    this.getTinValidation();

   this.getVenSubCategory;
    this.loadBankList();
    this.getCurrency();
    this.getEmailSetting();
    this.listOfCountries = Country.listOfCountries;
    this.bsRangeValue = [this.bsValue, this.maxDate];
    this.selectedCountry = this.listOfCountries.find(x=>x.code === 'NG');
    this.selectedMobileCountry = this.listOfCountries.find(x=>x.code === 'NG');
    this.selectedContactCountry = this.listOfCountries.find(x=>x.code === 'NG');
    this.selectedExContactCountry = this.listOfCountries.find(x=>x.code === 'NG');
    this.selectedCountryEmail = this.listOfCountries.find(x=>x.code === 'NG');
    this.onCountryPressForEmailandPhone(document.getElementById('dial_codeId'));
    this.vendor.dateRegistered = DateTime.fromJSDate(this.dateRegister);
   
    
    


  }
  changeCurrency(currencyName) {
    if (currencyName) {
      this.userBankProfile.beneficiaryCurrencyCode = this.currencyDtoList.find(x => x.currencyName == currencyName)?.currencyCode;
    }
    
  }
  getEmailSetting(){
    
    this._vendorsServiceProxy.getVendorSetting().subscribe(res=>{
                      
      this.userBankProfile.beneficiaryCurrencyCode = this.currencyDtoList.find(x => x.currencyName == res.defaultCurrency)?.currencyCode;
      this.userBankProfile.beneficiaryCurrencyName = res.defaultCurrency
      console.log(`The value of beneficially Currency Code is ${this.userBankProfile.beneficiaryCurrencyCode}`)
      console.log(`The value of beneficially Currency  is ${this.userBankProfile.beneficiaryCurrencyName}`)
                      
                      this.hideMainSpinner();
    },error =>{
       
        this.hideMainSpinner();
    })

  }

  getCurrency() {
    this.showMainSpinner();
    console.log(`The get currency `);
    
    this._generalOperationsService.getCurrencyList().subscribe(res => {
      this.currencyDtoList = res;
      console.log(`The currency value is ${JSON.stringify(res)}`)
      this.getEmailSetting();
        this.hideMainSpinner();
    }, error => {
        this.hideMainSpinner();
    })
}


  selectFeeType(event:any){}
  onSelectAllFeeType(items: any) {
    console.log(`The value of unselected Item is ${items}`);

  }
  onDeSelectFeeType(items: any) {}
  show(): void {
    this.isAddMoreContactDetails = false;
    this.isAddMoreEmailDetails = false;
    this.isAddMoreForeignDetails = false;

      this.active = true;
      this.modal.show();
  }

  limitForPhoneNumber(country: ICountry, phone?: string) {
    if (country.code === 'NG') {
      if (phone) {
        if (phone.charAt(0) !== '0') return 10
      }
      return 11
    }

    return 12
  }

  validatePhoneNumber(phone: string, country: ICountry) {
   try {
    const newPhone = `${phone}`;
    if (newPhone.length <= 0) return true;

    if (country.dial_code === `+${getCountryCallingCode('NG')}`) {
      if (!phone.charAt(0).match(/\d+/g)) return false
      if (phone.length < 10) return false
    }
    if (phone.includes("+")) return false

    const validatePhone = parsePhoneNumber(newPhone, country.code as CountryCode);
    return validatePhone.isValid()
   } catch{
    return false
   }
  }
  validateTin(){
    var tinIsValid = false;
    try{
        if( this.vendor.taxIdentificationNumber !=undefined && this.vendor.taxIdentificationNumber != null && this.vendor.taxIdentificationNumber != ""){
            if(this.tinPattern.length > 0){
                this.tinPattern.forEach(x=>{
                 if(this.vendor.taxIdentificationNumber.match(x) != null){
                    tinIsValid= true;
                 }
                })

            }
            else{
                tinIsValid = true;
            }
          }
          else{
            tinIsValid = true;
          }

    }
    catch{
        tinIsValid = false;
    }
    return tinIsValid;
  }

  saveVendor(): void {
    // tslint:disable-next-line:no-debugger
    if( this.vendor.useforeignAccount == true && (this.vendorForeignAccountDtoList == undefined ||  this.vendorForeignAccountDtoList.length < 1)){

        return this.message.error(`Atleast one foreign Bank Accounts is Required`);

    }
    if(this.vendor.contactEmail != undefined && this.vendor.contactEmail != ""){
        if(this.vendor.contactEmail.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/) == null){
           return this.message.error("The Contact email is Invalid");
        }

     }

     if(this.vendor.email != undefined && this.vendor.email != ""){
        if(this.vendor.email.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/) == null){
           return this.message.error("The email is Invalid");
        }

     }

    var IsQuestionaireOkay = true;
    this.vendor.subCategoryIds = []

    if (!this.validatePhoneNumber(this.officePhone, this.selectedCountry) || this.officePhone.length < 0) {
      return this.message.error('Invalid office phone number');
    }


    if (!this.validatePhoneNumber(this.mobile, this.selectedMobileCountry)  || this.mobile.length < 0) {
      return this.message.error('Invalid mobile number');
    }

    if (!this.validatePhoneNumber(this.ContactPhone, this.selectedContactCountry)) {
      return this.message.error('Invalid contact number');
    }

    if (!this.validatePhoneNumber(this.phoneNumber, this.selectedCountryEmail)) {
      return this.message.error('Invalid phone number');
    }


    if (!this.validatePhoneNumber(this.phone, this.selectedExContactCountry)) {
      return this.message.error('Invalid phone number');
    }

     this.Questionarelist.forEach(x=>{
         if(x.isCompulsory == true && (x.response =="" || x.response == null || x.response == undefined)){

             IsQuestionaireOkay = false;

         }
     })
     var tinIsValid = false;
      if( this.vendor.taxIdentificationNumber !=undefined && this.vendor.taxIdentificationNumber != null && this.vendor.taxIdentificationNumber != ""){
        if(this.tinPattern.length > 0){
            this.tinPattern.forEach(x=>{
             if(this.vendor.taxIdentificationNumber.match(x) != null){
                  tinIsValid = true;
             }
            })

        }
        else{
            tinIsValid = true;
        }
      }
      else{
        tinIsValid = true;
      }
    if( tinIsValid == false){
      return this.message.error("Tax Identification number not valid");
    }


    if(IsQuestionaireOkay == true){
        if (this.vendor.useforeignAccount == true || this.userBankProfile.beneficiaryAccountNumber.toString().length === 10 ) {
            if (( this.subCategoryArray.length != 0)) {
                if ((this.vendorCategoryId != null || this.vendorCategoryId != 0)) {
                    this.subCategoryArray.forEach(x=>{
                        this.vendor.subCategoryIds.push(x.id)
                    });

                  this.saving = true;
                  this.vendor.dateRegistered =DateTime.fromJSDate( this.dateRegister);
                  this.userBankProfile.beneficiaryCurrencyCode = 'NGN';
                  this.userBankProfile.beneficiaryType = 2;
                  this.vendor.attatchId = this.id;
                  this.vendor.vendorCategoryId = this.vendorCategoryId;
                 // this.vendor.subcategoryId = this.subcategoryId;
                  this.CreateVendor.vendor = this.vendor;
                  this.CreateVendor.vendor.officePhone = this.selectedCountry.dial_code + '-'+ this.officePhone;
                  this.CreateVendor.vendor.mobile = this.selectedMobileCountry.dial_code +'-'+ this.mobile;
                  this.CreateVendor.vendor.contactPhone = this.selectedContactCountry.dial_code +'-'+ this.ContactPhone;

                  this.CreateVendor.bankProfile = this.userBankProfile;
                  this.CreateVendor.questResponse = this.Questionarelist;
                  this.CreateVendor.extraContatPerson = this.vendorContactDetailsList;
                  this.CreateVendor.extraEmailAndPhone = this.vendorEmailAndPhoneNumberList;
                  this.CreateVendor.extraForeignAccount = this.vendorForeignAccountDtoList;

                  console.log(`The create Vendor Dto is ${JSON.stringify(this.CreateVendor)}`);

                    this._vendorsServiceProxy.createVendorInput(this.CreateVendor)
                    .pipe(finalize(() => { this.saving = false; }))
                    .subscribe((result) => {
                      this.CreateVendor.vendor = new CreateVendorInput;
                      this.CreateVendor.bankProfile = new CreateVendorBeneficiaryAccountProfileInput;
                     // this.CreateVendor.questResponse =  new CreateVendorQuestionairInput[];

                      localStorage.removeItem('id');
                      localStorage.clear();
                      this.notify.info(this.l('SavedSuccessfully'));
                      this.close();
                      this.modalSave.emit(null);
                    });
                }
                else{
                 // alert('Office Phone must be Minimum of 11 (Eleven) characters!');
                  this.message.error(this.l('Vendor Sub-Category Cannot be Blank'));
                }
              }
              else{
                //alert('Office Phone must be Minimum of 11 (Eleven) characters!');
                this.message.error(this.l('Vendor Category Cannot be Blank'));
              }
          }
            else{
              //alert('Account Number must be 10 (ten) characters!');
              this.message.error(this.l('Account Number must be 10 (ten) characters!'));
          }

    }
    else{
        return this.message.error("One or More Questionaire Response is Required");
    }

  }
AccVal(){
  if (this.userBankProfile.beneficiaryAccountNumber.length === 10) {
    this.validateAccount()
  }
  else{
    alert('Account Number Must be 10 digits')
  }
}
  validateAccount(){

    this.userBankProfile.beneficiaryCurrencyCode = 'NGN';
    this.userBankProfile.beneficiaryType = 2;
    this.BeneF = this.userBankProfile;
    this._BenService.accountValidation(this.BeneF).subscribe(result => { })
    this.userBankProfile.beneficiaryCurrencyName
    this.userBankProfile.beneficiaryCurrencyCode
  }

  validateAccount2(){

     if((this.userBankProfile.bankCode == undefined || this.userBankProfile.bankCode == "") || (this.userBankProfile.beneficiaryAccountNumber == undefined || this.userBankProfile.beneficiaryAccountNumber == "") || (this.userBankProfile.beneficiaryName == undefined || this.userBankProfile.beneficiaryName == "") ){
         return this.message.error("Please fill in Bank Name, Account No and Account Name")
       }

    if (this.userBankProfile.beneficiaryAccountNumber.length === 10) {
        this.processing = true;
        this.userBankProfile.beneficiaryCurrencyCode = 'NGN';
        this.userBankProfile.beneficiaryType = 2;
        this.BeneF = this.userBankProfile;
        this._BenService.accountValidationWithName2(this.BeneF).subscribe(res=>{
            this.processing = false;
            if(res.success == true){
                return this.message.success(`${res.message}`);
            }
            else{
                return this.message.info(`${res.message}`);
            }

        },error=>{
            this.processing = false;
        })
      }
      else{
        alert('Account Number Must be 10 digits')
      }

  }
onSelectedCountry(item:ICountry){
this.selectedCountry = item;
this.vendor.officePhone = item.dial_code + '-'+ this.officePhone;
console.log(this.vendor.officePhone);
}
onCountryPress(event)
{
  this.officePhone = (<HTMLInputElement>event.target).value
  this.vendor.officePhone = this.selectedCountry.dial_code + '-'+ this.officePhone
  console.log(this.vendor.officePhone.split
    ('-')[1]);
  let inp = String.fromCharCode(event.keyCode);
  if (/[0-9-+ ]/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

onSelectedCountryForMobile(item:ICountry){
  this.selectedMobileCountry = item;
  this.vendor.mobile = item.dial_code +'-'+ this.mobile
  //console.log(this.vendor.mobile);
  }
  onCountryPressForMobile(event)
  {
    this.mobile = (<HTMLInputElement>event.target).value
    this.vendor.mobile = this.selectedMobileCountry.dial_code +'-'+ this.mobile
   // console.log(this.vendor.mobile);
    let inp = String.fromCharCode(event.keyCode);
    if (/[0-9-]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  onSelectedCountryForContactP(item:ICountry){
    this.selectedContactCountry = item;
    this.vendor.contactPhone = item.dial_code +'-'+ this.ContactPhone
    //console.log(this.vendor.mobile);
    }
    onCountryPressForContactP(event)
    {
      this.ContactPhone = (<HTMLInputElement>event.target).value
      this.vendor.contactPhone = this.selectedContactCountry.dial_code +'-'+ this.ContactPhone
      console.log(this.vendor.contactPhone);
      let inp = String.fromCharCode(event.keyCode);
      if (/[0-9-]/.test(inp)) {
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }
    onSelectedCountryForEmailandPhone(item:ICountry){
      this.selectedCountryEmail = item;
      this.vendorEmailAndPhoneNumberDto.phoneNumber = item.dial_code +'-'+ this.phoneNumber
      console.log(this.vendorEmailAndPhoneNumberDto.phoneNumber);
      }
      onCountryPressForEmailandPhone(event)
      {
        this.phoneNumber = (<HTMLInputElement>event.target).value
        this.vendorEmailAndPhoneNumberDto.phoneNumber = this.selectedCountryEmail.dial_code +'-'+ this.phoneNumber
        console.log(this.vendorEmailAndPhoneNumberDto.phoneNumber);
        let inp = String.fromCharCode(event.keyCode);
        if (/[0-9-]/.test(inp)) {
          return true;
        } else {
          event.preventDefault();
          return false;
        }
      }
  getQuestionaire() {
    this.Questionarelist =  new Array<CreateVendorQuestionairInput>();
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
      console.log(result)
    });
  }

  getVenSubCategory(vcid) {
    this.SubCategory = [];
    this._vendorsServiceProxy.getVendorSubCatByCatId(vcid).subscribe((result: any) => {
      this.SubCategory = result;
      console.log(result);

    });
  }

  OnSelectCategory(value) {
    debugger
    this.subcategoryId = null;
    this.VendorCategoryId = value;
    this.getVenSubCategory(this.VendorCategoryId);
  }

  loadBankList() {
    debugger
    this._Bservice.getAllBankList().subscribe(result => {
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
    let getJSON = localStorage.getItem('id');
    if (getJSON) {
      localStorage.setItem('id', getJSON);
      this.attachId = JSON.parse(getJSON);
    }
  }

    checkLocalstorage() {
        this.getAttach();

      if (this.id === undefined || this.id === null) {
        console.log(`The attachID is ${this.id}`);
        this._cashAdvance.getAttachId().toPromise().then((x)=>{
            console.log(`The attachID in Promise is ${x}`);
            let sendJSON = JSON.stringify(x);
            this.id = x;


            localStorage.setItem('id', sendJSON);
        })

      }


       this.vendor.attatchId = this.id;
  }

  showDocument() {
        // this._cashAdvance.getAttachId().subscribe((x) => {
        //     this.id = x;


        //   });
          this.fileUpload.ShowAttachment(this.id, 23);
    }

  checkFileDetails (event) {
    // <input type="file" id="file" multiple (change)="getFileDetails($event)" />
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

// ViewDocument(id: any) {
//   // tslint:disable-next-line:no-debugger
//   debugger;
//   this._documentService.getFilesByUniqueIDAndOPID(id, this.selectedoperationId, 2).subscribe(x => {
//     if (x.length > 0) {
//      // this.appdocuments.ShowAttachmentByRef(id,this.selectedoperationId);
//      this.fileUpload.ShowAttachmentByRef(id, this.selectedoperationId);
//     } else {
//       this.message.warn(
//         'No attachment was added'
//     );
//     }
//   });
// }
 AddMoreContactDetails() {
    if (this.isAddMoreContactDetails === true) {
      this.isAddMoreContactDetails = false;
    } else if (this.isAddMoreContactDetails === false) {
      this.vendorContactDetailsDto = new CreateVendorAContactInput();
      this.isAddMoreContactDetails = true;
    } else {
      this.isAddMoreContactDetails = false;
    }
  }

  AddMoreEmailDetails() {
    if (this.isAddMoreEmailDetails === true) {
      this.isAddMoreEmailDetails = false;
    } else if (this.isAddMoreEmailDetails === false) {
      this.vendorEmailAndPhoneNumberDto = new CreateVendorEmailAndPhoneNumberInput();
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

  onSelectedCountryForExtraCont(item:ICountry){
    this.selectedExContactCountry = item;
    this.vendorContactDetailsDto.phone = item.dial_code +'-'+ this.phone
    //console.log(this.vendor.mobile);
    }
    onCountryPressForExtraCont(event)
    {
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
    validateEmail(){
        var emailIsValid = false;
        try{

        if(this.vendorContactDetailsDto.email != undefined && this.vendorContactDetailsDto.email != ""){
            if(this.vendorContactDetailsDto.email.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/) == null){
              emailIsValid = true;
            }

         }

        }
        catch{
          emailIsValid = false;
        }


    return emailIsValid;

    }

  AddMoreContactDetailsItem() {
     console.log(`The Additional Email is ${this.vendorContactDetailsDto.email }`)
     if(this.vendorContactDetailsDto.email != undefined && this.vendorContactDetailsDto.email != ""){
        if(this.vendorContactDetailsDto.email.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/) == null){
           return this.message.error("The email is Invalid");
        }

     }
     if (!this.validatePhoneNumber(this.phone, this.selectedExContactCountry)) {
        return this.message.error('Invalid phone number');
      }

    if (this.vendorContactDetailsList == null) {
      this.vendorContactDetailsList =  new Array<CreateVendorAContactInput>();
    }
    else if (this.vendorContactDetailsDto.contactName == undefined && this.vendorContactDetailsDto.email == undefined && this.phone == '' ) {
      this.message.error(this.l('Please Enter Value For Contact Name and Either Email Or Phone Number'));
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
    else if (this.vendorContactDetailsDto.contactName == undefined && this.vendorContactDetailsDto.email != undefined && this.phone != '' ) {
      this.message.error(this.l('Please Enter Value For Contact Name'));
    }
    else if(this.phone == ''){
      this.vendorContactDetailsList.push(this.vendorContactDetailsDto);
      this.vendorContactDetailsDto = new CreateVendorAContactInput();
      console.log(this.vendorContactDetailsList);
    }
    else{
      this.vendorContactDetailsDto.phone = this.selectedExContactCountry.dial_code +'-'+ this.phone
      this.vendorContactDetailsList.push(this.vendorContactDetailsDto);
      this.vendorContactDetailsDto = new CreateVendorAContactInput();
      this.phone = '';
      console.log(this.vendorContactDetailsList);
    }
  // let isValid = true;
  //   this.vendorContactDetailsList.forEach(element => {
  //     if (element.email === this.vendorContactDetailsDto.email || element.phone === this.phone) {
  //       isValid = false;
  //     }
  //   });
  //   if (isValid) {

  //   }
    // else{
    //   this.message.error(this.l('Either Phone Number Or Email Already Exist'))
    // }



  }

  RemoveMoreContactDetailsItem(index: number) {
    this.vendorContactDetailsList.splice(index, 1);
  }

  validateAddMoreEmail(){
    console.log(`The value of Add More Email is ${this.vendorEmailAndPhoneNumberDto.email}`);
    var emailIsValid = false;
    try{

    if(this.vendorEmailAndPhoneNumberDto.email != undefined && this.vendorEmailAndPhoneNumberDto.email != ""){
        if(this.vendorEmailAndPhoneNumberDto.email.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/) == null){
          emailIsValid = true;
        }

     }

    }
    catch{
      emailIsValid = false;
    }


return emailIsValid;

}

  AddMoreEmailDetailsItem() {

    console.log(`The value of Add More Email is ${this.vendorEmailAndPhoneNumberDto.email}`);

    if(this.vendorEmailAndPhoneNumberDto.email != undefined && this.vendorEmailAndPhoneNumberDto.email != ""){
        if(this.vendorEmailAndPhoneNumberDto.email.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/) == null){
           return this.message.error("The email is Invalid");
        }

     }

     if (!this.validatePhoneNumber(this.phoneNumber, this.selectedCountryEmail)) {
        return this.message.error('Invalid phone number');
      }

    if (this.vendorEmailAndPhoneNumberList == null) {
      this.vendorEmailAndPhoneNumberList =  new Array<CreateVendorEmailAndPhoneNumberInput>();
    }
    if ((this.vendorEmailAndPhoneNumberDto.email == undefined || this.vendorEmailAndPhoneNumberDto.email === '') && this.phoneNumber == '' ) {
      this.message.error(this.l('Please Enter Value For Either Email Or Phone Number'));
    }
     else if(this.phoneNumber != '')
      {
    //  let isValid = true;
    //  this.vendorEmailAndPhoneNumberList.forEach(element => {
    //    if (element.email == this.vendorEmailAndPhoneNumberDto.email || element.phoneNumber == this.selectedCountryEmail.dial_code) {
    //      isValid = false;
    //    }
    //  });
    // if (isValid) {
      this.vendorEmailAndPhoneNumberDto.phoneNumber = this.selectedCountryEmail.dial_code +'-'+ this.phoneNumber;
      this.vendorEmailAndPhoneNumberList.push(this.vendorEmailAndPhoneNumberDto);
      this.vendorEmailAndPhoneNumberDto = new CreateVendorEmailAndPhoneNumberInput();
      this.phoneNumber = '';
      console.log(this.vendorEmailAndPhoneNumberList);
     }
     else{
      this.vendorEmailAndPhoneNumberList.push(this.vendorEmailAndPhoneNumberDto);
      this.vendorEmailAndPhoneNumberDto = new CreateVendorEmailAndPhoneNumberInput();
      this.phoneNumber = '';
      console.log(this.vendorEmailAndPhoneNumberList);
     }


  }

  RemoveGetMoreEmailDetailsItem(index: number) {
   this.vendorEmailAndPhoneNumberList.splice(index, 1);
  }

  AddMoreForeignDetailsItem() {

    if (this.vendorForeignAccountDtoList == null) {
      this.vendorForeignAccountDtoList =  new Array<CreateVendorForeignAccountInput>();
    }
    console.log(`The foreign account Number is ${this.vendorForeignAccountDto.foreignAccountNumber}`);
    console.log(`The foreign account Name is ${this.vendorForeignAccountDto.foreignAccountName}`);
    console.log(`The foreign Country is ${this.vendorForeignAccountDto.foreignCountry}`);
    console.log(`The foreign account Bank is ${this.vendorForeignAccountDto.foreignBank}`);
    if (this.vendorForeignAccountDto.foreignAccountName === '') {
    return  this.message.error(this.l('Please Enter A Foreign AccountName!'));
    }
    if (this.vendorForeignAccountDto.foreignAccountName ===  undefined) {
        return  this.message.error(this.l('Please Enter A Foreign AccountName!'));
    }
    else if (this.vendorForeignAccountDto.foreignAccountNumber === '') {
     return  this.message.error(this.l('Please Enter A Foreign AccountNumber!'));
    }
    else if (this.vendorForeignAccountDto.foreignAccountNumber ===  undefined) {
        return  this.message.error(this.l('Please Enter A Foreign AccountNumber!'));
     }
    else if (this.vendorForeignAccountDto.foreignBank === '') {
     return this.message.error(this.l('Please Enter A Foreign Bank!'));
    }
    else if (this.vendorForeignAccountDto.foreignBank ===  undefined) {
        return this.message.error(this.l('Please Enter A Foreign Bank!'));
    }
    else if (this.vendorForeignAccountDto.foreignCountry === '' ) {
        return  this.message.error(this.l('Please Enter A Foreign Country!'));
    }
    else if (this.vendorForeignAccountDto.foreignCountry ===  undefined) {
        return  this.message.error(this.l('Please Enter A Foreign Country!'));
    }

    // else if (this.vendorForeignAccountDto.foreignBankCode === (''|| undefined)) {
    //   this.message.warn(this.l('Please Enter A Foreign BankCode!'));
    // }

    let isValid = true;

    this.vendorForeignAccountDtoList.forEach(element => {
      if (element.foreignAccountNumber === this.vendorForeignAccountDto.foreignAccountNumber) {
        isValid = false;
      }
    });
    if (isValid) {
      this.vendorForeignAccountDtoList.push(this.vendorForeignAccountDto);
      this.vendorForeignAccountDto = new CreateVendorForeignAccountInput();
    }
    else{
      this.message.error(this.l('Account Number Already Exist'))
    }
  }

  RemoveForeignDetailsItem(index: number) {
    this.vendorForeignAccountDtoList.splice(index, 1);
  }

  // Only AlphaNumeric with Some Characters [-_ ]
  keyPressAlphaNumericWithCharacters(event) {

    let inp = String.fromCharCode(event.keyCode);
    if (/[0-9-+ ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

    getTinValidation(){
        this.showMainSpinner();
        this._vendorsServiceProxy.getTinValidationPatterns().subscribe(res=>{
            this.tinPattern = res;
            this.hideMainSpinner();

        })
    }

}
