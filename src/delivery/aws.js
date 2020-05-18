var AWS = require('aws-sdk');

module.exports.send = (from, to, subject, bodyHtml, bodyText) => {
    AWS.config.update({ region: 'sa-east-1' });

    return new Promise((resolve, reject) => {
        let ses = new aws.SES({ apiVersion: '2010-12-01' });

        let params = {
            Source: from,
            Destination: {
                ToAddresses: to,
            },
            Message: {
                Subject: {
                    Data: subject,
                },
                Body: {
                    Html: {
                        Data: bodyHtml,
                    },
                    Text: {
                        Data: bodyText,
                    },
                },
            },
        };

        ses.sendEmail(params, (error, data) => {
            console.log(error);
            error ? reject(error) : resolve(data);
        });
    });
};
