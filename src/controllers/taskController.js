// controllers/taskController.js
const httpStatusCode = require('../utils/httpStatusCode.js');
const Task=require('../models/taskModel.js');
const { default: mongoose } = require('mongoose');
const HttpStatusCode = require('../utils/httpStatusCode.js');
const AppError = require('../utils/appError.js');
const catchAsync=require('../utils/catchAsync.js')
const tasks = [
    { id: 1, text: 'Doctor appointment', day: 'Feb 5th 2:20am', remainder: true },
    { id: 2, text: 'Doctor appointment', day: 'Feb 6th 2:20am', remainder: false },
    { id: 3, text: 'Doctor appointment', day: 'Feb 7th 2:20am', remainder: true }
];

const getAllTasks = async(req, res) => {
    // res.status(httpStatusCode.OK).json({
    //     status: 'success',
    //     results: tasks.length,
    //     data: {
    //         tasks: tasks
    //     }
    // });
    try{
   const query= Task.find({})
   const result=await query.select('-__v')
    res.status(httpStatusCode.OK).json({
        status: 'success',
        results: result.length,
        data: {
            tasks: result
        }
    });
}catch(e){
    res.status(HttpStatusCode.NOT_FOUND).json({
        status:'fail',
        message:e,

    })
}
};

const getTask = catchAsync( async (req, res,next) => {

   const taskId=req.params.id;
   const query= Task.findById(taskId)
   const result=await query.select('-__v')
    if (query) {
        res.status(httpStatusCode.OK).json({
            status: 'success',
            data: { 
                result ,
                requestTime:req.requestTime

            }
        });
    } else {
        res.status(httpStatusCode.NOT_FOUND).json({
            status: 'fail',
            message: 'Task not found'
        });
    }
})

const createTask =async (req, res) => {
    // const newId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    // const newTask = { id: newId, ...req.body };

    // tasks.push(newTask);
    // res.status(httpStatusCode.CREATED).json({
    //     status: 'success',
    //     results: tasks.length,
    //     data: { task: newTask }
    // });

try{
    const correctedDay = req.body.day.replace(/,/, '.');

    const newTask = await Task.create({
        text: req.body.text,
        day: correctedDay,
        remainder: req.body.remainder
    });
    res.status(httpStatusCode.CREATED).json({
        status: 'success',
        data: { task: newTask }
    });
}catch(e){
    res.status(HttpStatusCode.BAD_REQUEST).json({
        status:'fail',
        message:e,

    })
}

};

const patchTask =async (req, res) => {
try{
    const taskId = req.params.id;
   const task=await Task.findOneAndUpdate(taskId,req.body,{new:true})
        res.status(httpStatusCode.OK).json({
            status: 'success',
            data: { task }
        });
    }catch(e){
        res.status(HttpStatusCode.NOT_FOUND).json({
            status:'fail',
            message:e,
    
        })
    }
    // const id = parseInt(req.params.id, 10);
    // const task = tasks.find(t => t.id === id);

    // if (task) {
    //     Object.assign(task, req.body);
    //     res.status(httpStatusCode.OK).json({
    //         status: 'success',
    //         data: { task }
    //     });
    // } else {
    //     res.status(httpStatusCode.NOT_FOUND).json({
    //         status: 'fail',
    //         message: 'Task not found'
    //     });
    // }
};

const putTask = (req, res) => {
    try{
    const body = req.body;
    const task = tasks.find(t => t.id == body.id);

    if (task) {
        Object.assign(task, body);
        res.status(httpStatusCode.OK).json({
            status: 'success',
            data: { task }
        });
    } else {
        const newId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
        const newTask = { id: newId, ...body };

        tasks.push(newTask);
        res.status(httpStatusCode.CREATED).json({
            status: 'success',
            results: tasks.length,
            data: { task: newTask }
        });
    }
}catch(e){
    res.status(HttpStatusCode.NOT_FOUND).json({
        status:'fail',
        message:e,
    })
}
};

const deleteTask = async(req, res) => {
try{
  const id=req.params.id
  const task=await Task.findByIdAndDelete(id)

        res.status(httpStatusCode.NO_CONTENT).json({
            status: 'success',
            data: task
        });

    }catch(e){
        res.status(HttpStatusCode.NOT_FOUND).json({
            status:'fail',
            message:e,
        })
    }
    // const id = parseInt(req.params.id, 10);
    // const index = tasks.findIndex(t => t.id === id);

    // if (index !== -1) {
    //     tasks.splice(index, 1);
    //     res.status(httpStatusCode.NO_CONTENT).json({
    //         status: 'success',
    //         data: null
    //     });
    // } else {
    //     res.status(httpStatusCode.NOT_FOUND).json({
    //         status: 'fail',
    //         message: 'Task not found'
    //     });
    // }
};

module.exports = {
    getAllTasks,
    getTask,
    createTask,
    patchTask,
    putTask,
    deleteTask
};
