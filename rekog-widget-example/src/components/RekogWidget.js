import React from 'react';
import Webcam from "react-webcam";
import { PrimaryButton, Spinner, SpinnerSize, Text } from '@fluentui/react';
import './RekogWidget.css';
import { API, graphqlOperation, Auth, Storage } from 'aws-amplify';
import { useViewport } from '../ViewportProvider';
import { Depths } from '@uifabric/fluent-theme';

const query =`
query me (
  $userId: ID!
){
  me(id:$userId){
    id
    ageLow
    ageHigh
    emotionConf1
    emotionConf2
    emotionType1
    emotionType2
    genderConf
    genderValue
    labels
    timestamp
  }
}
`

const SubscribeToRekogResponse = `
subscription (
    $userId: ID!
  ){
  addedRekogResponse(id:$userId){
    id
    ageLow
    ageHigh
    emotionType1
    emotionConf1
    emotionType2
    emotionConf2
    genderValue
    genderConf
    labels
    timestamp
  }
}
`

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

export const RekogWidget = (props) => {

  const { width, height } = useViewport();
  const widthBreakpoint = 1100;
  const heightBreakpoint = 820;

  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [rekogResponse, setRekogResponse] = React.useState(null);
  const [webcamIngest, setWebcamIngest] = React.useState(true);
  const [enableRekogWidget, setEnableRekogWidget] = React.useState(false);

  //Set video configs for webcam

  const pcVideoConstraints = {
    width: 640,
    height: 360,
  };

  const mobileVideoConstraints = {
    facingMode: "user"
  }
  
  const capture = React.useCallback(() => {
    
    //Cap screenshot with WebCam
    try {
    const imageSrc = webcamRef.current.getScreenshot({width: 640, height: 360});
    setWebcamIngest(false);
    // Convert Base64 before upload
    var buf = new Buffer(imageSrc.replace(/^data:image\/\w+;base64,/, ""),'base64')
    //Grab user attribs for S3 placement
    const user = Auth.user.attributes.sub;

    const params = {
      userId: user
    }

    //Put to S3 bucket. Need to use UserID to make sure 
    //image saved in right DynamoDB location
    Storage.put(`${user}.jpg`, buf, {
      contentType: 'image/jpeg',
      contentEncoding: 'base64'
    })
      .then( result => console.log(result))
      .catch(err => console.log(err));
    //Sub to DB update from Rekog response
      const subscription = API.graphql(
      graphqlOperation(SubscribeToRekogResponse, params)
    ).subscribe({
      next: eventData => setRekogResponse(eventData.value.data.addedRekogResponse),
    });
  } catch {
    console.log('issue occurred')
  }
  }, [webcamRef, setImgSrc]);

  const RekogEnabler = () => {
    return (
      <PrimaryButton
        text="Enable Rekog Widget?"
        type="submit"
        fullWidth
        onClick={() => setEnableRekogWidget(true)}
        style={{ margin: 'auto' }}
      />
    )
  }

  const ResponseParser = (responseJson) => {

    const item = [
        responseJson.genderValue,
        round(responseJson.genderConf, 2),
        responseJson.ageHigh,
        responseJson.ageLow,
        responseJson.emotionType1,
        round(responseJson.emotionConf1, 2),
        responseJson.emotionType2,
        round(responseJson.emotionConf2, 2),
        responseJson.timestamp
      ];
    
    return (
      <div class="rekogText">
        <Text block>Gender: {item[0]}</Text>
        <Text block>Gender Confidence: {item[1]}%</Text>
        <Text block>Age Estimate - High: {item[2]}</Text>
        <Text block>Age Estimate - Low: {item[3]}</Text>
        <Text block>Emotion 1 Type: {item[4]}</Text>
        <Text block>Emotion 1 Conf: {item[5]}%</Text>
        <Text block>Emotion 2 Type: {item[6]}</Text>
        <Text block>Emotion 2 Conf: {item[7]}%</Text>
        <Text block>Timestamp: {item[8]}</Text>
      </div>
    );
  }

  const RekogCam = () => {
    return (
      <div className="RekogContainer">
          <Webcam
            className="Widget-item"
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={width < widthBreakpoint ? 200 : 640}
            videoConstraints={((height < heightBreakpoint) || (width < widthBreakpoint)) ? mobileVideoConstraints : pcVideoConstraints}
            style= {{ boxShadow: Depths.depth8 }}
          />
          <PrimaryButton
            className="Widget-item"
            text="Capture Image"
            type="submit"
            fullWidth
            onClick={() => {
              capture()
            }}
            style={{marginTop: '5%'}}
          />
        </div>
    )
  }

  const RekogReturn = () => {
    return (
    <div>
      <div>
        {webcamIngest && (
        <RekogCam />
        )}
      </div>
      {rekogResponse && (
        ResponseParser(rekogResponse)
      )}
      {!rekogResponse && !webcamIngest && (
        <Spinner size={SpinnerSize.large} />
      )}
    
    </div>
    );
  }

  return (
    <div>
    { enableRekogWidget
      ? <RekogReturn />
      : <PrimaryButton
          text="Enable Rekog Widget?"
          type="submit"
          fullWidth
          onClick={() => setEnableRekogWidget(true) }
          style={{ margin: 'auto' }}
        />
    }
</div>
  );
}