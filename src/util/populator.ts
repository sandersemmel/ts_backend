import { BusinessFields, Business } from 'common';
//import type { Business } from 'common';
import * as businesscontroller from '../controllers/businesscontroller'
import { createPayment2 } from '../controllers/paymentcontroller';

export async function populateBusinesses(){
    let businesses: Business[] = [];

    businesses.push({email:"makelanpizza@gmail.com",businessName:"voi",password:"password"});
    businesses.push({email:"tortillamesta@gmail.com",businessName:"tortillamesta",password:"password"});
    businesses.push({email:"parhaatleivat@gmail.com",businessName:"parhaatleivat",password:"password"});
    businesses.push({email:"bro.bro@gmail.com",businessName:"parhaatleivat",password:"password"});


    businesses.forEach(async (obje)=>{
        console.log("Creating a new Business in DB", obje.email);
        let response = await businesscontroller.createBusiness(obje.email,obje.password,obje.businessName);
        //console.log(response.toJSON());
        //console.log("heres the response", response)
    })


    console.log("Creating payment in database");
    createPayment2(1673382749722,true,4);
}