# lambda-notify-to-slack

AWS Lambda function to notify event to slack.

## How to setup
### Slack

- Setup incoming webhook
  - It provides API endpoint

### AWS

- Create topic in SNS
- Create function in Lambda
  - Runtime: Node 4.3
  - Code: [index.js](index.js)
  - Trigger: Above SNS topic
  - Env vars:
    - SLACK_URL: URL which generated in incoming webhook
    - SLACK_CHANNEL: Target slack channel (with #. e.g. `#watch-codeprep`)

And then create ALARM on CloudWatch(Notification sent to above SNS)
