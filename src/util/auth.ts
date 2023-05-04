import express, { Request, Response } from 'express';
import {paths, STATUSCODES} from 'common';
import * as authservice from '../routeservices/authservice';
import { logindata, authenticate, authenticationresponse,loginresponse} from 'common';
import * as businesscontroller from '../controllers/businesscontroller';
import * as EmailValidator from 'email-validator';
import * as randomstring from 'randomstring';
import { auth, initializeFireBase } from '../env/envreader';


export let router = express.Router();


const now = new Date();

let loginres: loginresponse = {
    token : "",
    message: ""
}

async function createRandomBusinessName(){
    return randomstring.generate(13);
}

let magicloginstrategy = {

    login: async (request,response:Response,next)=>{ 
        try {
            let logindata = request.body as logindata;

            if(!logindata.destination){
                loginres.message = "No email sent";
                response.send(loginres);
                return;
            }

            if(!EmailValidator.validate(logindata.destination)){
                loginres.message = "not an email";
                response.send(loginres);
                return;
            }

            console.log("checking in with firebase");
            console.log("what the  is this,", auth);

            if(!auth){
                await initializeFireBase();
            }

            let decodedToken = await auth.verifyIdToken(logindata.token);
            console.log("decodedToken", decodedToken);
            


            let business = await businesscontroller.getBusinessByEmail(logindata.destination);

            if(!business){
                // # does not exist, creating new
                let randomBusinessName = await createRandomBusinessName();
                let createdbusiness = await businesscontroller.createBusiness(logindata.destination,'NOT_SET',randomBusinessName);
            }
            
            let token = await authservice.generateToken(logindata.destination);
            if(!token){
                loginres.message = "No token created";
                loginres.loggedin = false
                response.send(loginres);
            }


            loginres.message = "Logged in.";
            loginres.loggedin = true;
            loginres.token = token;
            response.send(loginres);
            return;
            
        } catch (error) {
            console.log(error);
            loginres.message = "Something went wrong";
            loginres.loggedin = false;
            response.send(loginres);
            return;
        }
        
    },
    verify :async (request:Request,response:Response) : Promise<authenticationresponse>=>{
        // # Get from body the JWT token
        // # TODO There is a problem when someone steals your token and can access your data
        
        let resobj: authenticationresponse = {
            token: "",
            message: "",
            loggedin: false,
            status: STATUSCODES.NOK
        }
        
        // let auth = await getAuthObject();
        // let isLinkOk = isSignInWithEmailLink(auth,request.url);
        
        // if(!isLinkOk){
        //     response.send(resobj); 
        //     return;
        // }

        //signInWithEmailLink(auth,)

    
            resobj.message = "You're good to go!";
            resobj.loggedin = true;
            resobj.status = STATUSCODES.OK;
            response.send(resobj);
            return;
            
        
    }

}

router.post(paths.login, magicloginstrategy.login);
router.get(paths.authenticate,magicloginstrategy.verify);
