const path = require('path');
const express = require('express');
const morgan = require('morgan');
const app = express();
const Bull = require('bull');
const myFirstQueue = new Bull('my-first-queue', 'redis://127.0.0.1:6379');
const mySecondQueue = new Bull('my-second-queue', 'redis://127.0.0.1:6379');
const ipFilter = require('../node_modules/express-ipfilter/lib/ipfilter');
const endPoint = require('./queue-second');
const service = require('./service');
//const awsDelivery = require('./delivery/aws');

const indexRoutes = require('./routes/index');
const ips = ['::ffff:127.0.0.1', '::1'];

app.set('port', process.env.PORT || 3000);

// let sendEmail = (email, subject, bodyHtml, bodyText) => {
//   return awsDelivery.send(process.env.AWS_FROM_EMAIL, email, subject, bodyHtml, bodyText);
// }

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(ipFilter(ips, { mode: 'allow' }));

app.use('/', indexRoutes);

myFirstQueue.process(async (job, done) => {
    //await sendEmail(email, subject, body_html, job.data.content)
    await console.log(job.data, 'respuesta de aws');
    done(endPoint.end(job.data));
});
mySecondQueue.process(async (job, done) => {
    done(service.externo(job.data));
});
app.listen(app.get('port'), () => {
    console.log(`servidor en puerto ${app.get('port')}`);
});
module.exports = app;
