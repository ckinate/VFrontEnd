import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { CountoModule } from 'angular2-counto';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainRoutingModule } from './main-routing.module';

import { BsDatepickerConfig, BsDaterangepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxBootstrapDatePickerConfigService } from 'assets/ngx-bootstrap/ngx-bootstrap-datepicker-config.service';


// Import from PrimEng
import { EditorModule } from 'primeng/editor';
import { InputMaskModule } from 'primeng/inputmask';
//import { FileUploadModule } from 'primeng/fileupload';
import { PaginatorModule } from 'primeng/paginator';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TableModule } from 'primeng/table';
import { TreeModule } from 'primeng/tree';
import {ColorPickerModule} from 'primeng/colorpicker';
import {ToggleButtonModule} from 'primeng/togglebutton';
import { CheckboxModule } from 'primeng/checkbox';

//Import from other Packages
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BankManagerServiceServiceProxy, BankServiceServiceProxy, ContractTypesServiceProxy, DocumentUploadsServiceProxy, QuestionaresServiceProxy, VendorSLAsServiceProxy, VendorsServiceProxy } from '@shared/service-proxies/service-proxies';
import { VendorsComponent } from './vendorMgt/vendors/vendors.component';
import { QuestionaresComponent } from './vendorMgt/questionares/questionares.component';
import { DocumentUploadsComponent } from './vendorMgt/documentUploads/documentUploads.component';
//import { ViewVendorModalComponent } from './vendorMgt/vendors/view-vendor-modal.component';
import { CreateOrEditQuestionareModalComponent } from './vendorMgt/questionares/create-or-edit-questionare-modal.component';
import { ViewQuestionareModalComponent } from './vendorMgt/questionares/view-questionare-modal.component';
import { CreateOrEditDocumentUploadModalComponent } from './vendorMgt/documentUploads/create-or-edit-documentUpload-modal.component';
import { ViewDocumentUploadModalComponent } from './vendorMgt/documentUploads/view-documentUpload-modal.component';
//import { CreateOrEditVendorModalComponent } from './vendorMgt/vendors/create-or-edit-vendor-modal.component';
import { AppBsModalModule } from '@shared/common/appBsModal/app-bs-modal.module';
import { VendorSubCategoryComponent } from './vendorMgt/vendorSubCategory/vendor-sub-category.component';
import { VendorSubCategoryModalComponent } from './vendorMgt/vendorSubCategory/vendor-sub-category-modal.component';
import { VendorCategoryComponent } from './vendorMgt/vendorCategory/vendor-category.component';
import { VendorCategoryModalComponent } from './vendorMgt/vendorCategory/vendor-category-modal.component';
import { VendorSLAsComponent } from './vendorMgt/vendorSLAs/vendorSLAs.component';
import { ViewVendorSLAModalComponent } from './vendorMgt/vendorSLAs/view-vendorSLA-modal.component';
import { CreateOrEditVendorSLAModalComponent } from './vendorMgt/vendorSLAs/create-or-edit-vendorSLA-modal.component';
import { CreateOrEditContractTypeModalComponent } from './vendorMgt/contractTypes/create-or-edit-contractType-modal.component';
import { ViewContractTypeModalComponent } from './vendorMgt/contractTypes/view-contractType-modal.component';
import { ContractTypesComponent } from './vendorMgt/contractTypes/contractTypes.component';
import { DocumentsComponent, FINSafePipe } from './vendorMgt/documents/documents.component';
import { ActiveVendorsComponent } from './vendorMgt/Reports/activevendors/active-vendors.component';
import { InActiveVendorsComponent } from './vendorMgt/Reports/inactivevendors/in-active-vendors.component';
import { OneOffVendorComponent } from './vendorMgt/one-off-vendor/one-off-vendor.component';
import { NibssButtonComponent } from './vendorMgt/nibss-button/nibss-button.component';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { ProgressBarModule, TreeDragDropService } from 'primeng';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { CoreModule } from '@metronic/app/core/core.module';
import { TextMaskModule } from 'angular2-text-mask';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FileuploadComponent } from './FileDocuments/fileupload/fileupload.component';
import { DocviewerComponent } from './FileDocuments/fileupload/docviewer.component';
import { DocumentloadComponent } from './FileDocuments/fileupload/documentload.component';
import { ImpersonationService } from '@app/admin/users/impersonation.service';
import { CustomService } from '@app/shared/services/CustomService.Service';
import { FileUploadModule } from 'ng2-file-upload';
import {MultiSelectModule} from 'primeng/multiselect';

