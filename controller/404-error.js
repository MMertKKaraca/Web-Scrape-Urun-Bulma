module.exports.get = function(req,res){
    const ejs = require("ejs");
    const fs = require('fs');

    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    var page = fs.readFileSync(process.cwd() + '/view/404-error.ejs','utf-8');
    res.end(ejs.render(page));

}