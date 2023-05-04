import { Model } from "sequelize/types";
import { ReviewFields,reviewDTO } from "common";

export async function mapReview(review :Model<any, any>){
    let reviewdto: reviewDTO = {
        id: review.get(ReviewFields.id) as string,
        reviewtext: review.get(ReviewFields.reviewtext) as string,
        acknowledged: review.get(ReviewFields.acknowledged) as boolean
    }
    return reviewdto;
}    
export async function mapReviews(_reviews :Model<any, any>[]){
    console.log("yola")
    let retReviews: reviewDTO[] = [];
    if(_reviews){
        _reviews.forEach(async (review)=>{
            let retReview = await mapReview(review);
            retReviews.push(retReview);
        })
    }
    return retReviews;
}