const https = require('https');
const url = require('url');

function processSns(context, sns) {
  console.log(sns);

  const slack_url = process.env["SLACK_URL"];
  const slack_channel = process.env["SLACK_CHANNEL"];

  const params = url.parse(slack_url);
  params.method = "POST";
  params.headers = {
    "Content-Type": "application/json"
  };
  const req = https.request(params, function (res) {
    if (res.statusCode === 200) {
      context.succeed('posted to slack: ' + slack_channel);
    } else {
      context.fail('status code: ' + res.statusCode);
    }   
  }); 

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
    context.fail(e.message);
  }); 

  const message = JSON.parse(sns.Message);

  var status = message.NewStateValue;
  if (status === "ALARM") {
    status = ":exclamation: " + status;
  } else if (status === "OK") {
    status = ":+1: " + status;
  }   
  var str = "*" +status +"*\n" +
    "Name: " + message.AlarmName + "\n" +
    "Description: " + message.AlarmDescription +"\n" +
    "Reason: " + message.NewStateReason;
  req.write(JSON.stringify({
    channel: slack_channel,
    text: str
  }));
  req.end();
}

exports.handler = function(event, context) {
  (event.Records || []).forEach(function (rec) {
    if (rec.Sns) {
      processSns(context, rec.Sns);
    }
  }); 
};
