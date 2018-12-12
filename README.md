# Serverless Framework demo

Serverless Framework demo architecture using [Serverless.com framework](https://serverless.com/), [AWS Lambda](https://aws.amazon.com/lambda/), [DynamoDB](https://aws.amazon.com/dynamodb/), [Amazon Polly](https://aws.amazon.com/polly/), and [Amazon S3](https://aws.amazon.com/s3/)

![](https://raw.githubusercontent.com/jefp/serverless-demo/master/architecture.png)


## Getting started

1. clone project

```
git clone https://github.com/jefp/serverless-demo.git
```

2. cd into directory

```
cd serverless-demo
```

3. install serverless framework using npm

```
npm install serverless
```

4. install rvm and ruby 2.5.0 and required libs gems 

```
gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB

\curl -sSL https://get.rvm.io | bash

rvm install 2.5.0

rvm use 2.5.0 

rvm gemset create serverless-demo

rvm gemset use serverless-demo

gem install bundler
```

4. Install required libs gems 

```
bundle install --deployment
```

5. Update twilio credentials in serverless.yml file

```
      PHONE_NUMBER: $$PHONE_NUMBER$$
      TWILIO_ACCOUNT_SID: $$TWILIO_ACCOUNT_SID$$
      TWILIO_AUTH_TOKEN: $$TWILIO_AUTH_TOKEN$$
      TWILIO_FROM_NUMBER: $$TWILIO_FROM_NUMBER$$
```

6. Deploy serverless application

```
serverless deploy -s dev
```