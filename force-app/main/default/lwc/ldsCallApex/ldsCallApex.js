import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/accountManager.getTenAccounts'
export default class LdsCallApex extends LightningElement {

@wire(getAccounts)
Account;

 get responseReceived(){
     if(this.Account){
         return true;
         console.log("account details are received");
     }
     else
     return false;
     console.log("there is an error");
 }
}