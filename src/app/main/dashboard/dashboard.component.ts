import { Component, ComponentFactoryResolver, Injector, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DashboardCustomizationConst } from '@app/shared/common/customizable-dashboard/DashboardCustomizationConsts';

import { WidgetVendorStatsComponent } from '@app/shared/common/customizable-dashboard/widgets/widget-vendor-stats/widget-vendor-stats.component';
import { VendorDashboardServiceProxy, VendorsServiceProxy, WorkflowQueryDto } from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';
import { WidgetDataService } from '@shared/utils/widget-data.service';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class DashboardComponent extends AppComponentBase implements OnInit {
    dashboardName = DashboardCustomizationConst.dashboardNames.defaultTenantDashboard;
    widgetTenantTopStat = WidgetVendorStatsComponent;
    hidequerylink = false;
    appBaseUrl = AppConsts.appBaseUrl;
    workflowquerylist: WorkflowQueryDto[] = [];
 
    topStatsData = 10

    constructor(
        injector: Injector, private _vendorDashboard: VendorDashboardServiceProxy, private _vendorsServiceProxy: VendorsServiceProxy, 
       ) {
        super(injector);
    }


     ngOnInit() {
        this.getRecentVendors();
         this.loadqueryTrail();
        
    }


    getRecentVendors(){
        this.showMainSpinner();
        this._vendorDashboard.getVendorDashBoard().subscribe((result)=>{
            this.primengTableHelper.records = result.recentVendors;
            this.hideMainSpinner();
        });

    }

    loadqueryTrail() {
        this._vendorsServiceProxy.getloginVendorQuery().subscribe(result => {
          this.workflowquerylist=result;
          if(result.length >0){
              this.hidequerylink=true;
          }
           console.log(result);
        });
    }
}
