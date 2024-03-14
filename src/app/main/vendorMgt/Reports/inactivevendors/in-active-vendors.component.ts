import { Component, OnInit, Pipe, PipeTransform, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';

@Pipe({ name: 'finsafe' })
export class FINSafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer,
  
    ) { 
   
    }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
@Component({
  selector: 'app-in-active-vendors',
  templateUrl: './in-active-vendors.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class InActiveVendorsComponent implements OnInit {

  constructor() { }
  link = '';
  ngOnInit(): void {
  }

  ViewReport() {  
   // console.log(this.ViewReport)
    var link  =  AppConsts.reportUrl + "?TypeId=13" + "&vendorstatus=3";    
    console.log(link);
  }

}
