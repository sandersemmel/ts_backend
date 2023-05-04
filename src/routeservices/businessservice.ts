import * as businesscontroller from '../controllers/businesscontroller';
import express, {Request,Response, NextFunction, response} from 'express';
import * as db from '../database/database';
import * as models from '../models/models';
import {paths, setvalue, genericresponse, STATUSCODES, base, BusinessFields, PaymentFields} from 'common';
import * as authservice from './authservice';
import { getPaymentDetails } from '../controllers/paymentcontroller';

export let router = express.Router();



router.get('/testcreatebusiness', async (req:Request,res:Response)=>{
    try {
        let user = await testCreateUser();
        res.send(user);
    } catch (error) {
        console.log(error);
        res.send("error happened");
    }

})

router.post(paths.getorderstatus,authservice.canUserPassMidWare,async (req:Request,res:Response)=>{
    let baseobj = req.body as base;
    console.log("getting order status");
    let resp: genericresponse = {
        token: "",
        status: STATUSCODES.NOK,
        message: ""
    }

    let email = await authservice.getPropertyFromToken(baseobj.token, "user");
    if(!email){
        resp.message = "Business not found";
        return res.send(resp);
    }

    let paymentDetails = await getPaymentDetails(email);
        console.log("payment details", paymentDetails);

    if(!paymentDetails){
        resp.message = "Paymentdetails not yet found / not yet updated "
        return res.send(resp);
    }

    resp.extravalue = paymentDetails.get(PaymentFields.paymentOK) as string;
    
    console.log("extravalue set", resp.extravalue);

    resp.message = "Payment details found";
    return res.send(resp);

})

router.get("/getAllBusinesses", async (req,res)=>{
    let businesses = await businesscontroller.getAllBusiness();
    console.log("businesses",businesses);

    res.send(businesses);
})

router.post(paths.updatebusinessname,authservice.canUserPassMidWare,async  (req,res)=>{
    let resp: genericresponse = {
        token :"",
        status: STATUSCODES.NOK,
        message: ""
    }

    try {
        let setval = req.body as setvalue;
        console.log(setval);

        let email = await authservice.getPropertyFromToken(setval.token, "user");
        if(!email){
            resp.message = "no token sent?"
            res.send(resp);
        }
    } catch (error) {
        resp.message = "something went wrong, try again later";
        res.send(resp);
        console.log("error")
    }
    resp.message = "Name for business set";
    resp.status = STATUSCODES.OK;
    res.send(resp);
})


router.post(paths.getbusinessname,authservice.canUserPassMidWare, async (req,res)=>{
    let resp: genericresponse = {
        status: STATUSCODES.NOK,
        token: ""
    }
    let email = await authservice.getPropertyFromToken(req.body["token"],"user");
    let business = await businesscontroller.getBusinessByEmail(email);

    let businessname = business.getDataValue(BusinessFields.businessName);
    if(!businessname){
        resp.message =  "businessname not yet set"; // TODO should these returns be coded to the API so that it's easier to handle these cases in the UI?
        res.send(resp);
        return;
    }
    


    resp.extravalue = businessname;
    resp.status = STATUSCODES.OK;
    res.send(resp);
    return;   

})

export async function testCreateUser(){
    return await businesscontroller.createBusiness("mikko", "hypponen","koira");
}


export async function createBusiness(businessName: string){
//businesscontroller.createBusiness()
}