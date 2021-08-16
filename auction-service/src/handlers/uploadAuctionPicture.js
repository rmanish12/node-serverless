import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";
import { getAuctionById } from "./getAuction";
import { uploadPictureToS3 } from "../helpers/uploadPictureToS3";
import { setAuctionPictureUrl } from "../helpers/setAuctionPictureUrl";

async function uploadAuctionPicture(event) {
    const { id } = event.pathParameters;
    const { email } = event.requestContext.authorizer;
    const auction = await getAuctionById(id);

    if (auction.seller !== email) {
        throw new createError.Forbidden("You are not the seller of this item.");
    }

    const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, "base64");

    let result;

    try {
        const pictureUrl = await uploadPictureToS3(`${auction.id}.jpg`, buffer);
        result = await setAuctionPictureUrl(id, pictureUrl);
    } catch (err) {
        console.error(err);
        throw new createError.InternalServerError(err);
    };

    return {
        statusCode: 200,
        body: JSON.stringify(result)
    };
};

export const handler = middy(uploadAuctionPicture)
    .use(httpErrorHandler());