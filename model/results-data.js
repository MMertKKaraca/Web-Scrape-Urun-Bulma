module.exports.searchItemsData = async function(req,res,str,page,sort,sortPriceValues){

    // Web Scraping için yüklenilen packet'lar
    const Cheerio = require("cheerio");

    const ejs = require("ejs");
    const fs = require('fs');

  
    // Web Scraping yapılcak olan sitelerin arama url'leri
    const AmazonSearchUrl = 'https://www.amazon.com.tr/s?k=';
    const HepsiBuradaSearchUrl = 'https://www.hepsiburada.com/ara?q=';
    const N11SearchUrl = 'https://www.n11.com/arama?q=';
    const TrendyolSearchUrl = 'https://www.trendyol.com/sr?q=';
  
    const SearchString = str;
  
    // Aranılan ürünün tutuldukları objeler
    const AmazonSearchItems = [];
    const HepsiBuradaSearchItems = [];
    const N11SearchItems = [];
    const TrendyolSearchItems = [];
  
    const UserAgent = {
      headers: {
        'User-Agent':req.headers['user-agent'],
        'X-Requested-With':'XMLHttpRequest'
        //'rejectUnauthorized': 'false',
        //'Accept-Encoding': 'application/json'
        //'Accept-Encoding': 'gzip'
      }
    };

    const UserAgentAmazon = {
      headers: {
        'User-Agent':req.headers['user-agent']
        //'X-Requested-With':'XMLHttpRequest'
        //'rejectUnauthorized': 'false',
        //'Accept-Encoding': 'application/json'
        //'Accept-Encoding': 'gzip'
      }
    };

    async function AmazonSearchResult(SearchString){
      let WebsiteUrl = 'https://www.amazon.com.tr';
  
      const reqOne  =  fetch(AmazonSearchUrl+SearchString,UserAgentAmazon).then((data)=>{return data.text()});
      const reqTwo  =  fetch(AmazonSearchUrl+SearchString+'&page=2',UserAgentAmazon).then((data)=>{return data.text()});
      const reqThree  =  fetch(AmazonSearchUrl+SearchString+'&page=3',UserAgentAmazon).then((data)=>{return data.text()});
      const reqFour  =  fetch(AmazonSearchUrl+SearchString+'&page=4',UserAgentAmazon).then((data)=>{return data.text()});
      const reqFive  =  fetch(AmazonSearchUrl+SearchString+'&page=5',UserAgentAmazon).then((data)=>{return data.text()});
      const reqSix  =  fetch(AmazonSearchUrl+SearchString+'&page=6',UserAgentAmazon).then((data)=>{return data.text()});
      const reqSeven  =  fetch(AmazonSearchUrl+SearchString+'&page=7',UserAgentAmazon).then((data)=>{return data.text()});
      return Promise
        .all([reqOne,reqTwo,reqThree,reqFour,reqFive,reqSix,reqSeven])
        .then((async function(...data){
          for(i=0;i<data[0].length;i++){
            let $ = Cheerio.load(data[0][i]);
            let itemUrl;
            let itemImage;
            let itemTitle;
            let itemPrice = 0;
            let itemPriceSymbol;
            let ScrapingClassName = '[data-component-type="s-search-result"]';
          
            $(ScrapingClassName).each(async(i,element)=>{
              if($(element).find($('[data-component-type="s-impression-logger"]'))==false){
                itemUrl = WebsiteUrl + $(element).find('h2 > a').attr('href');
                itemImage = $(element).find('img').attr('src');
                itemTitle = $(element).find('h2 > a > span').text();
                itemPrice = $(element).find('[class="a-offscreen"]').html();
                if(itemPrice!=null){
                  itemPrice = itemPrice.split('&nbsp;')
                  itemPriceSymbol = itemPrice[1];
                  itemPrice = itemPrice[0];
                }
                AmazonSearchItems.push({itemUrl,itemImage,itemTitle,itemPrice,itemPriceSymbol});
              }
            });
          }
        })).catch((error)=>{
          console.log("-------AMAZON--------");
          console.log(error);
          if(error.code == 'ECONNRESET'){
            AmazonSearchResult(SearchString);
          }
        });
    }
    
    async function HepsiBuradaSearchResult(SearchString){
      var HepsiBuradaBaseUrl="";
      var currentUrls=[];
      let WebsiteUrl = 'https://www.hepsiburada.com/';
      var c="";

      const reqOne  =  fetch(HepsiBuradaSearchUrl+SearchString,UserAgent).then((data)=>{currentUrls[0]=data.url;HepsiBuradaBaseUrl=data.url.toLocaleLowerCase();return data.text()});
      const reqTwo  =  fetch(HepsiBuradaSearchUrl+SearchString+'&sayfa=2',UserAgent).then((data)=>{currentUrls[1]=data.url;return data.text()});
      const reqThree  =  fetch(HepsiBuradaSearchUrl+SearchString+'&sayfa=3',UserAgent).then((data)=>{currentUrls[2]=data.url;return data.text()});
      const reqFour  =  fetch(HepsiBuradaSearchUrl+SearchString+'&sayfa=4',UserAgent).then((data)=>{currentUrls[3]=data.url;return data.text()});
      const reqFive  =  fetch(HepsiBuradaSearchUrl+SearchString+'&sayfa=5',UserAgent).then((data)=>{currentUrls[4]=data.url;return data.text()});
      const reqSix  =  fetch(HepsiBuradaSearchUrl+SearchString+'&sayfa=6',UserAgent).then((data)=>{currentUrls[5]=data.url;return data.text()});
      const reqSeven  =  fetch(HepsiBuradaSearchUrl+SearchString+'&sayfa=7',UserAgent).then((data)=>{currentUrls[6]=data.url;return data.text()});
      return Promise
        .all([reqOne,reqTwo,reqThree,reqFour,reqFive,reqSix,reqSeven])
        .then((async function(...data){
          for(i = 0 ;i<data[0].length;i++){
            if(i!=0){
              c = currentUrls[i];
            }
            if(c != HepsiBuradaBaseUrl){
              let $ = Cheerio.load(data[0][i]);
              let itemUrl;
              let itemImage;
              let itemTitle;
              let itemPrice;
              let itemPriceSymbol;
  
              let tempUrl;
              let noScriptTag;
              let newImgTag;
  
              let ScrapingClassName = '[class="productListContent-zAP0Y5msy8OHn5z7T_K_"]';
              $(ScrapingClassName).each(async(i,element)=>{
                try{
                  tempUrl = $(element).find('a').attr('href');
                  tempUrl  = new URL(tempUrl);
                  itemUrl = $(element).find('a').attr('href');
                }catch{
                  itemUrl = WebsiteUrl + $(element).find('a').attr('href');
                }

                noScriptTag = $(element).find('noscript').text();
                newImgTag = noScriptTag.split('src="');
                newImgTag = newImgTag[1].split('"/>');
                itemImage = newImgTag[0];

                itemTitle = $(element).find('h3').text();
                itemPrice = $(element).find('[data-test-id="price-current-price"]').text();
                if(itemPrice!=null){
                  itemPrice = itemPrice.split(' ')
                  itemPriceSymbol = itemPrice[1];
                  itemPrice = itemPrice[0];
                }
                HepsiBuradaSearchItems.push({itemUrl,itemImage,itemTitle,itemPrice,itemPriceSymbol});
              });
            }
          }
        })).catch((error)=>{
          console.log("-------HEPSIBURADA--------");
          console.log(error);
          if(error.code == 'ECONNRESET'){
            HepsiBuradaSearchResult(SearchString);
          }
        });
    }
  
    async function N11SearchResult(SearchString){
      const reqOne  =  fetch(N11SearchUrl+SearchString+"&pg=1",UserAgent).then((data)=>{return data.text()}); 
      const reqTwo  =   fetch(N11SearchUrl+SearchString+"&pg=2",UserAgent).then((data)=>{return data.text()});
      const reqThree  =  fetch(N11SearchUrl+SearchString+"&pg=3",UserAgent).then((data)=>{return data.text()});
      const reqFour  =   fetch(N11SearchUrl+SearchString+"&pg=4",UserAgent).then((data)=>{return data.text()});
      const reqFive  =   fetch(N11SearchUrl+SearchString+"&pg=5",UserAgent).then((data)=>{return data.text()});
      const reqSix  =   fetch(N11SearchUrl+SearchString+"&pg=6",UserAgent).then((data)=>{return data.text()});
      const reqSeven  =   fetch(N11SearchUrl+SearchString+"&pg=7",UserAgent).then((data)=>{return data.text()});
      return Promise
        .all([reqOne,reqTwo,reqThree,reqFour,reqFive,reqSix,reqSeven])
        .then((async function(...data){
          for(i = 0; i<data[0].length;i++){
            let $ = Cheerio.load(data[0][i]);
            let itemUrl;
            let itemImage;
            let itemTitle;
            let itemPrice;
            let itemPriceSymbol;
            let ScrapingClassName = '[class="columnContent"]';

            let notFound = $('[id="searchResultNotFound"]').html();
            if(notFound==null){
              $(ScrapingClassName).each(async(i,element)=>{
                itemUrl = $(element).find('a').attr('href');
                itemImage = $(element).find('img').attr('data-original');
                itemTitle = $(element).find('h3').html();
                itemPrice = $(element).find('span > ins').text();
                if(itemPrice!=null){
                  itemPrice = itemPrice.split(' ')
                  itemPriceSymbol = itemPrice[1];
                  itemPrice = itemPrice[0];
                }
                N11SearchItems.push({itemUrl,itemImage,itemTitle,itemPrice,itemPriceSymbol});
              })
            };
          }
        })).catch((error)=>{
          console.log("-------N11--------");
          console.log(error);
          if(error.code == 'ECONNRESET'){
            N11SearchResult(SearchString);
          }
        });
    }
  
    async function TrendyolSearchResult(SearchString){
      const reqOne  =  fetch(TrendyolSearchUrl+SearchString+"&pi=1",UserAgent).then((data)=>{return data.text()});
      const reqTwo  =  fetch(TrendyolSearchUrl+SearchString+"&pi=2",UserAgent).then((data)=>{return data.text()});
      const reqThree  =  fetch(TrendyolSearchUrl+SearchString+"&pi=3",UserAgent).then((data)=>{return data.text()});
      const reqFour  =  fetch(TrendyolSearchUrl+SearchString+"&pi=4",UserAgent).then((data)=>{return data.text()});
      const reqFive  =  fetch(TrendyolSearchUrl+SearchString+"&pi=5",UserAgent).then((data)=>{return data.text()});
      const reqSix  =  fetch(TrendyolSearchUrl+SearchString+"&pi=6",UserAgent).then((data)=>{return data.text()});
      const reqSeven  =  fetch(TrendyolSearchUrl+SearchString+"&pi=7",UserAgent).then((data)=>{return data.text()});
  
      return Promise
        .all([reqOne,reqTwo,reqThree,reqFour,reqFive,reqSix,reqSeven])
        .then((async function(...data){
          for(i= 0; i<data[0].length;i++){
            let $ = Cheerio.load(data[0][i]);
  
            let WebsiteUrl = 'https://www.trendyol.com';
            let imgUrl = 'https://cdn.dsmcdn.com/';
            let itemUrl;
            let itemImage;
            let itemTitle;
            let itemPrice;
            let itemPriceSymbol;
  
            var itemDatasText ="";
            var itemsArr = [];
            itemDatasText = $('[data-fragment-name="MarketingSearch"]').find('[type="application/javascript"]').first().text();
            itemDatasText = itemDatasText.split('window.__SEARCH_APP_INITIAL_STATE__=');
            itemDatasText = itemDatasText[1].split(';window.slpName=');
            itemsArr.push(JSON.parse(itemDatasText[0]));
      
            itemsArr[0].products.forEach((item)=>{
              itemUrl = WebsiteUrl + item.url;
              itemImage =imgUrl + item.images[0];
              itemTitle = item.imageAlt;
              itemPrice = item.price.discountedPrice.toFixed(2).split(".");
              if((itemPrice[0].length/3)>1 && itemPrice[0] != null){
                let nlength = itemPrice[0].length;
                let pos;
                for(d = 0; d<parseInt(nlength/3);d++){
                  switch(nlength%3){
                    case 0:{
                      if(d<parseInt(nlength/3)-1){
                        pos = 3 + d*4;
                        itemPrice[0] = itemPrice[0].substring(0, pos) + "." + itemPrice[0].substring(pos, itemPrice[0].length);
                      }
                      break;
                    }
                    case 1:{
                      pos = 1 + d*4;
                      itemPrice[0] = itemPrice[0].substring(0, pos) + "." + itemPrice[0].substring(pos, itemPrice[0].length);
                      break;
                    }
                    case 2:{
                      pos = 2 + d*4;
                      itemPrice[0] = itemPrice[0].substring(0, pos) + "." + itemPrice[0].substring(pos, itemPrice[0].length);
                      break;
                    }
                  }
                }
              }
              itemPrice = itemPrice[0]+ "," + itemPrice[1];
              itemPriceSymbol = itemsArr[0].configuration.currencySymbol;
              TrendyolSearchItems.push({itemUrl,itemImage,itemTitle,itemPrice,itemPriceSymbol});
            });
          }
        }))
        .catch((error)=>{
            console.log("--------TRENDYOL-------");
            console.log(error);
          if(error.code == 'ECONNRESET'){
            TrendyolSearchResult(SearchString);
          }
        });
    }

    // functions that compare price
    function min(a,b) {
      if(a.itemPrice != null && b.itemPrice !=null){
        if ( parseInt(a.itemPrice.replaceAll(".","")) < parseInt(b.itemPrice.replaceAll(".",""))){
          return -1;
        }
        if ( parseInt(a.itemPrice.replaceAll(".","")) > parseInt(b.itemPrice.replaceAll(".",""))){
          return 1;
        }
        return 0;
      }
      else{
        if(a.itemPrice == null && b.itemPrice !=null){
          if ( a.itemPrice < parseInt(b.itemPrice.replaceAll(".",""))){
            return -1;
          }
          if ( a.itemPrice > parseInt(b.itemPrice.replaceAll(".",""))){
            return 1;
          }
          return 0;
        }
        if(a.itemPrice != null && b.itemPrice ==null){
          if ( parseInt(a.itemPrice.replaceAll(".","")) < b.itemPrice){
            return -1;
          }
          if ( parseInt(a.itemPrice.replaceAll(".","")) > b.itemPrice){
            return 1;
          }
          return 0;
        }
        else{
          if (a.itemPrice < b.itemPrice){
            return -1;
          }
          if (a.itemPrice > b.itemPrice){
            return 1;
          }
          return 0;
        }
      }
    }

    function max(a,b) {
      if(a.itemPrice != null && b.itemPrice !=null){
        if ( parseInt(a.itemPrice.replaceAll(".","")) > parseInt(b.itemPrice.replaceAll(".",""))){
          return -1;
        }
        if ( parseInt(a.itemPrice.replaceAll(".","")) < parseInt(b.itemPrice.replaceAll(".",""))){
          return 1;
        }
        return 0;
      }
      else{
        if(a.itemPrice == null && b.itemPrice !=null){
          if ( a.itemPrice > parseInt(b.itemPrice.replaceAll(".",""))){
            return -1;
          }
          if ( a.itemPrice < parseInt(b.itemPrice.replaceAll(".",""))){
            return 1;
          }
          return 0;
        }
        if(a.itemPrice != null && b.itemPrice ==null){
          if ( parseInt(a.itemPrice.replaceAll(".","")) > b.itemPrice){
            return -1;
          }
          if ( parseInt(a.itemPrice.replaceAll(".","")) < b.itemPrice){
            return 1;
          }
          return 0;
        }
        else{
          if (a.itemPrice > b.itemPrice){
            return -1;
          }
          if (a.itemPrice < b.itemPrice){
            return 1;
          }
          return 0;
        }
      }
    }

    const arrayOfPromises = [
      AmazonSearchResult(SearchString),
      HepsiBuradaSearchResult(SearchString),
      N11SearchResult(SearchString),
      TrendyolSearchResult(SearchString)
    ];
    
    
    Promise.all(arrayOfPromises).then(()=>{
      console.log("amazon:"+AmazonSearchItems.length);
      console.log("hepsibuarada:"+HepsiBuradaSearchItems.length);
      console.log("n11:"+N11SearchItems.length);
      console.log("trendyol:"+TrendyolSearchItems.length);

      var child = [];
      child = child.concat(AmazonSearchItems,HepsiBuradaSearchItems,N11SearchItems,TrendyolSearchItems);
      console.log("items lenght:"+ child.length + " olması gereken sayfa sayısı:"+ (child.length/24));

     

      AmazonSearchItems.length = 0;
      HepsiBuradaSearchItems.length=0;
      N11SearchItems.length=0;
      TrendyolSearchItems.length=0;

      if(sortPriceValues != undefined){
        var z = [];
        sortPriceValues = sortPriceValues.split("-");
        var sortPriceMinValue = Number(sortPriceValues[0]);
        var sortPriceMaxValue = Number(sortPriceValues[1]);

        if(sortPriceMinValue<sortPriceMaxValue){
          child.forEach((item)=>{
            if(item.itemPrice != null){
              if((sortPriceMinValue<parseInt(item.itemPrice.replaceAll(".","")) && parseInt(item.itemPrice.replaceAll(".",""))<sortPriceMaxValue)){
                z.push(item);
              }
            }
          });
          child = z;
        }
      }
    
      switch(sort){
        case undefined: case'suggested':{
          break;
        }
        case 'min-price':{
          child.sort(min);
          break;
        }
        case 'max-price':{
          child.sort(max);
          break;
        }
      }

      const pageItemLimit=24;
      if(child.length==0){
        var mpn = 1;
      }
      else{
        var mpn = child.length/pageItemLimit;
        if(!Number.isInteger(mpn)){
          mpn = parseInt(++mpn);
        }
      }

      if(page==undefined | page==""){
        page=1;
      }

      const currentPage = page;
      const mPageNum = mpn;
      const startInd=parseInt(currentPage-1)*pageItemLimit;
      const endInd=parseInt(currentPage*pageItemLimit);
      child = child.slice(startInd,endInd);
      if(currentPage<=mPageNum){
        if(child != ""){
          res.writeHead(200, {
            'Content-Type': 'text/html'
          });
          var body = fs.readFileSync(process.cwd() + '/view/result.ejs','utf-8');
          res.end(ejs.render(body,{Items:child,maxPage:mPageNum}));
        }
        else{
          res.writeHead(200, {
            'Content-Type': 'text/html'
          });
          var body = fs.readFileSync(process.cwd() + '/view/result.ejs','utf-8');
          res.end(ejs.render(body,{errorMsg:"Ürün bulunamadı",maxPage:mPageNum}));
        }
      }
      else{
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });
        var body = fs.readFileSync(process.cwd() + '/view/result.ejs','utf-8');
        res.end(ejs.render(body,{errorMsg:"Ürün bulunamadı",maxPage:mPageNum}));
      }
      child.length = 0;
    })
  }