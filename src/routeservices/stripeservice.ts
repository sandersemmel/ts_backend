import express, {Request,Response, NextFunction} from 'express';
import * as EmailValidator from 'email-validator';
import { getBusinessByEmail } from '../controllers/businesscontroller';
export let router = express.Router();
import { createPayment } from '../controllers/paymentcontroller';
import { BusinessFields } from 'common';

let paymentSuccess = "invoice.payment_succeeded";

router.post('/ordercreated', async (req,res)=>{

    // check for 'charge.succeeded' type from body
    console.log("order_created");


    console.log("body");
    console.log(req.body.data);


        // Make sure event is successful aka payment actually went through
        let type = req.body.type;
        if(type != paymentSuccess){
            console.log("diff type");
            res.send(400);
            return;
        }

        let isValido = await isValid(req.body.data)
        // 0 meaning the  business ID is 0
        if(isValido == 0){
            console.log("not valid");
            res.send(400);
            return;
        }


    let isOk = await createPaymentDb(req.body.data,isValido);
    if(!isOk){  
        res.send(400);
        return;
    }

    res.send(200);

})

async function createPaymentDb(data, businessID ): Promise<boolean>{

    try {
        createPayment(data,true, businessID);
    } catch (error) {
        console.log(error);
        return false;    
    }
    return true;
    
}

async function isValid(data):Promise<number>{

    if(!data){
        return 0;
    }
    // there's another  data object inside the data object lmao
    let datum= data["object"];
    
    if(!datum){
        console.log("datum is empty");
    }

    let customerEmail = datum["customer_email"];

    if(!customerEmail){
        console.log("customeremail", customerEmail);
        return 0;
    }

    if(!EmailValidator.validate(customerEmail)){
        console.log("not valid email");
        return 0;
    }

    let dbBiz = await getBusinessByEmail(customerEmail);

    if(!dbBiz){
        console.log("business does not exist");
        return 0;
    }

    return dbBiz.get(BusinessFields.id) as number;
    
}