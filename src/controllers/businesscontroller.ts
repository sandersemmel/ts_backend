import * as models from '../models/models';
import * as db from '../types/dbenums';
import {BusinessFields} from 'common';

export async function createBusiness(email: string, password: string, businessName:string){
    console.log("Creating new Business:",email,password,businessName);

    
    return await models.Business.create({ [BusinessFields.email]: email, [BusinessFields.password]:password , [BusinessFields.businessName]:businessName});
}
export async function getBusinessByEmail(email: string){
    return await models.Business.findOne({where: {[db.BusinessFields.email]: email}});
}
export async function getBusinessByName(businessName: string){
    return await models.Business.findOne({where: {[db.BusinessFields.businessName]: businessName}});
}
export async function getAllBusiness(){
    return await models.Business.findAll();
}
export async function getUserPassword(username: string): Promise<string>{
    let user = await getBusinessByEmail(username);
    if(!user){
        return "";
    }

    try {
        return user.get("password") as string;
    } catch (error) {
        return "";
    }

}

export async function setBusinessName(email: string, newbusinessname: string): Promise<boolean>{
    let business = await getBusinessByEmail(email);
    if(!business){
        return false
    }
    if(!business.set(BusinessFields.businessName, newbusinessname)){
        return false
    }
    try {
        business.save();    
    } catch (error) {
        console.log(error)
        return false;
    }
    
}