const mongoose=require('mongoose');
mongoose.connect(process.env.DB,{useNewUrlParser:true,useFindAndModify:false})
const Schema=mongoose.Schema;
const stockSchema=new Schema({stock:String,price:String,likes:Number})
const Stock=mongoose.model('stock',stockSchema)

module.exports=Stock;
