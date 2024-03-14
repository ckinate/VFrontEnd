import { Component, Injector, OnInit } from '@angular/core';
import { VendorDashboardServiceProxy } from '@shared/service-proxies/service-proxies';
import { DashboardChartBase } from '../dashboard-chart-base';
import { WidgetComponentBaseComponent } from '../widget-component-base';
import { WidgetDataService } from '@shared/utils/widget-data.service';


class DashboardTopStats extends DashboardChartBase {

    totalVendor = 0; totaltotalVendorCounter = 0;
    totalActiveVendor = 0; totalActiveVendorCounter = 0;
    totalInactiveVendor = 0; totalInactiveVendorCounter = 0;
    totalApprovalRequest = 0; totalApprovalRequestCounter = 0;

    totalVendorChange = 76; totalVendorChangeCounter = 0;
    totalActiveVendorChange = 85;  totalActiveVendorChangeCounter = 0;
    totalInactiveVendorChange = 45; totalInactiveVendorChangeCounter = 0;
    totalApprovalRequestChange = 57; totalApprovalRequestChangeCounter = 0;

    init(totalVendor, totalActiveVendor, totalInactiveVendor, totalApprovalRequest) {
      this. totalVendor =  totalVendor;
      this.totalActiveVendor = totalActiveVendor;
      this.totalInactiveVendor = totalInactiveVendor;
      this.totalApprovalRequest = totalApprovalRequest;
      this.hideLoading();
    }
  }

@Component({
  selector: 'app-widget-vendor-stats',
  templateUrl: './widget-vendor-stats.component.html',
  styleUrls: ['./widget-vendor-stats.component.css']
})
export class WidgetVendorStatsComponent extends WidgetComponentBaseComponent implements OnInit {
  dashboardTopStats: DashboardTopStats;
 
  constructor(injector: Injector, private _vendorDashboard: VendorDashboardServiceProxy) {
    super(injector);
    this.dashboardTopStats = new DashboardTopStats();
  }

  ngOnInit(): void {
    this.loadTopStatsData();
   
  }
  loadTopStatsData() {
    this._vendorDashboard.getVendorDashBoard().subscribe((data)=>{
       this.dashboardTopStats.init(data.totalVendor,data.totalActiveVendor,data.totalInactiveVendor, data.totalApprovalRequest);
    })

  }
}
