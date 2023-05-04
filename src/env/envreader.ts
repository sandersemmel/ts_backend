import dotenv from 'dotenv';
import path from 'path';
import { environmentoptions } from 'common';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import {Auth, getAuth} from 'firebase-admin/auth'


let initialized = false;
export let firebaseSDK;

export let auth: Auth;

export let envopts: environmentoptions = {

    databasename: 'NOT_SPECIFIED_NOT_SPECIFIED',
    databaseusername: 'NOT_SPECIFIED_NOT_SPECIFIED',
    databasepassword: 'NOT_SPECIFIED_NOT_SPECIFIED',
    expresshttpsport: 0,
    ssl_key_path: "NOT_SPECIFIED_NOT_SPECIFIED",
    ssl_cert_path: 'NOT_SPECIFIED_NOT_SPECIFIED',
    ssl_ca_path: "NOT_SPECIFIED_NOT_SPECIFIED",
    env_type: "LOCAL",
    ssloptions: {
        key: "",
        cert: "",
        passphrase: ""

    },
    google_app_creds_path: "NOT_SPECIFIED_NOT_SPECIFIED"
}

export async function initializeFireBase(){
    console.log("Initializing firebase");
    firebaseSDK = initializeApp({
        credential: applicationDefault()
    });
    auth = getAuth(firebaseSDK);

}


export function initializeEnvOptions(): environmentoptions {

    if(initialized){
        return envopts;
    }


    let confFilePath = path.resolve(__dirname, process.env.NODE_ENV + '.env');
    console.log("Reading configuration from file to process.env: ", confFilePath)
    
    dotenv.config({
        path: confFilePath
    })

    let databasename = process.env.DATABASE;
    let databaseusername = process.env.DATABASE_USERNAME;
    let databasepassword = process.env.DATABASE_PASSWORD;
    let expresshttpsport = process.env.EXPRESS_HTTPS_PORT as unknown as number;
    let sslkeypath = process.env.SSLKEYPATH;
    let sslcertpath = process.env.SSLCERTPATH;
    let env_type  = process.env.NODE_ENV;
    let sslpassphrase = process.env.SSLPASSWORD;
    let sslcapath = process.env.SSLCAPATH;
    let google_sdk = process.env.GOOGLE_APPLICATION_CREDENTIALS;



    envopts = {
        databasename: databasename || "",
        databaseusername: databaseusername || "",
        databasepassword: databasepassword || "",
        expresshttpsport: expresshttpsport || 0,
        ssl_key_path: sslkeypath || "",
        ssl_cert_path: sslcertpath || "",
        ssl_ca_path: sslcapath || "",
        env_type: env_type == "development" ? "LOCAL" : "PROD",
        ssloptions: {
            key: "",
            cert: "",
            passphrase: sslpassphrase || ""
        },
        google_app_creds_path : google_sdk  
    }

    console.log(`Here are the envs:"${JSON.stringify(envopts)}`)
    if(!databasename || !databaseusername || !databasepassword || !expresshttpsport || !sslkeypath || !sslcertpath || !google_sdk){
        throw new Error("Some of the fields are empty, could not initialize database!");
    }


    // READ SSL FILES FROM THE PATH AND SET THEM
    try {
        console.log(`Trying to read SSL files from: ${sslkeypath} and ${sslcertpath}`)

        envopts.ssloptions.key = fs.readFileSync(sslkeypath);
        envopts.ssloptions.cert = fs.readFileSync(sslcertpath);        
        
        if(!envopts.ssloptions.key || !envopts.ssloptions.cert){
            throw new Error("One of the files is not read correctly");
        }
    } catch (error) {
        console.log(error);
    }



    initialized = true;
    return envopts;
}

export function getEnvOptions(): environmentoptions{
    if(initialized){
        return envopts;
    }
    return initializeEnvOptions()
}