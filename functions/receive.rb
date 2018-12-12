require 'json'
require 'aws-sdk'

def handler(event:, context:)
  begin
    puts(event.to_s)


    client_sns = Aws::SNS::Client.new()
    device = JSON.parse(event['body'])['device']
    severity = JSON.parse(event['body'])['severity']
    
    sns = client_sns.publish({
     topic_arn: ENV['SNS'],
     message: { "device": device, "severity": severity}.to_json
    })
    
    dynamodb = Aws::DynamoDB::Client.new
    result = dynamodb.put_item({
      table_name: ENV['DYNAMO_TABLE'],
      item: {
        MessageId: sns.message_id,
        ReceivedAt: DateTime.now.to_s,
        Device: device,
        Severity: severity
      }
    })

   return {statusCode: 200, body: JSON.generate(sns.message_id)}
  rescue Exception => e
    return { statusCode: 500, body: JSON.generate(e.to_s) }
  end
end
