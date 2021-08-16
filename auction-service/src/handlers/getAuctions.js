import AWS from "aws-sdk";
import createError from "http-errors";
import validator from "@middy/validator";
import commonMiddleware from "../helpers/commonMiddleWare";
import getAuctionsSchema from "../helpers/schemas/getAuctionsSchema";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  const { status } = event.queryStringParameters;
  let auctions;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: "statusAndEndingAt",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeValues: {
      ":status": status
    },
    ExpressionAttributeNames: {
      "#status": "status"
    }
  };

  try {
    const result = await dynamoDB.query(params).promise();
    auctions = result.Items;
  } catch (err) {
      console.error(err);
      throw new createError.InternalServerError(err);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions)
  };
}

export const handler = commonMiddleware(getAuctions)
  .use(validator({
    inputSchema: getAuctionsSchema,
    ajvOptions: {
      useDefaults: true,
      strict: false
    }
  }));