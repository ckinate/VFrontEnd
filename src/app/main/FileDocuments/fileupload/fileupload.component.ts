import { Component, Injector, OnInit, ViewChild, ElementRef, Input, EventEmitter, Output } from '@angular/core';
import { FileUploader, FileUploaderOptions, FileItem, ParsedResponseHeaders, FileLikeObject } from 'ng2-file-upload';
import { AppComponentBase } from "@shared/common/app-component-base";
import { ProfileServiceProxy, DocumentServiceProxy } from "@shared/service-proxies/service-proxies";
import { IAjaxResponse, TokenService } from "@node_modules/abp-ng2-module";
import { AppConsts } from "@shared/AppConsts";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DocviewerComponent } from './docviewer.component';
import { CustomService } from '@app/shared/services/CustomService.Service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'appfileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css'],

  animations: [appModuleAnimation()]
})
export class FileuploadComponent extends AppComponentBase implements OnInit {
  @ViewChild('fileUp') myInputVariable: ElementRef;

  @ViewChild('docView', { static: true }) modal: ModalDirective;

  @ViewChild('appdocviewer', { static: true }) appdocviewer: DocviewerComponent;
   @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  uniqueID: any;
  OPID: number;
  NotViewOnly = true;

  public uploader: FileUploader;
  private _uploaderOptions: FileUploaderOptions = {};
  description: string;
  progressAction: any;
  itemName: any;
  refNumber = '';
  attachedList = [];
  fileTypeList=  [];
  allowableFileType = '';
  remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;
  isGeneratingView = false;
  DemoDoc: SafeResourceUrl;

  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  constructor(
    injector: Injector,
    private _profileService: ProfileServiceProxy,
    private _tokenService: TokenService, private _service: DocumentServiceProxy, private _pService: CustomService, public sanitizer: DomSanitizer, private http:HttpClient
  ) {
    super(injector);
  }


  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  files: any = [];

 @Input() pid: number; //Operation id
 @Input() ID: any; // Ref or UniqueID
 @Input() viewOnly: boolean; // View type (Upload or Just View)

  ngOnInit() {


    this.getFileTypes();
    this.initFileUploader();


     if(this.viewOnly.toString() == "true")
     {


   this.ShowAttachment(this.ID, this.pid);

     }
     else{
      this.ShowAttachmentByRef(this.ID,this.pid);


     }

     this.getFiles();
  }

  getTransactionDate(e){
    const c = e?.c;
    return `${c?.year}-${c?.month}-${c?.day} ${c?.hour}:${c?.minute}:${c?.second}`;
  }

  getFileDownload(id) {
     console.log(`The Id is ${id}`);
    var url =  this.remoteServiceBaseUrl + '/Download?id=' + id;
    var result = this.http.get(url).subscribe(x=>{
        this.DemoDoc = this.sanitizer.bypassSecurityTrustResourceUrl(x['result']);
    });

    console.log(result);
    return result;
 }

  ShowAttachment(id: any, OPID: number) {
   // this.getFileTypes();
   this.viewOnly = true;
    this.uniqueID = id;
    this.OPID = OPID;
   // this.refNumber = this.refNumber == ""? id:this.refNumber;
   //this.initFileUploader();
   //this.getFilesViewOnly();
   console.log(`The refNo is when attaching is ${this.refNumber}`);
   this.getFiles();

    this.modal.show();
  }

  getFileTypes()
  {
    this._service.getFileExtentionType().subscribe(x => {
    this.fileTypeList = x;
    this.allowableFileType = 'File type: ' + JSON.stringify(x).replace("]","").replace("[","");

    });

  }

  ShowAttachmentforquery(id: any, OPID: number) {
    this.uniqueID = id;
    this.OPID = OPID;
    this.getFilesByRef();

  }

  ShowAttachmentByRef(id: any, OPID: number) {
    this.viewOnly = false;
    this.uniqueID = id;
    this.OPID = OPID;
   // this.getFilesByRef();
    this.getFiles(2);
    this.NotViewOnly = false;
    this.modal.show();
  }


  onShown() {

  }
  CloseModal() {
    this.modal.hide();
  }
  DeleteItem(id: number) {

    this.message.confirm(this.l('DeleteDocument'),
      this.l('AreYouSure'),
      isConfirmed => {
        if (isConfirmed) {
          this._service.deleteDocument(id).subscribe(x => {
            this.getFiles();
          });

        }
      });

  }

  DocView(id: any) {

    var ext = id.extentionType;
    var nextt = ext.replace(".", "");
    console.log(this.appdocviewer);
   this.appdocviewer.ViewAppDocument(id, nextt, () => {   });
  }
  getFiles(id: number =1) {
    this.attachedList = [];

    this._service.getFilesByUniqueIDAndOPID(this.uniqueID, this.OPID, id).subscribe(x => {
      this.attachedList = x;

    });

  }

  getFilesViewOnly() {
    this.attachedList = [];

    this._service.getFilesByUniqueIDAndOPID(this.uniqueID, this.OPID, 2).subscribe(x => {
      this.attachedList = x;

    });

  }

  getFilesByRef() {
    this.attachedList = [];


    this._service.getFilesByUniqueIDAndOPID(this.uniqueID, this.OPID, 2).subscribe(x => {
      this.attachedList = x;

    });

  }


  initFileUploader(): void {
    this.uploader = new FileUploader({ url: this.remoteServiceBaseUrl + '/FileUpload/UploadFile' });
    this._uploaderOptions.autoUpload = true;
    this._uploaderOptions.authToken = 'Bearer ' + this._tokenService.getToken();
    this._uploaderOptions.removeAfterUpload = true;

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    if (this.description === '' || this.description === undefined) {
     this.description =  this.itemName;
    }
    this.uploader.onBuildItemForm = (fileItem: FileItem, form: any) => {
      form.append('Remarks', this.description);
      form.append('OperationID', this.OPID);
      form.append('TenantId', this.appSession.tenantId);
      form.append('CompanyCode', this.appSession.companyCode);
      form.append('UniqueID', this.uniqueID);
      form.append('RefNumber', this.refNumber);
    };
    this.uploader.onWhenAddingFileFailed = (item, f, o ) => this.onWhenAddingFileFailed(item, f, o);
    this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);



    this.uploader.onProgressItem = (item, progress) => {

      this.progressAction = progress;
      this.itemName = item.file.name;
    }

    this.uploader.setOptions(this._uploaderOptions);


    this.uploader.onCompleteAll = () => {
      this.reset();

    };

  }

  save(): void {
    this.files = [];
    this.uploader.uploadAll();
  }

  onWhenAddingFileFailed(item: FileLikeObject, filter:any, options:any) {
    console.log(options);
    console.log(filter);
    this.notify.error('Unable to upload file name ' + item.name + '. Reason: ' + filter.name);
  }
  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    //let idata = JSON.parse(response); //success server response
   // this.notify.error(item.file.name + ' ----> ' + idata['result'],'Success');
}
onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {

  console.log(response);
  let ierror = JSON.parse(response); //error server response


      this.notify.error(item.file.name + ' ----> ' + ierror['result'],'Error', {"timer":6000,"animation":true });


}

  fileChangeEvent(event: any): void {


    this.uploader.clearQueue();

    this.uploader.addToQueue(event.target.files);
    this.uploader.uploadAll();


  }

  reset() {

    this.uploader.destroy();
    this.getFiles();
    this.myInputVariable.nativeElement.value = '';
    this.description = '';

  }
}
