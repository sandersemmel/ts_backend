import express, {Request,Response, NextFunction} from 'express';
import bcrypt from 'bcrypt';
import isStrongPassword from 'validator/lib/isStrongPassword';
import jwt, { JwtPayload } from 'jsonwebtoken';
import * as usercontroller from '../controllers/businesscontroller';
import { retval, JWT_ENUM } from '../types/types';
import { json } from 'sequelize';
import { base, genericresponse, STATUSCODES } from 'common';
import { INITIALLY_DEFERRED } from 'sequelize/types/deferrable';

const now = new Date();
let router = express.Router();
//let privatekey = "kissa"; // TODO better one
let privatekey = "BRO"; // TODO better one


export async function generateToken(username:string): Promise<string>{
    let payload = {
        user: username,
        iat: now.getTime()
    }
    let jwtToken = jwt.sign(payload,privatekey);
    console.log("toukkeni",jwtToken);
    return jwtToken;
}


function done(error: any){
    if(error == null){
        console.log("user was not found");
    }
}


router.post('/login1', async (req:Request,res:Response)=>{
    let {username,password} = req.body;
     let loginResponse = await login(username,password);
    if(loginResponse === retval.LOGGED_IN){
        let token = await generateToken(username);
        res.setHeader("Authorization",token)
    }
 
    res.send(loginResponse);
})

router.get('/privateroute', canUserPassMiddleware, async (req:Request,res:Response)=>{

    res.send("/privateroute");
})

router.post('/signup', async (req:Request, res:Response)=>{
    
    let {username,password,businessname} = req.body;
    console.log("uusernaami:",username, "passwordddi: ",password)
    let register_status = await register(username,password, businessname);
    
    res.send(register_status)
})


router.post('/isUsernameAllowed', async (req:Request,res:Response)=>{
    try {
        let {username} = req.body;
        let userExists = await doesUserExist(username);
        if(!userExists){
            res.send("OK")
        }
        res.send("NOK");
    } catch (error) {
        res.send("something went wrong");
    }    
})

router.post('/isPasswordAllowed', async (req:Request,res:Response)=>{
    let {password} = req.body;
    if(isPasswordAllowed(password)){
        res.send("OK")
    }
    res.send("NOK");
})
async function doesUserExist(username:string): Promise<boolean>{
    let user = await usercontroller.getBusinessByEmail(username);
    if(!user){
        return false;
    }
    return true;
}



function isPasswordAllowed(password:string): boolean{
    if(isStrongPassword(password)){
        return true;
    }
    return false;
    
}

async function login(username: string, plainpassword:string): Promise<string>{
    let userHashedPw = await usercontroller.getUserPassword(username);
    if(userHashedPw === ""){
        return retval.WRONG_USERNAME_OR_PW;
    }
    if(await bcrypt.compare(plainpassword,userHashedPw)){
        return retval.LOGGED_IN;
    }
    return retval.WRONG_USERNAME_OR_PW;

}



async function register(username:string, password:string, businessName: string): Promise<string>{
    let user = await usercontroller.getBusinessByEmail(username);

    if(user){
        return retval.USERNAME_EXISTS;
    }
        let hashedPassword = await hashPassword(password);
        let isGoodPw =  isStrongPassword(password);
        if(!isGoodPw){
            return retval.PASSWORD_NOT_STRONG;
        }
        usercontroller.createBusiness(username,hashedPassword,businessName);

        return retval.USER_CREATED;
}



async function hashPassword(password: string): Promise<string>{
     let salt = await bcrypt.genSalt();
     let hashedPw = await bcrypt.hash(password,salt);
     return hashedPw;
}



export async function canUserPassMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        let JWT = req.body[JWT_ENUM.LOCALSTORAGE_JWT_TOKEN];
        console.log("Here's the JWT token you are using",jwt);
        
        if(await canUserPass(JWT)){
            console.log("can pass");
            next();
        }

    } catch (error) {
        console.log(error);
        res.send("Can not let you pass, you have no token");

    }


}

export async function canUserPassMidWare(req:Request,res:Response,next:NextFunction) {
    let boudy = req.body as base;
    let genericresponse: genericresponse = {
        status: STATUSCODES.NOK,
        token: "",
    }

    try {
        if(!await canUserPass(boudy.token)){
            genericresponse.message = "Token not correct";
            res.send(genericresponse);
            return;
        }
        next();
    } catch (error) {
        console.log(error);
        genericresponse.message = "Unable to parse token ";
        res.send(genericresponse);
        return;
    }
}

export async function canUserPass(token:string): Promise<boolean>{
    try {
        jwt.verify(token,privatekey);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
    
}

export async function getPropertyFromToken(token:string, property: string): Promise<string>{
    try {
        let response = jwt.decode(token) as JwtPayload;
        return response[property];
    } catch (error) {
        console.log(error);
        return "";
    }
    
}
