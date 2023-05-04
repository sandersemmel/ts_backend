import * as nodemailer from 'nodemailer';
import AWSSDK from 'aws-sdk';
import * as nodeses from 'node-ses';
import { getEnvOptions } from '../env/envreader';
import { paths } from 'common';

import { authorize } from 'passport';

let keke = new AWSSDK.SES();
let envoptions = getEnvOptions();


keke.createConfigurationSet()

let client = nodeses.createClient({
    key: "SHOULD_NOT_BE_EMPTY",
    secret: "SHOULD_NOT_BE_EMPTY",
})


export function sendTestEmail(to: string, token: string, callbackurl: string){
    console.log("Starting to send email");

    let sendUrl = getUrl(token);

    client.sendEmail({
        from: 'login@SHOULDNOTBEEMPTY.xyz',
        subject: 'Login attempt',
        message: `Confirm your login by clicking here: ${sendUrl}`,
        to: to
    }, (params)=>{
        console.log(params);
        console.log(" I guess it is now sent, huh?");
    })
}


function getUrl(token: string){
    let url = `https://localhost:8081/authenticate`
    let productionUrl = `https://SHOULDNOTBEEMPTY/authenticate`
    let retURL = "";

    if(envoptions.env_type == "PROD"){
        retURL = productionUrl;
    }else{
        retURL = url;
    }
    return retURL;
}
