import json
import boto3
import os
from contextlib import closing
from tempfile import gettempdir
import datetime as dt
from dateutil.tz import gettz

dynamodb = boto3.resource('dynamodb')

def ssml(device,severity):
    return "<speak>New "+severity+"  alarm on device"+ device +"</speak>"


def handler(event, context):
  for i in range(len(event['Records'])):
      message = event['Records'][i]['Sns']['Message']
      messageID = event['Records'][i]['Sns']['MessageId']
      polly = boto3.client('polly')
      s3 = boto3.client('s3')
      print(json.loads(message)['device'])
      response = polly.synthesize_speech(
        OutputFormat='mp3',
        Text = ssml(json.loads(message)['device'],json.loads(message)['severity']),
        VoiceId = 'Joanna',
        TextType='ssml'
      )

      if "AudioStream" in response:
          with closing(response["AudioStream"]) as stream:
              output = os.path.join(gettempdir(), messageID )
              try:
                  with open(output, "wb") as file:
                      file.write(stream.read())
              except IOError as error:
                  print(error)
                  sys.exit(-1)
      table = dynamodb.Table(os.environ['DYNAMO_TABLE'])
      table.update_item(
            Key={'MessageId': messageID},
            UpdateExpression="set VoiceAlarmCreatedAt = :val",
            ExpressionAttributeValues={
                ':val': str(dt.datetime.now())
            }
        )

      s3.upload_file('/tmp/' + messageID, os.environ['S3'], messageID + ".mp3")

  return
