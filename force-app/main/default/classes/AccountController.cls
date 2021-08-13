public with sharing class AccountController {
    
   
    
        @AuraEnabled
        public static List<Account> getFinancialAccounts()
        {
        return [Select Id, Name, Owner.Name, Phone, Website, AnnualRevenue FROM Account where Industry='Financial Services'];
        
        } 
        @AuraEnabled
    public static List<Account> getFilteredAccounts(String userinput)
    {
        string data=userinput;
        data = '%' + data + '%'; 
    return [Select Id, Name, Owner.Name, Phone, Website, AnnualRevenue FROM Account where Industry='Financial Services' AND Name LIKE :data];
    
    }
    }     
    
    

