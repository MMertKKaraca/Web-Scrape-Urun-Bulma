module.exports.get = function(req,res){
  const ejs = require("ejs");
  const fs = require('fs');
  const url = require('url');
  const resultData = require('../model/results-data');


  const queryObject = url.parse(req.url, true).query;
  //console.log(queryObject);
  var searchText = queryObject.searchItem;
  var page = queryObject.page;
  var sort = queryObject.sort;
  var sortPriceValues = queryObject.sortPriceValues;

  if(searchText != "" && searchText !=undefined){
    if(page != undefined){
      if(page<=1 | isNaN(Number(page))){
        res.writeHead(302,  {Location: req.url.replace(`&page=${page}`,"")})
        res.end();
      }
      else{
        resultData.searchItemsData(req,res,searchText,page,sort,sortPriceValues);
      }
    }
    else{
      resultData.searchItemsData(req,res,searchText,page,sort,sortPriceValues);
    }
  }
  else{
    res.writeHead(302,  {Location: "/"})
    res.end();
  }  
}


