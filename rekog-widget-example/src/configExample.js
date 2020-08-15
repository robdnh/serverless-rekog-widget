export default {
    MAX_ATTACHMENT_SIZE: 5000000,
    s3: {
        REGION: 'us-east-1',
        BUCKET: 'BUCKET-NAME'
    },
    cognito: {
        REGION: 'us-east-1',
        USER_POOL_ID: 'USER_POOL_ID',
        APP_CLIENT_ID: 'APP_CLIENT_ID',
        IDENTITY_POOL_ID: 'IDENTITY_POOL_ID'
    },
    appSync: {
      REGION: 'us-east-1',
      ENDPOINT: 'GRAPHQL_ENDPOINT',
      AUTHTYPE: 'AWS_IAM'
    }
};