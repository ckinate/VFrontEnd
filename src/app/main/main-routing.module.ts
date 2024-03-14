import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContractTypesComponent } from './vendorMgt/contractTypes/contractTypes.component';
import { DocumentUploadsComponent } from './vendorMgt/documentUploads/documentUploads.component';
import { EmailNotificationVendorOnlineComponent } from './VendorMgt/email-notification-vendor-online/email-notification-vendor-online.component';
import { OnBoardingDataComponent } from './vendorMgt/on-boarding-data/on-boarding-data.component';
import { OneOffVendorComponent } from './vendorMgt/one-off-vendor/one-off-vendor.component';
import { QuerydetailsComponent } from './vendorMgt/querydetails/querydetails.component';
import { QuestionaresComponent } from './vendorMgt/questionares/questionares.component';
import { ActiveVendorsComponent } from './vendorMgt/Reports/activevendors/active-vendors.component';
import { VendorInvitationComponent } from './vendorMgt/vendor-invitation/vendor-invitation.component';
import { VendorQueryHistoryComponent } from './vendorMgt/vendor-query-history/vendor-query-history.component';
import { VendorCategoryComponent } from './vendorMgt/vendorCategory/vendor-category.component';
import { VendorsComponent } from './vendorMgt/vendors/vendors.component';
import { VendorSLAsComponent } from './vendorMgt/vendorSLAs/vendorSLAs.component';
import { VendorSubCategoryComponent } from './vendorMgt/vendorSubCategory/vendor-sub-category.component';
import { VendorUpdateRequestsComponent } from './vendorMgt/on-boarding-data/vendor-update-requests/vendor-update-requests.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    {path: 'dashboard', component: DashboardComponent, data: { permission: 'Pages.Tenant.Dashboard' } },
                    {path: 'vendorMgt/vendors', component: VendorsComponent},
                    {path: 'vendorMgt/vendorCategory', component: VendorCategoryComponent},
                    {path: 'vendorMgt/oneOffVendor', component: OneOffVendorComponent},
                    {path: 'vendorMgt/vendorSubCategory', component: VendorSubCategoryComponent},
                    {path: 'vendorMgt/questionares', component: QuestionaresComponent},
                    {path: 'vendorMgt/documentUploads', component: DocumentUploadsComponent},
                    {path: 'vendorMgt/vendorSLAs', component: VendorSLAsComponent},
                    {path: 'vendorMgt/contractTypes', component: ContractTypesComponent},
                    {path: 'vendorMgt/Reports/Report', component: ActiveVendorsComponent},
                    {path: 'vendorMgt/querydetails', component:QuerydetailsComponent},
                    {path: 'vendorMgt/vendorQueryHistory', component: VendorQueryHistoryComponent},
                    {path: 'onboardingVendors', component: OnBoardingDataComponent},
                    { path: 'vendorsInvitation', component: VendorInvitationComponent },
                    {path: 'vendorsUpdateRequest', component: VendorUpdateRequestsComponent},
                    {path: 'emailForVendorOnlineSetting', component: EmailNotificationVendorOnlineComponent},
                    {path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                    {path: '**', redirectTo: 'dashboard' }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MainRoutingModule { }
