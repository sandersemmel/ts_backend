import * as models from '../models/models';
import * as db from '../types/dbenums';
import {PaymentFields} from 'common';
import * as businesscontroller from './businesscontroller'



export async function createPayment(data, isSuccess: boolean, businessID: number){
    //console.log("Creating new Business:",email,password,businessName);

    let paymentTime = data["object"]["created"] as unknown as number;

    return await models.Payment.create({[PaymentFields.paymenttime]: paymentTime, [PaymentFields.paymentOK]: isSuccess, [PaymentFields.FK_business_ID]: businessID} );
}


export async function createPayment2(createdTime: number, isSuccess: boolean, businessID: number){
    return await models.Payment.create({[PaymentFields.paymenttime]: createdTime, [PaymentFields.paymentOK]: isSuccess, [PaymentFields.FK_business_ID]: businessID} );

}

export async function getPaymentDetails(email: string){
    let business = await businesscontroller.getBusinessByEmail(email);
    if(!business){
        console.log("business does not exist")
        return null; // RETURN WAHT????
    }
    let businessID = business.get("id");

    console.log("businessid", businessID);

    let DBPayment =models.Payment.findOne({where: {[PaymentFields.FK_business_ID]: businessID}});

    if(!DBPayment){
        console.log("Payment row doesn't exist at all");
        return null;
    }

    return DBPayment;
}

