import AWS from "aws-sdk";
import createError from "http-errors";
import validator from "@middy/validator";
import commonMiddleware from "../helpers/commonMiddleWare";
import { getAuctionById } from "./getAuction";
import placeBidSchema from "../helpers/schemas/placeBidSchema";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;
  const { email } = event.requestContext.authorizer;

  const auction = await getAuctionById(id);

  if (auction.status !== "OPEN") {
    throw new createError.Forbidden(`You cannot place bid on closed auctions`);
  }

  if (amount <= auction.highestBid.amount) {
      throw new createError.Forbidden(`Your bid must be higher than ${auction.highestBid.amount}!`);
  };

  const params = {
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: { id },
      UpdateExpression: "set highestBid.amount = :amount, highestBid.bidder = :bidder",
      ExpressionAttributeValues: {
          ":amount" : amount,
          ":bidder" : email
      },
      ReturnValues: "ALL_NEW"
  };

  let updatedAuction;

  try {
    const result = await dynamoDB.update(params).promise();
    updatedAuction = result.Attributes;
  } catch (err) {
      console.error(err);
      throw new createError.InternalServerError(err);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction)
  };
}

export const handler = commonMiddleware(placeBid)
  .use(validator({
    inputSchema: placeBidSchema,
    ajvOptions: {
      strict: false
    }
  }));