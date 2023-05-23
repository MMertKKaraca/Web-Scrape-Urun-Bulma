module.exports.loginDataCheck = ((userName,userPassword,res)=>{
    const sql = require('mssql/msnodesqlv8');
    const ejs = require("ejs");
    const fs = require('fs');

    const sqlConfig = {
        database: 'WebScrape',
        server: 'DESKTOP-5SIE434\\SQLEXPRESS',
        options: {
            trustedConnection: true,
        }
    };

    sql.connect(sqlConfig,(error)=>{
        if(error){
            console.log(error);
            var page = fs.readFileSync(process.cwd() + '/view/login.ejs','utf-8');
            res.end(ejs.render(page,{error:'Database bağlanamıyor'}));
        }
        else{
            try{
                var request = new sql.Request();
                request.query(`select * from kullanicilar where kadi COLLATE SQL_Latin1_General_CP1_CS_AS = '${userName}' and ksifre COLLATE SQL_Latin1_General_CP1_CS_AS = '${userPassword}'`,((err,result)=>{
                    if(err){
                        console.log(err);
                    }
                    //console.log(result.recordset);
                    /*console.log(result.recordset[0].kid);*/
                    if(result.recordset.length>0){
                        console.log("giris yap");
                        res.writeHead(302,  {Location: "/search", 'Set-Cookie':[`userId = ${result.recordset[0].kid}`,`userName = ${result.recordset[0].kadi}`,'loginCheck = true']})
                        res.end();
                    }
                    else{
                        console.log("giris yapma");
                        res.writeHead(200, {
                                'Content-Type': 'text/html'
                        });
                        var page = fs.readFileSync(process.cwd() + '/view/login.ejs','utf-8');
                        res.end(ejs.render(page,{error:'Yanlış Kullanıcı Adı/Şifre!'}));
                    }
                }));
            }catch(err){
                console.log(err);
            }
        }
    })
});


