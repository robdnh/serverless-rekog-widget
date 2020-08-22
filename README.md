<!-- PROJECT LOGO -->
<br />
<p align="center">

  <h3 align="center">Rekognition Component Processing Infrastructure<h3>

  <p align="center">
    Set of Serverless Framework Cloudformation templates that builds out a AWS Rekognition processing infrastructure and returns results to a user. Backend and API powered by Cognito, Appsync, and DynamoDB. Infrastructure interaction limited to authenticated users GraphQL queries against Appsync API.
    <br />
    <br />
    <a href="https://robdnh.github.io">View Site</a>
    ·
    <a href="https://github.com/robdnh/serverless-rekog-widget/issues">Report Bug</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [License](#license)
* [Contact](#contact)



<!-- ABOUT THE PROJECT -->
## About The Project

### Built With

#### Rekognition Infrastructure
* [AWS Rekognition](https://aws.amazon.com/rekognition/)
* [AWS Lambda](https://aws.amazon.com/lambda/)
* [AWS DynamoDB](https://aws.amazon.com/dynamodb/)
* [AWS AppSync](https://aws.amazon.com/appsync/)
* [AWS S3](https://aws.amazon.com/s3/)

#### Web Deployment Example
* [AWS Amplify](https://aws.amazon.com/amplify/)
* [Microsoft Fluent UI](https://developer.microsoft.com/en-us/fluentui#/)
* [React Router](https://reactrouter.com/)
* [React Webcam](https://github.com/mozmorris/react-webcam)
* [AWS Cloudfront](https://aws.amazon.com/cloudfront/)
* [AWS S3](https://aws.amazon.com/s3/)
* [AWS Cloudfront](https://aws.amazon.com/cloudfront/)

### Deployed With
* [Serverless Framework](https://www.serverless.com/)
* [AWS Developer Tools](https://aws.amazon.com/products/developer-tools/)

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* [AWS Account](https://aws.amazon.com/console/)
* [Node JS](https://nodejs.org/en/)
* [Setup Serverless Framework](https://www.serverless.com/framework/docs/getting-started/)
* [AWS CLI and Local Credential Setup](https://aws.amazon.com/cli/)

### Setup
 
1. Create AWS Account
2. Setup Node JS on Local Machine
3. Setup Serverless Framework utilizing NPM
4. Setup AWS CLI and Configure Local Credentials


<!-- USAGE EXAMPLES -->
## Usage

1. Deploy the Rekognition infrastructure.

2. If required, deploy the example React app

### Deploy Rekognition Infrastructure

1. Clone the repo
```sh
git clone https://github.com/robdnh/serverless-rekog-widget.git
```

2. Navigate to root of the Project folder

3. Deploy the AWS Infrastructure
```sh
serverless deploy
```

### Deploy Example Site

1. Navigate to configExample.js. Identify and insert the Resource IDs associated with this infrastructure in your C2S Account.

1. In a command line, navigate to the "rekog-widget-example" directory

2. Run the code
```sh
npm start
```

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.


<!-- CONTACT -->
## Contact

Rob D.

Project Link: [https://github.com/robdnh/robdnh.github.io](https://github.com/robdnh/robdnh.github.io)