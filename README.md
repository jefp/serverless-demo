# Serverless Framework demo

Serverless Framework demo architecture using [Serverless.com framework](https://Serverless.com/), [AWS AppSync](https://aws.amazon.com/appsync/), and [Vue Apollo](https://github.com/Akryum/vue-apollo)

![](https://i.imgur.com/9TdyOOi.jpg)


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

5. Deploy serverless application

```
serverless deploy -s dev
```