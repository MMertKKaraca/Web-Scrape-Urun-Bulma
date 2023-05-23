module.exports.get = function(req,res){
    const itemList = require('../model/item-list-data');
    const ejs = require("ejs");
    const fs = require('fs');

    if(req.method === "POST"){

        const bodyParse = [];
        req.on("data",(data)=>{
            bodyParse.push(data);
        })

        req.on("end",()=>{
            const bodyParseBuffer = Buffer.concat(bodyParse);
            const stringData = bodyParseBuffer.toString();

            const item = [];
            item.push(JSON.parse(stringData));

            const cookies = req.headers.cookie;
            if(cookies != undefined){
                var cookiesArray = cookies.replace(/=/g,":").split("; ");
                var cookiesObj = {};
                cookiesArray.forEach((element)=>{
                    var cstr = element.split(":");
                    cookiesObj[cstr[0]]=cstr[1];
                });
            }

            if(req.headers['set-item']){
                delete req.headers['set-item'];

                const userId = cookiesObj.userId;
                itemList.set(res,item,userId);
            }
            else{
                if(req.headers['delete-item']){
                    delete req.headers['delete-item'];

                    const userId = cookiesObj.userId;
                    itemList.delete(res,item,userId);
                }
            }
            res.end();
        })
    }
    else{
        const cookies = req.headers.cookie;
        if(cookies != undefined){
            var cookiesArray = cookies.replace(/=/g,":").split("; ");
            var cookiesObj = {};
            cookiesArray.forEach((element)=>{
                var cstr = element.split(":");
                cookiesObj[cstr[0]]=cstr[1];
            });
            const userId = cookiesObj.userId;
            itemList.get(res,userId);
        }
        else{
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            var page = fs.readFileSync(process.cwd() + '/view/item-list.ejs','utf-8');
            res.end(ejs.render(page,{errorMsg:'Listeni Görmek İçin Giriş Yap'}));
        }
    }
}