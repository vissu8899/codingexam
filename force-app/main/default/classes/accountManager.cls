public with sharing class accountManager{
    @AuraEnabled(cacheable=true)
    public static List<Account> getTenAccounts(){
        return [SELECT Id, Phone, Name FROM Account limit 10];
        
    }
}
