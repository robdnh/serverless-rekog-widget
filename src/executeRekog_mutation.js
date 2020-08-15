let AWS = require("aws-sdk");
let rekognition = new AWS.Rekognition();
let s3 = new AWS.S3();

const URL = require('url');
const env = require('process').env;
import fetch from 'node-fetch';

let labelData, userId, faceDetails;

//Set environment credentials from Lambda environment

AWS.config.update({
  region: 'us-east-1',
  credentials: new AWS.Credentials(env.AWS_ACCESS_KEY_ID, env.AWS_SECRET_ACCESS_KEY, env.AWS_SESSION_TOKEN)
});

export function main(event, context, callback) {

  //Log output for tracing purposes
  console.log(`Event = ${JSON.stringify(event, null, 2)}`);
  console.log(`Context = ${JSON.stringify(context, null, 2)}`);

  //Set params for ingesting proper image in Rekog S3 bucket

  //Key identification + pre-processing completed on front end
  //  before being sent to Lambda function
  let params = {
    Bucket: event.Records[0].s3.bucket.name,
    Key: event.Records[0].s3.object.key
  };

  userId = params.Key.split('/').pop().split('.')[0];

  //Promise chain for workflow execution
  rekognizeLabels(params.Bucket, params.Key)
    .then(function(data) {
      labelData = data["Labels"];
      return rekognizeFace(params.Bucket, params.Key);
    }).then(function(faceData) {
      faceDetails = faceData["FaceDetails"];
      return addToFacesTable(event, callback);
    }).then(function(data) {
      console.log("Data added to dynamodb table. Cleaning up S3");
      deleteUserImage(params);
    }).catch(function(err) {
      console.log(err);
    });
};


//Kick off Rekognition detectFaces based off requested
//image
function rekognizeFace(bucket, key) {
  let params = {
    Attributes: ["ALL"],
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: key
      }
    }
  };
  return rekognition.detectFaces(params).promise();
}

//Kick off Rekognition detectLabels based off requested
//image
function rekognizeLabels(bucket, key) {
  let params = {
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: key
      }
    },
    MaxLabels: 3,
    MinConfidence: 80
  };

  return rekognition.detectLabels(params).promise();
}

//Appsync mutation request. Passing data received from
//Rekognition image submission.
//Kudos to Adrian Hall (https://adrianhall.github.io/) re:
//code flow utilized below
async function addToFacesTable(event, callback) {
  let labels = [];
  labelData.forEach(function(label) {
    labels.push(label.Name);
  });
  let emotions = faceDetails[0]["Emotions"];
  let ageRange = faceDetails[0]["AgeRange"];
  let gender = faceDetails[0]["Gender"];
  const time = new Date().getTime();

  const addRekogResponse = `
  mutation addRekogResponse(
    $userId: ID!,
    $ageHigh: Int,
    $ageLow: Int,
    $emotionConf1: Float,
    $emotionConf2: Float,
    $emotionType1: String,
    $emotionType2: String,
    $genderConf: Float,
    $genderValue: String,
    $timestamp: Float
    ) {
    addRekogResponse(
      id: $userId,
      ageHigh: $ageHigh,
      ageLow: $ageLow,
      emotionConf1: $emotionConf1,
      emotionConf2: $emotionConf2,
      emotionType1: $emotionType1,
      emotionType2: $emotionType2,
      genderConf: $genderConf,
      genderValue: $genderValue,
      timestamp: $timestamp
    ) {
      id
      ageHigh
      ageLow
      emotionConf1
      emotionConf2
      emotionType1
      emotionType2
      genderConf
      genderValue
      timestamp
    }
  }
  `;

  const vars = {
    userId: userId,
    ageHigh: ageRange.High,
    ageLow: ageRange.Low,
    emotionConf1: emotions[0].Confidence,
    emotionConf2: emotions[1].Confidence,
    emotionType1: emotions[0].Type,
    emotionType2: emotions[1].Type,
    genderConf: gender.Confidence,
    genderValue: gender.Value,
    timestamp: time
  };

  const post_body = {
    query: addRekogResponse,
    operationName: 'addRekogResponse',
    variables: vars
  };
  console.log(`Posting: ${JSON.stringify(post_body, null, 2)}`);

  const uri = URL.parse(env.GRAPHQL_API);
  const httpRequest = new AWS.HttpRequest(uri.href, env.REGION);
  httpRequest.headers.host = uri.host;
  httpRequest.headers['Content-Type'] = 'application/json';
  httpRequest.method = 'POST';
  httpRequest.body = JSON.stringify(post_body);

  AWS.config.credentials.get(err => {
    const signer = new AWS.Signers.V4(httpRequest, "appsync", true);
    signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());

    const options = {
        method: httpRequest.method,
        body: httpRequest.body,
        headers: httpRequest.headers
    };
    console.log(err);

    fetch(uri.href, options)
      .then(res => res.json())
      .then(json => {
          console.log(`JSON Response = ${JSON.stringify(json, null, 2)}`);
          callback(null, event);
      })
      .catch(err => {
          console.error(`FETCH ERROR: ${JSON.stringify(err, null, 2)}`);
          callback(err);
      });
  });
};

// Image cleanup. Remove user images from S3 bucket upon workflow completion
function deleteUserImage(params) {
  s3.deleteObject(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
}