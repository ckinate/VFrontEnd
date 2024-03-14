import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { QuestionaresServiceProxy, CreateOrEditQuestionareDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';


@Component({
    selector: 'createOrEditQuestionareModal',
    templateUrl: './create-or-edit-questionare-modal.component.html'
})
export class CreateOrEditQuestionareModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    questionare: CreateOrEditQuestionareDto = new CreateOrEditQuestionareDto();



    constructor(
        injector: Injector,
        private _questionaresServiceProxy: QuestionaresServiceProxy
    ) {
        super(injector);
    }

    show(questionareId?: number): void {


        if (!questionareId) {
            this.questionare = new CreateOrEditQuestionareDto();
            this.questionare.id = questionareId;

            this.active = true;
            this.modal.show();
        } else {
            this._questionaresServiceProxy.getQuestionareForEdit(questionareId).subscribe(result => {
                this.questionare = result.questionare;


                this.active = true;
                this.modal.show();
            });
        }

    }

    save(): void {
            this.saving = true;



            this._questionaresServiceProxy.createOrEdit(this.questionare)
             .pipe(finalize(() => { this.saving = false;}))
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
