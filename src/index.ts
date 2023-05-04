import express, {Express, Request, Response} from 'express';
import { environmentoptions } from './types/types';
import { getEnvOptions, initializeFireBase } from './env/envreader';
import https from 'https';
import * as businessService from './routeservices/businessservice';
import * as reviewservice from './routeservices/reviewservice';
import * as stripeservice from './routeservices/stripeservice';
import {seq} from './database/database';
import cors from 'cors';
import bodyparser from 'body-parser';
import { populateBusinesses } from './util/populator';
import * as magiclinkauth from './util/auth';


//import { createWallet, getAllWallets, getWalletDetailsTest } from './routeservices/lightning';

const app: Express = express();
let initialized: boolean = false;

let envopts: environmentoptions;
envopts = getEnvOptions();



let kek = https.createServer(envopts.ssloptions, app).listen(envopts.expresshttpsport, async function(){
    console.log("Starting to listen on " + envopts.expresshttpsport);
    console.log("Syncing database..")
    if(envopts.env_type == "PROD"){
        await seq.sync({force:false});    
    }else{
        await seq.sync({alter:true, force: true});
        console.log("Populating database..")
        await populateBusinesses();
        await initializeFireBase();
    }    
})



// # ROUTESERVICES DEFINITIONS
app.use(cors());
app.use(bodyparser.json()); // This is needed because otherwise the body recieved in the backend is undefined
//app.use('/', authService.router); // Deprecated, moved to magiclinkauth
app.use('/', businessService.router);
app.use('/', reviewservice.router)
app.use('/', magiclinkauth.router);
app.use('/', stripeservice.router);

app.get('/test', async (req: Request, res: Response) => {
    res.send('/test');
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('/console', function(req, res){
    res.send(200);
    console.log("yo??")
  });




