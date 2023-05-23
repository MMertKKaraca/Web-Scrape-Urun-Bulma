module.exports = {
    set:function(res,item,userId){
        const sql = require('mssql/msnodesqlv8');
    
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
            }
            else{
                try{
                    var request = new sql.Request();
                    request.query(`insert into liste values(${userId},'${item[0].itemUrl}','${item[0].itemImage}','${item[0].itemTitle}','${item[0].itemPrice}',GETDATE())`,((err,result)=>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            if(result){
                                //console.log(result);
                            }
                        }
                    }));
                }
                catch(err){
                    console.log(err);
                }
            }
        })
    },
    delete:function(res,item,userId){
        const sql = require('mssql/msnodesqlv8');

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
            }
            else{
                try{
                    var request = new sql.Request();
                    request.query(`delete from liste where kid = ${userId} and itemUrl = '${item[0].itemUrl}' and itemImage = '${item[0].itemImage}' and itemTitle = '${item[0].itemTitle}' and itemPrice = '${item[0].itemPrice}'`,((err,result)=>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            if(result){
                                //console.log(result);
                            }
                        }
                    }));
                }
                catch(err){
                    console.log(err);
                }
            }
        })
    },
    get:function(res,userId){
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
            }
            else{
                try{
                    var request = new sql.Request();
                    request.query(`select * from liste where kid=${userId} order by dates DESC`,((err,result)=>{
                        if(err){
                            console.log(err);
                        }
                        if(result.recordset.length>0){
                            res.writeHead(200, {
                                'Content-Type': 'text/html'
                            });
                            var page = fs.readFileSync(process.cwd() + '/view/item-list.ejs','utf-8');
                            res.end(ejs.render(page,{Items:result.recordset}));
                        }
                        else{
                            res.writeHead(200, {
                                    'Content-Type': 'text/html'
                            });
                            var page = fs.readFileSync(process.cwd() + '/view/item-list.ejs','utf-8');
                            res.end(ejs.render(page,{errorMsg:'Listede Ürün Yok'}));
                        }
                    }));
                }
                catch(err){
                    console.log(err);
                }
            }
        })
    }
}
