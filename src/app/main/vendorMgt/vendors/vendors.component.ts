import { Component, Injector, OnInit, ViewEncapsulation, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorsServiceProxy, VendorDto, VendorDetailDto, DocumentServiceProxy, VendorCategoryDto, VendorSubCategoryDto, CreateOrEditVendorDto, CashAdvanceServiceServiceProxy, WorkflowServiceServiceProxy, WorkflowQueryDto, EditVendorInput, VendorApprovalCommentDto } from '@shared/service-proxies/service-proxies';
import { NotifyService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
//import { CreateOrEditVendorModalComponent } from './create-or-edit-vendor-modal.component';
//import { ViewVendorModalComponent } from './view-vendor-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/public_api';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import { DateTime } from 'luxon';
import { BsModalRef, BsModalService, ModalDirective, ModalOptions } from 'ngx-bootstrap/modal';
import { FileuploadComponent } from '@app/main/FileDocuments/fileupload/fileupload.component';
import { FileItem } from 'ng2-file-upload';
//import { EditVendorModalComponent } from './edit-vendor-modal.component';
import { CreateVendorModalComponent } from './create-vendor-modal.component';
import { EditVendorModalComponent } from './edit-vendor-modal.component';
import { viewVendorModalComponent } from './ViewVendor-modal.component';
import { AppConsts } from '@shared/AppConsts';
import { DueDiligenceModalComponent } from './due-diligence-modal/due-diligence-modal.component';
import { EditUnapprovedVendorComponent } from './edit-unapproved-vendor/edit-unapproved-vendor.component';

@Component({
    templateUrl: './vendors.component.html',
    styleUrls: ['./vendors.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class VendorsComponent extends AppComponentBase implements OnInit {

   // @ViewChild('createOrEditVendorModal', { static: true }) createOrEditVendorModal: CreateOrEditVendorModalComponent;
  //  @ViewChild('viewVendorModalComponent', { static: true }) viewVendorModal: ViewVendorModalComponent;
    @ViewChild('editVendorModal', {static: true}) editVendorModal: EditVendorModalComponent;
    @ViewChild('viewVendorModal', {static: true}) viewVendorModal: viewVendorModalComponent;
    @ViewChild('createVendorModal', {static: true}) createVendorModal: CreateVendorModalComponent;
    @ViewChild('duediligenceModal', {static: true})duediligenceModal:  DueDiligenceModalComponent;
    @ViewChild('editUnApproveVendorModal', {static: true}) editUnApproveVendorModal: EditUnapprovedVendorComponent;
   // @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('appfileupload', { static: true }) appfileupload: FileItem;
    @ViewChild('fileUpload', { static: true }) fileUpload: FileuploadComponent;
    @ViewChild('commentHistoryModal', { static: true }) commentHistoryModal: ModalDirective;

    modalRef: BsModalRef;
    Title: string;
    appBaseUrl = AppConsts.appBaseUrl;
    DeclineComment: string;
    vendor: CreateOrEditVendorDto = new CreateOrEditVendorDto();
    VendorReg: VendorDetailDto = new VendorDetailDto();
    vendorCatgory: VendorCategoryDto = new VendorCategoryDto();
    vendorSubCatgory: VendorSubCategoryDto = new VendorSubCategoryDto();
    SubCategory: VendorSubCategoryDto [];
    VenCategory: VendorCategoryDto[] = [];
    workflowquerylist: WorkflowQueryDto[]=[];
    advancedFiltersAreShown = false;
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
    categoryName = '';
    subCategoryName = '';
    searchText = '';
    subcategoryId: number;
    vendorCategoryId: number;
    active = false;
    selectedoperationId = 23;
    attachId: string;
    id: string;
    hidequerylink = false;
    vendorData:EditVendorInput;
    RefNoforDueDiligent: string;
    NoComment: string;
    isVendorFirstLevelApproved:boolean = false;

    checkedDueDiligent: boolean = false;
    checkedNDA: boolean = false;
    processing: boolean = false;
    approvalCommentList:VendorApprovalCommentDto[] = []

    constructor(
        injector: Injector,
        private _vendorsServiceProxy: VendorsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,
        private modalService: BsModalService,
        private _documentService: DocumentServiceProxy,
        private _cashAdvance: CashAdvanceServiceServiceProxy,
        private _workflow: WorkflowServiceServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.getVenCategory();
        this.getVenSubCategory();
this.getVendorsModified();
   console.log(`The Vendor No Comment is ${this.NoComment}`);
    let ven = new VendorApprovalCommentDto()
    ven.authorizer
    ven.comments
    ven.dateAuthorised

    }
    checkIsFirstLevelApproved(vendorId: number){
       var Ref= this.primengTableHelper.records.filter(x=>x.vendor.id==vendorId)[0].vendorNumber;
        this.isVendorFirstLevelApproved = false;

        this._vendorsServiceProxy.isFirstLevelAuthorise(Ref).subscribe(res=>{
            this.isVendorFirstLevelApproved = res;

            console.log(`The isVendorApproved value is ${res}`);


            if(res==true){
              return this.message.error("This Vendor has been authorise by one of the authorizers and can not be edited");
            }
            this.editUnApproveVendorModal.show(vendorId);
        })

    }



getVendorsModified(event?: LazyLoadEvent) {
     if (this.primengTableHelper.shouldResetPaging(event)) {
             this.paginator.changePage(0);
             return;
         }
      this.primengTableHelper.showLoadingIndicator();
     this._vendorsServiceProxy.getAllVendors(
          this.vendorStatus,
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;

            

            this.primengTableHelper.hideLoadingIndicator();
            console.log(`The Get All Vendors is ${JSON.stringify(result.items)}`);
        }, error => {
            this.message.error(error.message);
            this.primengTableHelper.hideLoadingIndicator();
        });
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

getAttach() {
    let getJSON = localStorage.getItem('attachId');
    if (getJSON) {
      localStorage.setItem('attachId', getJSON);
      this.attachId = JSON.parse(getJSON);
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
    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createVendor(): void {
        this.createVendorModal.show();
    }
    editVendor(vendorId: number): void {
        this.editVendorModal.show(vendorId);
    }
    editUnApprovedVendor(vendorId: number){
      this.checkIsFirstLevelApproved(vendorId)
    //   this.editUnApproveVendorModal.show(vendorId);
    }
    viewVendor(vendorId: number): void {
        debugger;
        this.viewVendorModal.show(vendorId);
    }
    close(): void {
        this.active = false;
      }
    getVenSubCategory() {
        this._vendorsServiceProxy.getAllSubCategoryList().subscribe(result => {
          this.SubCategory = result;
          console.log('Vendor sub Category: ' + result);
        });
    }

    getVenCategory() {
        console.log('Vendor Category: getVenCategory');
        this._vendorsServiceProxy.getVenCategory().subscribe((result: any) => {
          this.VenCategory = result;
          console.log('Vendor Category: ' + result);
        });
      }


    changeStatus(record: VendorDto, status: string) {

        this.processing = true;
        if (status === 'Deactivation') {
            record.reason = this.DeclineComment;
        } else {
            record.reason = this.DeclineComment;
        }
        console.log(record);
        this._vendorsServiceProxy.statusChange(record).subscribe((result) => {
            if (status === 'Deactivation') {
                this.notify.info(this.l('Deactivated  Successful Pending Approval'));
            } else {
                this.notify.info(this.l('Activated Successful Pending Approval'));
            }

            this.processing = false;
            this.getVendorsModified();
            this.DeclineComment = '';
            this.modalRef.hide();
        },error =>{
            this.processing = false;
        });
    }
    openModal(template: TemplateRef<any>, status: string) {
        this.Title = status;
        const config: ModalOptions = {
            class: 'modal-dialog-centered',
        };
        this.modalRef = this.modalService.show(template, config);

    }

    deleteVendor(vendor: number): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._vendorsServiceProxy.deleteVendor(vendor)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._vendorsServiceProxy.getVendorsToExcel(
            this.filterText,
            this.companyNameFilter,
            this.addressFilter,
            this.officePhoneFilter,
            this.mobileFilter,
            this.emailFilter,
            this.maxDateRegisteredFilter === undefined ? this.maxDateRegisteredFilter : this.maxDateRegisteredFilter.endOf('day'),
            this.minDateRegisteredFilter === undefined ? this.minDateRegisteredFilter : this.minDateRegisteredFilter.startOf('day'),
            // this.minDateRegisteredFilter === undefined ? this.minDateRegisteredFilter : moment(this.minDateRegisteredFilter).startOf('day'),
            this.maxTaxIdentificationNumberFilter == null ? this.maxTaxIdentificationNumberFilterEmpty : this.maxTaxIdentificationNumberFilter,
            this.minTaxIdentificationNumberFilter == null ? this.minTaxIdentificationNumberFilterEmpty : this.minTaxIdentificationNumberFilter,
            this.contactPersonFilter,
            this.contactDesignationFilter,
            this.contactPhoneFilter,
            this.contactEmailFilter,
            this.faxFilter,
            this.websiteFilter,
            this.companyTypeFilter,
        )
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }


    DisableVendorAccount(id: any) {
        this._vendorsServiceProxy.disableVendorAccount(id).subscribe(result => {
            if (result === true) {
                this.message.success(this.l('DisableSuccessfully'));
            } else {
                this.message.error(this.l('ErrorNotSuccessfully'));
            }
        });
    }


    ApproveVendor(vendorNumber: any) {
        this._vendorsServiceProxy.approveVendor(vendorNumber).subscribe(result => {
            if (result === true) {
                this.message.success(this.l('ApprovedSuccessfully'));
            } else {
                this.message.error(this.l('ErrorNotSuccessfully'));
            }
        });

        this.reloadPage();
    }

    DisApproveVendor(vendorNumber: any) {
        this._vendorsServiceProxy.disApproveVendor(vendorNumber).subscribe(result => {
            if (result === true) {
                this.message.success(this.l('DisApprovedSuccessfully'));
            } else {
                this.message.error(this.l('ErrorNotSuccessfully'));
            }
        });

        this.reloadPage();
    }

    CheckVendorStatus(vendorStatus: any) {
        alert(vendorStatus);

        if (vendorStatus === 6) {
            return true;
        } else if (vendorStatus === 7) {
            return true;
        } else {
            return false;
        }
    }

    loadWorkflowqueryTrail() {


        this._workflow.getloginUserQuery().subscribe(result => {
            this.workflowquerylist=result;
            if(result.length >0){
                this.hidequerylink=true;
            }
            // this.primengTableHelper.records = result;
            // this.primengTableHelper.hideLoadingIndicator();
             console.log(result);
          });
      }



    showDueDiligentModal(vendorDto: VendorDto) {
          vendorDto.onboardingId

        this.duediligenceModal.showDueDiligentModal(vendorDto)
      }

      onShownCommentHistory(){

      }
      showCommentHistory(RefNo: string){
          this.NoComment = undefined;

        this._vendorsServiceProxy.getVendorApprovalComment(RefNo).subscribe(res=>{
                   this.approvalCommentList = res;
                   if(this.approvalCommentList.length <= 0){
                    this. NoComment = " No Authorized/Declined comment for this Vendor "
                   }
                   this.commentHistoryModal.show();

        })
      }

      closeCommentHistory(){
          this.commentHistoryModal.hide();
      }

      showVerify(vendorDto: VendorDto){
        var show = true;
        if(vendorDto.vendorStatus == 2){
          show = false;
        }
        else  if(vendorDto.dueDiligence == true && vendorDto.nda == true) {
            show = false;
         }

         return show;

      }



}
