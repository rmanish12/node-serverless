# Codingly.io: Base Serverless Framework Template

https://codingly.io

## What's included
* Folder structure used consistently across our projects.
* [serverless-pseudo-parameters plugin](https://www.npmjs.com/package/serverless-pseudo-parameters): Allows you to take advantage of CloudFormation Pseudo Parameters.
* [serverless-bundle plugin](https://www.npmjs.com/package/serverless-pseudo-parameters): Bundler based on the serverless-webpack plugin - requires zero configuration and fully compatible with ES6/ES7 features.

## Getting started
```
sls create --name YOUR_PROJECT_NAME --template-url https://github.com/codingly-io/sls-base
cd YOUR_PROJECT_NAME
npm install
```

## Deploying your app
* Whenever we change any configuration in ``` serverless.yml ```, we need to re-deploy our app. -v flag is for verbose. It provides useful logs in the console
```
sls deploy -v
```

## Deploying a particular function
* If there is a change in a particular function but the ``` serverless.yml ``` is not changed, we can deploy that function only.
```
sls deploy -f [FUNCTION_NAME] -v
```

You are ready to go!
