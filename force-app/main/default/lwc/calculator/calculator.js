import { LightningElement, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import getAccountsByUserInput from '@salesforce/apex/AccountController.getAccountsByUserInput';
import getAccountsSortedByAccName from '@salesforce/apex/AccountController.getAccountsSortedByAccName';
import getAccountsSortedByAccOwner from '@salesforce/apex/AccountController.getAccountsSortedByAccOwner';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ID_FIELD from '@salesforce/schema/Account.Id';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import OWNER_FIELD from '@salesforce/schema/Account.OwnerId';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import WEBSITE_FIELD from '@salesforce/schema/Account.Website';
import ANNUALREVENUE_FIELD from '@salesforce/schema/Account.AnnualRevenue';

const columns = [
    { label: 'Name', fieldName: 'nameUrl', type:'url', 
    typeAttributes: {
        label: { 
            fieldName: 'Name' 
        },
        target : '_blank'
        }
    },
    { label: 'OwnerId', fieldName: 'OwnerId'},
    { label: 'Phone', fieldName: 'Phone', type: 'phone', editable: true },
    { label: 'Website', fieldName: 'Website', type: 'url', editable: true },
    { label: 'AnnualRevenue', fieldName: 'AnnualRevenue', type: 'currency', editable: true },
];

export default class AccountManagertask extends LightningElement{
    @track accounts;
    searchString;
    record;
    columns=columns;
    draftValues = [];

    connectedCallback(){
    getAccounts().then(data=>{
        let baseUrl = 'https://'+window.location.origin+'/';
                data.forEach(accRec => {
                    accRec.nameUrl = baseUrl+accRec.Id;
        this.accounts = data;
    }).catch(error=>{
        console.error('Error in getting the Accounts', error.body.message);
    });
    });
    }
    onChangeHandler(event){
        this.searchString=event.detail.value;
    }

    searchAccByName(){
        getAccountsByUserInput({searchString:this.searchString}).then(response=>{
            this.accounts = response;
        }).catch(error=>{
            console.error('Error in getting the Accounts', error.body.message);
        })
    }

    sortAccByName(){
        getAccountsSortedByAccName().then(response=>{
            this.accounts = response;
        }).catch(error=>{
            console.error('Error in getting the Accounts', error.body.message);
        })
    }

    sortAccByOwner(){
        getAccountsSortedByAccOwner().then(response=>{
            this.accounts = response;
        }).catch(error=>{
            console.error('Error in getting the Accounts', error.body.message);
        })
    }

    s
    
    
    handleSave(event) {

        const fields = {}; 
        fields[ID_FIELD.fieldApiName] = event.detail.draftValues[0].Id;
        fields[NAME_FIELD.fieldApiName] = event.detail.draftValues[0].Name;
        fields[OWNER_FIELD.fieldApiName] = event.detail.draftValues[0].OwnerId;
        fields[PHONE_FIELD.fieldApiName] = event.detail.draftValues[0].Phone;
        fields[WEBSITE_FIELD.fieldApiName] = event.detail.draftValues[0].Website;
        fields[ANNUALREVENUE_FIELD.fieldApiName] = event.detail.draftValues[0].AnnualRevenue;


        const recordInput = {fields};

        updateRecord(recordInput).then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Account updated',
                    variant: 'success'
                })
            );
            // Display fresh data in the datatable
            return refreshApex(this.accounts).then(() => {

                // Clear all draft values in the datatable
                this.draftValues = [];

            });
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }

}