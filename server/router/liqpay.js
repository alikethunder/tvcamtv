import {Payments} from '../collections/Payments'

// Listen to incoming HTTP requests (can only be used on the server).g HTTP requests (can only be used on the 
//success statuses = ['wait_accept', 'success'];
WebApp.connectHandlers.use('/liqpay', (req, res, next) => {

  console.log(req);
  let { data, signature } = req.query;
  console.log(data, signature);

  res.end();
});