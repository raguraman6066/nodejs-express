const HttpStatusCode = require('./httpStatusCode');

const sendErrorDev=(err,req,res)=>{
    err.statusCode=err.statusCode||HttpStatusCode.INTERNAL_SERVER_ERROR
    err.status=err.status||'error'

    res.status(err.statusCode).json({
      status:err.status,
      message:err.message,
      error:err,
      stackTrack:err.stack
    })
}

const globalErrorHandler=(err,req,res,next)=>{
    if(process.env.NODE_ENV=='development'){
   sendErrorDev(err,req,res)
}else if(process.env.NODE_ENV=='production'){
        err.statusCode=err.statusCode||HttpStatusCode.INTERNAL_SERVER_ERROR
        err.status=err.status||'error'
        res.status(err.statusCode).json({
          status:err.status,
          message:err.message
        })
    }else{
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message
          })
    }
}

module.exports=globalErrorHandler