import { LightningElement ,track} from 'lwc';

export default class LDSForms extends LightningElement {
@track recordId;

successhandler(event){
    this.recordId=event.detail.id;
}
}