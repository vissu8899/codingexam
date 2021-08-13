import { LightningElement, track, wire } from 'lwc';
import { createRecord, getRecord } from 'lightning/uiRecordApi';
const fieldarray=['Account.Name', 'Account.Phone', 'Account.Website'];
export default class LDS extends LightningElement {
@track accountName;
@track accountPhone;
@track accountUrl;
@track recordId;



@wire(getRecord, {recordId: '$recordId', fields : fieldarray})
accountsRecord;

accountnamehandler(event)
{
    this.accountName=event.target.value;
}
accountphonehandler(event)
{
    this.accountPhone=event.target.value;
}
 accounturlhandler(event)
 {
        this.accountUrl=event.target.value;
    }

    createaccounthandler(){
        const fields = {"Name": this.accountName, "Phone" : this.accountPhone, "Website" : this.accountUrl};
        const create = {apiName : "Account", fields};
        
        createRecord(create).then(response =>{
            console.log("Account has been created with id:", response.id);
            this.recordId=response.id;
        }).catch(error=>{
            console.log("Account has not been created", error.body.message);
        })
    }

    get fetaccountname(){

        if(this.accountsRecord.data)

        return this.accountsRecord.data.fields.Name.value;

        else
         return undefined;
    }

    get fetaccountphone(){
        
        if(this.accountsRecord.data)

        return this.accountsRecord.data.fields.Phone.value;

        else
         return undefined;
    }
    get fetaccounturl(){
        
        if(this.accountsRecord.data)

        return this.accountsRecord.data.fields.Website.value;

        else
         return undefined;
    }



}