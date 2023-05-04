import { where } from 'sequelize';
import * as models from '../models/models';
import { ReviewFields, BusinessFields } from 'common';
import * as businesscontroller from './businesscontroller';
import { mapReviews } from '../mappers/reviewsmapper';
import { response } from 'express';


export async function createReview(businessName: string, reviewText: string): Promise<boolean>{
    // # FIND IF BUSINESS EXISTS
    let business =  await businesscontroller.getBusinessByName(businessName);
    if(!business){
        return false
    }

    let result = await models.Review.create({ [ReviewFields.reviewtext]: reviewText, [ReviewFields.FKBusinessId]: business.get(BusinessFields.id)} );

    if(!result){
        return false;
    }

    return true;
}
export async function getReview(pk: number){
    return models.Review.findByPk(pk);
}
export async function getAllReviews(){
    return await models.Review.findAll();
}
export async function setReviewAcked(pk: number){
    let review = await getReview(pk);
    if(review){
        review.set(ReviewFields.acknowledged,true); 
        review.save();
    }

}
export async function getAllUnacknowledgedReviews(businessID: number){

    let dbReviews = await models.Review.findAll({where: {[ReviewFields.acknowledged]:false, [ReviewFields.FKBusinessId]: businessID} });
    let mappedReviews = await mapReviews(dbReviews);
    return mappedReviews;
}