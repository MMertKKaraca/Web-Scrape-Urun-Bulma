
module.exports.registerDataCheck = ((userName,userPassword,res)=>{
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
            var page = fs.readFileSync(process.cwd() + '/view/register.ejs','utf-8');
            res.end(ejs.render(page,{error:'Database bağlanamıyor'}));
        }
        else{
            try{
                var request = new sql.Request();
                request.query(`select * from kullanicilar where kadi = '${userName}'`,((err,result)=>{ //COLLATE SQL_Latin1_General_CP1_CS_AS şifrede check login
                    console.log(result.recordset);
                    if(result.recordset.length>0){
                        console.log("oluşturma");
                        res.writeHead(200, {
                            'Content-Type': 'text/html'
                        });
                        var page = fs.readFileSync(process.cwd() + '/view/register.ejs','utf-8');
                        res.end(ejs.render(page,{error:'Böyle bir kullanıcı zaten var!'}));
                    }
                    else{
                        console.log("oluştur");
                        request.query(`insert into kullanicilar values('${userName}','${userPassword}')`);
                        res.writeHead(302,  {Location: "/login", 'Set-Cookie':['succsessfullyCreated = true;path=/login']})
                        res.end();
                    }
                }));
            }catch(err){
                console.log(err);
            }
        }
    })
});



    



    
    

