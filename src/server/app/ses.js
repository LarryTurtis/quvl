// load aws sdk
import aws from 'aws-sdk';

// note that these keys are for sandbox usage only.
// product will require a dedicated email address and keys
const configFile = `${__dirname}/awsConfig.json`;
aws.config.loadFromPath(configFile);
const ses = new aws.SES({ apiVersion: '2010-12-01' });

export default ses;
