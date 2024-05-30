const express = require('express');
const taskController = require('./controllers/taskController.js');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const HttpStatusCode = require('./utils/httpStatusCode.js');
const AppError=require('./utils/appError.js')
const globalErrorHandler=require('./utils/globalErrorHandler.js')
const morgan=require('morgan')

dotenv.config({
    path: './.env'
});

const app = express();

app.use(morgan('dev'))

app.use(express.json());

//custom middleware
app.use((req,res,next)=>{
  req.requestTime=new Date().toISOString()
  console.log('hello from middle ware ',req.requestTime);
  next();
})


app.get('/', (req, res) => {
    res.send('Hello world!');
});
app.get('/api/v1/tasks', taskController.getAllTasks);
app.get('/api/v1/tasks/:id', taskController.getTask);
app.post('/api/v1/tasks', taskController.createTask);
app.patch('/api/v1/tasks/:id', taskController.patchTask);
app.put('/api/v1/tasks', taskController.putTask);
app.delete('/api/v1/tasks/:id', taskController.deleteTask);

app.all('*',(req,res,next)=>{
    // res.status(HttpStatusCode.NOT_FOUND).json({
    //     status:'fail',
    //     message:`Can't find ${req.originalUrl} on this server`
    // })
    // const err=new Error(`Can't find ${req.originalUrl} on this server`)
    // err.statusCode=HttpStatusCode.NOT_FOUND
    // err.status='fail'
    const err=new AppError(`Can't find ${req.originalUrl} on this server`,HttpStatusCode.NOT_FOUND)
    next(err)

})

app.use(
    globalErrorHandler
)

// Debugging statements
console.log('MONGO_DB_CONNECTION:', process.env.MONGO_DB_CONNECTION);
console.log('MONGO_DB_PASSWORD:', process.env.MONGO_DB_PASSWORD);

// Setup the DB connection string
const DB = process.env.MONGO_DB_CONNECTION.replace('<password>', process.env.MONGO_DB_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('DB connection successful!'))
.catch(err => console.log('DB connection error:', err));

app.listen(3000, () => {
    console.log('Server is running on port 3000...');
});
