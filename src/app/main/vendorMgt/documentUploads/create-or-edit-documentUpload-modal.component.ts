import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { DocumentUploadsServiceProxy, CreateOrEditDocumentUploadDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';


@Component({
    selector: 'createOrEditDocumentUploadModal',
    templateUrl: './create-or-edit-documentUpload-modal.component.html'
})
export class CreateOrEditDocumentUploadModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    documentUpload: CreateOrEditDocumentUploadDto = new CreateOrEditDocumentUploadDto();



    constructor(
        injector: Injector,
        private _documentUploadsServiceProxy: DocumentUploadsServiceProxy
    ) {
        super(injector);
    }

    show(documentUploadId?: number): void {


        if (!documentUploadId) {
            this.documentUpload = new CreateOrEditDocumentUploadDto();
            this.documentUpload.id = documentUploadId;

            this.active = true;
            this.modal.show();
        } else {
            this._documentUploadsServiceProxy.getDocumentUploadForEdit(documentUploadId).subscribe(result => {
                this.documentUpload = result.documentUpload;


                this.active = true;
                this.modal.show();
            });
        }

    }

    save(): void {
            this.saving = true;



            this._documentUploadsServiceProxy.createOrEdit(this.documentUpload)
             .pipe(finalize(() => { this.saving = false; }))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }







    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
