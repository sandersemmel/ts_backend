import * as reviewcontroller from '../controllers/reviewcontroller';
import express, {Request,Response, NextFunction} from 'express';
import {reviewsentresponse, reviewdata, paths, STATUSCODES, unAcReviews, reviewDTO, BusinessFields,base} from 'common'
import { mapReview } from '../mappers/reviewsmapper';
import { canUserPassMidWare, getPropertyFromToken } from './authservice';
import { getBusinessByEmail } from '../controllers/businesscontroller';


//mysql.escape()
export let router = express.Router();



router.post(paths.saveReview, async (req: Request, res: Response)=>{
    console.log("Creating a new review..");
    let reviewresponse: reviewsentresponse = {
        message: "Not yet initialised",
        status: STATUSCODES.NOK
    }; 

     try {
        let reviewdatum = req.body;
        reviewdatum as reviewdata;
        console.log("reqboudy",req.body);
        console.log("reviewdatum", reviewdatum);
        console.log("e")
            if(!reviewdatum){
                reviewresponse.message = "The message sent was empty";
                res.send(reviewresponse)
                return;
            }

            let created = await createReview(reviewdatum.reviewmessage,reviewdatum.business);

            console.log("kek")
            if(!created){
                reviewresponse.message = "Did not create a new review"
                res.send(reviewresponse);
                return;
            }
            console.log("kok")

            reviewresponse.message = "Created new review.";
            reviewresponse.status = STATUSCODES.OK;
            res.send(reviewresponse);
            return;
 
        }    
     catch (error) {
        reviewresponse.message = "Something went terribly wrong..";
        res.send(reviewresponse);
        return;

    }


})

router.post(paths.ackReview, (req,res)=>{
    try {
        console.log(paths.ackReview);
        let reviewDTO: reviewDTO = req.body;
        console.log(reviewDTO);
        let reviewPk = reviewDTO.id as unknown as number;
        reviewcontroller.setReviewAcked(reviewPk);
    } catch (error) {
        console.log("Error acking the review", error);
        res.send(201);
    }
    res.send(200);

})


router.post(paths.unacknowledgedReviews,canUserPassMidWare, async (req,res)=> { 
    let useremail = "";
    let businessID = 0;
    let response: unAcReviews ={
        status: 'Could not fetch any',
        reviews: []
    };

    try {
        let baseBody = req.body as base;
        
        
        useremail = await getPropertyFromToken(baseBody.token,"user");

        if(!useremail){
            response.status = "Could not parse user email from token";
            return res.send(response);
        }

        let business = await getBusinessByEmail(useremail);
        businessID = business.get(BusinessFields.id) as number;
        if(!businessID){
            throw Error("No businessID on this user");
        }

    } catch (error) {
        console.log("Error trying to get token from body", error);
        response.status = "Error trying to get token from body";
        return res.send(response);
    }

    console.log("Fetching reviews..", useremail);
    let reviews = await reviewcontroller.getAllUnacknowledgedReviews(businessID);
    console.log("Done fetcing reviews", reviews);
    response.reviews = reviews;

    return res.send(response);
})


async function createReview(reviewText: string, businessName: string): Promise<boolean>{
    return await reviewcontroller.createReview(businessName,reviewText);
}