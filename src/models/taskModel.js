const mongoose=require('mongoose')

const taskSchema=new mongoose.Schema({
   text:{
    type:String,
    require:[true,'Please add a text value'],
    unique:true
   },
   day:{
    type:Date,
    default:Date.now,
   },
   reminder:{
    type:Boolean,
    require:[true,'Please add a remainder value']
   },

},{  timestamps:true})

const Task=mongoose.model('Task',taskSchema)
module.exports=Task