import { EditVendorModalComponent } from './vendorMgt/vendors/edit-vendor-modal.component';
import { CreateVendorModalComponent } from './vendorMgt/vendors/create-vendor-modal.component';
import { viewVendorModalComponent } from './vendorMgt/vendors/ViewVendor-modal.component';
import { QuerydetailsComponent } from './vendorMgt/querydetails/querydetails.component';
import { QueryreplymodalComponent } from './vendorMgt/querydetails/queryreplymodal/queryreplymodal.component';
import { DueDiligenceModalComponent } from './vendorMgt/vendors/due-diligence-modal/due-diligence-modal.component';
import { EditUnapprovedVendorComponent } from './vendorMgt/vendors/edit-unapproved-vendor/edit-unapproved-vendor.component';
import { VendorQueryHistoryComponent } from './vendorMgt/vendor-query-history/vendor-query-history.component';
import { EnquiryHistoryComponent } from './vendorMgt/vendor-query-history/enquiry-history/enquiry-history.component';
import { OnBoardingDataComponent } from './vendorMgt/on-boarding-data/on-boarding-data.component';
import { VendorInvitationComponent } from './vendorMgt/vendor-invitation/vendor-invitation.component';
import { EmailNotificationVendorOnlineComponent } from './VendorMgt/email-notification-vendor-online/email-notification-vendor-online.component';
import { OnboardingVendorQueryComponent } from './vendorMgt/on-boarding-data/onboarding-vendor-query/onboarding-vendor-query.component';
import { VendorUpdateRequestsComponent } from './vendorMgt/on-boarding-data/vendor-update-requests/vendor-update-requests.component';

//import { QuerydetailsComponent } from './vendorMgt/querydetails/querydetails.component';
//import { QueryreplymodalComponent } from './vendorMgt/querydetails/queryreplymodal/queryreplymodal.component';
//import { QuerydetailsComponent } from './vendorMgt/querydetails/querydetails.component';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    // suppressScrollX: true
};

NgxBootstrapDatePickerConfigService.registerNgxBootstrapDatePickerLocales();

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ModalModule.forRoot(),
        TabsModule,
        TooltipModule,
        AppCommonModule,
        UtilsModule,
        MainRoutingModule,
        CountoModule,
		AutoCompleteModule,
		PaginatorModule,
        TableModule,
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot(),
        BsDatepickerModule.forRoot(),
        NgMultiSelectDropDownModule.forRoot(),
        AppBsModalModule,

        HttpClientModule,
        HttpClientJsonpModule,
        ServiceProxyModule,
        ProgressBarModule,
        PerfectScrollbarModule,
        CoreModule,
        TextMaskModule,
        ImageCropperModule,
        NgxSpinnerModule,
        FileUploadModule,
        NgSelectModule,
        ToggleButtonModule,
        MultiSelectModule

    ],
    declarations: [
        DashboardComponent,
        QuestionaresComponent,
        DocumentUploadsComponent,
                VendorsComponent,
               // CreateOrEditVendorModalComponent,
               // ViewVendorModalComponent  ,
                CreateOrEditQuestionareModalComponent,
                ViewQuestionareModalComponent,
                CreateOrEditDocumentUploadModalComponent,
                ViewDocumentUploadModalComponent,
                VendorSubCategoryComponent,
                VendorSubCategoryModalComponent,
                VendorCategoryComponent,
                VendorCategoryModalComponent,
                VendorSLAsComponent,
                ViewVendorSLAModalComponent,
                CreateOrEditVendorSLAModalComponent,
                CreateOrEditContractTypeModalComponent,
                ViewContractTypeModalComponent,
                ContractTypesComponent,
                DocumentsComponent,
                FINSafePipe,
                ActiveVendorsComponent,
                InActiveVendorsComponent,
                OneOffVendorComponent,
                NibssButtonComponent,
                FileuploadComponent,


                DocviewerComponent,
                DocumentloadComponent,
                EditVendorModalComponent,
               // ViewVendorModalComponent,
                viewVendorModalComponent,
                CreateVendorModalComponent,
                QuerydetailsComponent,
               QueryreplymodalComponent,
               DueDiligenceModalComponent,
               EditUnapprovedVendorComponent,
               VendorQueryHistoryComponent,
               EnquiryHistoryComponent,
               OnBoardingDataComponent,
               VendorInvitationComponent,
               EmailNotificationVendorOnlineComponent,
               OnboardingVendorQueryComponent,
                VendorUpdateRequestsComponent,


    ],
    providers: [
        { provide: BsDatepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerConfig },
        { provide: BsDaterangepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDaterangepickerConfig },
        { provide: BsLocaleService, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerLocale },
        ImpersonationService,
        TreeDragDropService,
        CustomService, BankManagerServiceServiceProxy,
         VendorsServiceProxy, ContractTypesServiceProxy, QuestionaresServiceProxy, VendorSLAsServiceProxy, DocumentUploadsServiceProxy, BankServiceServiceProxy,
        { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG}
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class MainModule { }
