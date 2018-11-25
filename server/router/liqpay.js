// Listen to incoming HTTP requests (can only be used on the server).g HTTP requests (can only be used on the 
WebApp.connectHandlers.use('/liqpay', (req, res, next) => {
  console.log(req);
  let { data, signature } = req.query;
  console.log(data, signature);

  res.end();
});