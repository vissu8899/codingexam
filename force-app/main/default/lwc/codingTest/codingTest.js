import { LightningElement, track} from 'lwc';
import getFinancialAccounts from '@salesforce/apex/AccountController.getFinancialAccounts'
import getFilteredAccounts from '@salesforce/apex/AccountController.getFilteredAccounts'
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ID_FIELD from '@salesforce/schema/Account.Id';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import OWNER_FIELD from '@salesforce/schema/Account.Owner.Name';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import WEBSITE_FIELD from '@salesforce/schema/Account.Website';
import ANNUALREVENUE_FIELD from '@salesforce/schema/Account.AnnualRevenue';

const actions = [
    { label: 'view', name: 'view' }
];

const columns = [   
    { label: 'Account Name', fieldName: 'Name', type: 'name', sortable: true },
    { label: 'Account Owner', fieldName: 'Owner.Name', type: 'name', editable: true, sortable: true },
    { label: 'Phone', fieldName: 'Phone', type: 'Phone', editable: true },
    { label: 'Website', fieldName: 'Website', type: 'url', editable: true },
    { label: 'Annual Revenue', fieldName: 'AnnualRevenue', type: 'currency', editable: true },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

export default class codingTest extends NavigationMixin( LightningElement ) {
     
    
    @track accounts;
    @track error; 
    @track columns = columns; 
    userinput;
    sortedBy;
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    rowOffset = 0;
    draftValues = [];
    
    
  
  
     connectedCallback(){
        getFinancialAccounts().then(response=>{
        
        
            this.accounts = response.map(record => Object.assign(
            { "Owner.Name": record.Owner.Name},
            record
                 )
                      );
                      
        }).catch(error=>{
            console.error('Error in getting the Accounts', error.body.message);
        });
         
    }
    onChangeHandler(event){
        this.userinput=event.detail.value;
    }
    
    searchHandler(){
        getFilteredAccounts({userinput:this.userinput}).then(response=>{
            this.accounts = response.map(record => Object.assign(
                { "Owner.Name": record.Owner.Name},
                record
                     )
                          );
                          
            
        }).catch(error=>{
            console.error('Error in getting the Accounts', error.body.message);
        })
    }
   
    
    onHandleSort( event ) {

        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.accounts];

        cloneData.sort( this.sortBy( sortedBy, sortDirection === 'asc' ? 1 : -1 ) );
        this.accounts = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;

    }

    sortBy( field, reverse, primer ) {

        const key = primer
            ? function( x ) {
                  return primer(x[field]);
              }
            : function( x ) {
                  return x[field];
              };

        return function( a, b ) {
            a = key(a);
            b = key(b);
            return reverse * ( ( a > b ) - ( b > a ) );
        };

    }
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
            
            return refreshApex(this.accounts).then(() => {

                
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
    handleRowAction( event ) {

        const actionName = event.detail.action.name;
        const row = event.detail.row;
        if( actionName == 'view' ) {
            
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        actionName: 'view'
                    }
                });
                


}
    

}}