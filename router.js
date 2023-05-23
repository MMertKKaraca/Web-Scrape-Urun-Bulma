var url = require('url');
var fs = require('fs');

module.exports.get = function(req, res) {
  req.requrl = url.parse(req.url, true);
  var path = req.requrl.pathname;
  if (/.(css)$/.test(path)) {
    res.writeHead(200, {
      'Content-Type': 'text/css'
    });
    fs.readFile(__dirname + path, 'utf8', function(err, data) {
      if (err) throw err;
      res.write(data, 'utf8');
      res.end();
    });
  } else {
    switch(path){
      case '/': case '/search':{require('./controller/search.js').get(req, res);break;};
      case '/login':{require('./controller/login.js').get(req, res);break;};
      case '/register':{require('./controller/register.js').get(req, res);break;};
      case '/result':{require('./controller/result.js').get(req, res);break;};
      case '/list':{require('./controller/item-list.js').get(req, res);break;};
      default : {require('./controller/404-error.js').get(req, res);break;};
    }    
  }
}; 