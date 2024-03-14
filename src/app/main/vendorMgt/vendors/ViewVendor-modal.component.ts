import { Component, ViewChild, Injector, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import {
  VendorsServiceProxy,
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
  CreateVendorQuestionairInput,
  CreateVendorEmailAndPhoneNumberInput,
  CreateVendorAContactInput,
  CreateVendorForeignAccountInput,
  EditVendorWithDetailsInput,
  EditVendorInput,
  EditVendorEmailAndPhoneNumberInput,
  EditVendorBeneficiaryAccountProfileInput,
  EditVendorContactInput,
  EditVendorForeignAccountInput
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DateTime } from 'luxon';
//import { FileUploadModule } from 'ng2-file-upload/file-upload/file-upload.module';
import { FileItem } from 'ng2-file-upload';

import { FileuploadComponent } from '@app/main/FileDocuments/fileupload/fileupload.component';
import { Country, ICountry } from '@app/shared/common/helper/country';
import { forEach } from 'lodash-es';
 //import * as html2pdf from 'html2pdf.js';


declare let html2pdf: any;

@Component({
  selector: 'viewVendorModal',
  templateUrl: './viewVendor-modal.component.html',
  styleUrls: ['./create-or-edit-vendor-modal.component.css']
})
export class viewVendorModalComponent extends AppComponentBase implements OnInit {

 // @ViewChild('viewVendorModal2', { static: true }) modal: ModalDirective;
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
  supportingDocumentCount: any = 0;
  refNo: any;
  processPdf = false;

  constructor(
    injector: Injector,
    private _vendorsServiceProxy: VendorsServiceProxy,
    private _DocUp: DocumentUploadsServiceProxy,
    private _Quest: QuestionaresServiceProxy,
    private _userService: UserServiceProxy,
    private _bankService: BankServiceServiceProxy,
    private _cashAdvance: CashAdvanceServiceServiceProxy,
    private _documentService: DocumentServiceProxy,
  ) {
    super(injector);
  }

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

  ngOnInit(): void {
    this.getQuestionaire();
    this.getDocumentUpload();
    this.getVenCategory();
    // tslint:disable-next-line:no-unused-expression
    this.getVenSubCategory;
    this.loadBankList();
    // this.bsRangeValue = [this.bsValue, this.maxDate];
    // this.listOfCountries = Country.listOfCountries;
    // this.bsRangeValue = [this.bsValue, this.maxDate];
    // this.selectedCountry = this.listOfCountries.find(x => x.code === 'NG');
    // this.selectedMobileCountry = this.listOfCountries.find(x=>x.code === 'NG');
    // this.selectedContactCountry = this.listOfCountries.find(x=>x.code === 'NG');
    // this.selectedExContactCountry = this.listOfCountries.find(x=>x.code === 'NG');
    // this.selectedCountryEmail = this.listOfCountries.find(x=>x.code === 'NG');
    this.onCountryPressForEmailandPhone(document.getElementById('dial_codeId'));
    
  }
  generatePDF() {
    this.processPdf = true;
    const pEl = document.getElementById('pEl');
    html2pdf().from(pEl).set(this.options1).save();

    this.processPdf = false;
  }

 

  show(vendorId): void {
    debugger;
    this.isAddMoreContactDetails = false;
    this.isAddMoreEmailDetails = false;
    this.isAddMoreForeignDetails = false;

    this._vendorsServiceProxy.getVendorForVeiw(vendorId).subscribe(result => {
      this.vendor = result.vendor;
      this.refNo = result.vendor.vendorNumber;
      this.userBankProfile = result.bankProfile;
      this.Questionarelist = result.questResponse;
      this.vendorContactDetailsList = result.extraContatPerson;
      this.vendorEmailAndPhoneNumberList = result.extraEmailAndPhone;
      this.vendorForeignAccountDtoList = result.extraForeignAccount;
      this.active = true;
      this.totalCountOfSupportingDocument();
      this.modal.show();
    });
  }

  totalCountOfSupportingDocument(){


    this._documentService.getFilesByParentRef(this.refNo).subscribe(x=>{
      this.supportingDocumentCount  = x.length;

    })

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
    //console.log(this.vendor.mobile);
  }
  onCountryPressForMobile(event) {
    this.mobile = (<HTMLInputElement>event.target).value
    this.vendor.mobile = this.selectedMobileCountry.dial_code +'-'+ this.mobile
    console.log(this.vendor.mobile);
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
    //console.log(this.vendor.mobile);
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
  onSelectedCountryForEmailandPhone(item: ICountry) {
    this.selectedCountryEmail = item;
    this.vendorEmailAndPhoneNumberDto.phoneNumber = item.dial_code +'-'+ this.phoneNumber
    //console.log(this.vendor.mobile);
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
    //console.log(this.vendor.mobile);
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
      //  this.appdocuments.ShowAttachmentByRef(this.id, 23);
      this.fileUpload.ShowAttachment(this.id, 23);
    });
  }

  checkFileDetails(event) {
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

  ViewDocument(id: any) {
    // tslint:disable-next-line:no-debugger
    debugger;
    this._documentService.getFilesByUniqueIDAndOPID(id, this.selectedoperationId, 2).subscribe(x => {
      if (x.length > 0) {
        // this.appdocuments.ShowAttachmentByRef(id,this.selectedoperationId);
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
    if (this.vendorContactDetailsList == null) {
      this.vendorContactDetailsList = new Array<CreateVendorAContactInput>();
    }
    if (this.vendorContactDetailsDto.email === '') {
      this.message.warn(this.l('Please Enter An Contact PersonEmail!'));
    } else if (this.vendorContactDetailsDto.contactName === '') {
      this.message.warn(this.l('Please Enter A Contact PersonName!'));
    } else if (this.phone.toString().length < 11) {
      this.message.warn(this.l('Contact Person Phone Number Must Be Minimum of 11 (Eleven) Characters!'));
    } else {
      this.vendorContactDetailsDto.phone = this.selectedCountry.dial_code + this.phone;
      this.vendorContactDetailsList.push(this.vendorContactDetailsDto);
      this.vendorContactDetailsDto = new EditVendorContactInput();
      this.phone = '';
    }
  }

  RemoveMoreContactDetailsItem(index: number) {
    this.vendorContactDetailsList.splice(index, 1);
  }

  AddMoreEmailDetailsItem() {
    if (this.vendorEmailAndPhoneNumberList == null) {
      this.vendorEmailAndPhoneNumberList = new Array<CreateVendorEmailAndPhoneNumberInput>();
    }
    if (this.vendorEmailAndPhoneNumberDto.email === '') {
      this.message.warn(this.l('Please Enter An Email!'));
    } else if (this.phoneNumber.toString().length < 11) {
      this.message.warn(this.l('Phone Number Must Be Minimum of 11 (Eleven) Characters!!'));
    } else {
      this.vendorEmailAndPhoneNumberDto.phoneNumber = this.selectedCountry.dial_code + this.phoneNumber;
      this.vendorEmailAndPhoneNumberList.push(this.vendorEmailAndPhoneNumberDto);
      this.vendorEmailAndPhoneNumberDto = new EditVendorEmailAndPhoneNumberInput();
      this.phoneNumber = '';
    }
  }

  RemoveGetMoreEmailDetailsItem(index: number) {
    this.vendorEmailAndPhoneNumberList.splice(index, 1);
  }

  AddMoreForeignDetailsItem() {
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
    } else {
      this.vendorForeignAccountDtoList.push(this.vendorForeignAccountDto);
      this.vendorForeignAccountDto = new EditVendorForeignAccountInput();
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

}
