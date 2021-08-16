import AWS from "aws-sdk";

const ses = new AWS.SES({ region: process.env.REGION });

async function sendMail(event, context) {
  const record = event.Records[0];
  console.log("record processing: ", record);
  const email = JSON.parse(record.body);
  const { body, subject, recipient } = email;

  const params = {
    Source: process.env.SENDER_MAIL,
    Destination: {
      ToAddresses: [recipient]
    },
    Message: {
      Body: {
        Text: {
          Data: body
        }
      },
      Subject: {
        Data: subject
      }
    }
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

export const handler = sendMail;


