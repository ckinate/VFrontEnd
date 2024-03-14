import {PermissionCheckerService} from 'abp-ng2-module';
import {AppSessionService} from '@shared/common/session/app-session.service';

import {Injectable} from '@angular/core';
import {AppMenu} from './app-menu';
import {AppMenuItem} from './app-menu-item';

@Injectable()
export class AppNavigationService {

    constructor(
        private _permissionCheckerService: PermissionCheckerService,
        private _appSessionService: AppSessionService
    ) {

    }

    getMenu(): AppMenu {
        return new AppMenu('MainMenu', 'MainMenu', [

           new AppMenuItem('Dashboard', 'Pages.Tenant.Dashboard', 'flaticon-line-graph', '/app/main/dashboard'),
            // new AppMenuItem('Administration', 'Pages.Administration', 'flaticon-interface-8', '', [], [
            //   new AppMenuItem('AuditLogs', 'Pages.Administration.AuditLogs', 'flaticon-folder-1', '/app/admin/auditLogs'),
            //     new AppMenuItem('Audit Trail', 'Pages.Administration.AuditLogs', 'flaticon-folder-1', '/app/admin/audit-trail'),
            //     new AppMenuItem('Roles', 'Pages.Administration.Roles', 'flaticon-suitcase', '/app/admin/roles'),
            //     new AppMenuItem('Users', 'Pages.Administration.Users', 'flaticon-users', '/app/admin/users'),
            // ]),

                new AppMenuItem('General Setup', 'Pages.Vendor.Setting', 'flaticon-cogwheel', '', [], [
                    new AppMenuItem('Category', 'Pages.Vendor.CategoryCreation', 'flaticon-more', '/app/main/vendorMgt/vendorCategory'),
                    new AppMenuItem('Sub-Category', 'Pages.Vendpr.SubCategoryCreation', 'flaticon-more', '/app/main/vendorMgt/vendorSubCategory'),
                    new AppMenuItem('Questionaires', 'Pages.Vendor.QuestionaireCreation', 'flaticon-suitcase', '/app/main/vendorMgt/questionares'),
                    new AppMenuItem('Document Uploads', 'Pages.Vendor.DocumentUploadDescription', 'flaticon-users', '/app/main/vendorMgt/documentUploads'),
                    new AppMenuItem('One-Off Vendor', 'Pages.Vendor.OneOffVendor', 'flaticon-more', '/app/main/vendorMgt/oneOffVendor'),
                 //   new AppMenuItem('Contract Type', '', 'flaticon-users', '/app/main/vendorMgt/contractTypes'),
                ]),
                new AppMenuItem('Vendor Registration', 'Pages.Vendor.Create', 'flaticon-more', '/app/main/vendorMgt/vendors'),
                new AppMenuItem('Enquiry', 'Pages.Vendor.Enquiry', 'flaticon-cogwheel', '', [], [
                    new AppMenuItem('Enquiry', 'Pages.Vendor.Enquiry', 'flaticon-more', '/app/main/vendorMgt/querydetails'),
                    new AppMenuItem('Enquiry History', 'Pages.Vendor.Enquiry', 'flaticon-more', '/app/main/vendorMgt/vendorQueryHistory'),

                ]),

                new AppMenuItem('Vendor Portal', '', 'flaticon-cogwheel', '', [], [
                    new AppMenuItem('Email Receiver Setup', '', 'flaticon-more', '/app/main/emailForVendorOnlineSetting'),
                    new AppMenuItem('Vendor Onboarding', '', 'flaticon-more', '/app/main/onboardingVendors'),
                    new AppMenuItem('Vendor Invitation', '', 'flaticon-more', '/app/main/vendorsInvitation'),
                    new AppMenuItem('Vendor Update Request', '', 'flaticon-more', '/app/main/vendorsUpdateRequest'),

                ]),



               // new AppMenuItem('Vendor SLA', '', 'flaticon-cogwheel', '/app/main/vendorMgt/vendorSLAs'),
                    new AppMenuItem('Reports', 'Pages.Vendor.Report', 'flaticon-users', '/app/main/vendorMgt/Reports/Report'),
            ]);

    }

    checkChildMenuItemPermission(menuItem): boolean {

        for (let i = 0; i < menuItem.items.length; i++) {
            let subMenuItem = menuItem.items[i];

            if (subMenuItem.permissionName === '' || subMenuItem.permissionName === null) {
                if (subMenuItem.route) {
                    return true;
                }
            } else if (this._permissionCheckerService.isGranted(subMenuItem.permissionName)) {
                return true;
            }

            if (subMenuItem.items && subMenuItem.items.length) {
                let isAnyChildItemActive = this.checkChildMenuItemPermission(subMenuItem);
                if (isAnyChildItemActive) {
                    return true;
                }
            }
        }
        return false;
    }

    showMenuItem(menuItem: AppMenuItem): boolean {
        if (menuItem.permissionName === 'Pages.Administration.Tenant.SubscriptionManagement' && this._appSessionService.tenant && !this._appSessionService.tenant.edition) {
            return false;
        }

        let hideMenuItem = false;

        if (menuItem.requiresAuthentication && !this._appSessionService.user) {
            hideMenuItem = true;
        }

        if (menuItem.permissionName && !this._permissionCheckerService.isGranted(menuItem.permissionName)) {
            hideMenuItem = true;
        }

        if (this._appSessionService.tenant || !abp.multiTenancy.ignoreFeatureCheckForHostUsers) {
            if (menuItem.hasFeatureDependency() && !menuItem.featureDependencySatisfied()) {
                hideMenuItem = true;
            }
        }

        if (!hideMenuItem && menuItem.items && menuItem.items.length) {
            return this.checkChildMenuItemPermission(menuItem);
        }

        return !hideMenuItem;
    }

    /**
     * Returns all menu items recursively
     */
    getAllMenuItems(): AppMenuItem[] {
        let menu = this.getMenu();
        let allMenuItems: AppMenuItem[] = [];
        menu.items.forEach(menuItem => {
            allMenuItems = allMenuItems.concat(this.getAllMenuItemsRecursive(menuItem));
        });

        return allMenuItems;
    }

    private getAllMenuItemsRecursive(menuItem: AppMenuItem): AppMenuItem[] {
        if (!menuItem.items) {
            return [menuItem];
        }

        let menuItems = [menuItem];
        menuItem.items.forEach(subMenu => {
            menuItems = menuItems.concat(this.getAllMenuItemsRecursive(subMenu));
        });

        return menuItems;
    }
}
