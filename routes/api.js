/*
*
*
*       Complete the API routing below
*
*
*/


'use strict';

var expect = require('chai').expect;
var Stock=require('../routes/issue.js');
var request=require('request');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      var stock=req.query.stock;
      var likes=req.query.like ;
      if(stock){
        if(Array.isArray(stock)){
          if(stock.length==2){
           var stockOne =stock[0].toUpperCase();
           var stockTwo=stock[1].toUpperCase();
           if(stockOne=='GOOG'||stockOne=='MSFT' && stockTwo=='GOOG'||stockTwo=='MSFT'){
             request({
               method:'GET',
               url:`https://api.iextrading.com/1.0/stock/${stock[0]}/price`
             },function(err,resp,body1){
               request({
                 method:'GET',
                 url:`https://api.iextrading.com/1.0/stock/${stock[1]}/price`
               },function(err,response,body2){
                 Stock.findOne({stock:stockOne},(err,data)=>{
                   if(err){console.log(err)}
                   else{
                     Stock.findOne({stock:stockTwo},(err,doc)=>{
                       if(err){console.log(err)}
                       else{
                         if(data==null){
                          var like;
                          if(likes){like=1}else{like=0}
                          var schemaOne=new Stock({stock:stockOne,price:body1,likes:like})
                          schemaOne.save((err,done)=>err?err:done)
                         }
                         if(doc==null){
                          var like;
                          if(likes){like=1}else{like=0}
                          var schemaTwo=new Stock({stock:stockTwo,price:body2,likes:like})
                          schemaTwo.save((err,done)=>err?err:done)
                         }
                         if(data!==null){
                           if(likes){data.likes=1}
                           data.price=body1
                           data.save((err,done)=>err?err:done)
                         }
                         if(doc!==null){
                           if(likes){doc.likes=1}
                           doc.price=body2;
                           doc.save((err,done)=>err?err:done)
                         }
                        var onerel,tworel
                        if(likes){
                          onerel=0;
                          tworel=0
                        }else{
                          onerel=data.likes-doc.likes;
                          tworel=doc.likes-data.likes
                        }
                        
                        res.json({stockData:[{stock:stockOne,price:body1,rel_likes:onerel},{stock:stockTwo,price:body2,rel_likes:tworel}]})
                       }
                     })

                     }
                   })
                 
              }
          )}
        )}}}
        else {
          var stockOne=stock.toUpperCase();
          if(stockOne=='GOOG'||stockOne=='MSFT'){
            request({
              method:'GET',
              url:`https://api.iextrading.com/1.0/stock/${stock}/price`
            },function(err,resp,body){
              Stock.findOne({stock:stockOne},(err,data)=>{
                 if(err){res.send(err)}
                 else{
                   if(data==null){
                     var like;
                     if(likes){
                       like=1
                     }else{like=0}
                     var schema=new Stock({stock:stockOne,price:body,likes:like})
                     schema.save((err,doc)=>{
                       if(err){console.log(err)}
                       else{res.json({stockData:{stock:doc.stock,price:doc.price,likes:doc.likes}})}
                     })
                   }else{
                     if(likes){data.likes=1};
                     data.price=body;
                     data.save((err,doc)=>{
                       if(err){console.log(err)}
                       else{res.json({stockData:{stock:doc.stock,price:doc.price,likes:doc.likes}})}
                     })
                   }
                 }
              })
            })
          }
        }
      }
      
    });
    
};
