const ScriptService = require('../services/script.service');

// const { startScheduledTask, stopScheduledTask, getTaskStatus } = scriptService;

function startScheduledTask(req, res) {
    // console.log(req);
    const scriptName = req.body.scriptname;
    let args = req.body.args;
    // console.log('scriptname', scriptName);
    // console.log('args', args);
    // console.log(req);
    const taskName = req.params.taskName;
    if (!ScriptService.tasks[taskName]) {
        console.log('starting task');
        ScriptService.startScheduledTask(taskName, scriptName, args);
         // Return the user with the appropriate HTTP Status Code and Message.
        return res.status(200).json({status: 200, message: `Scheduled task ${taskName} started`});
    } else {
        return res.status(304).json({status: 304, message:`Task ${taskName} is already running`});
    }
};

function stopScheduledTask(req, res) {
    const scriptName = req.body.scriptname;
    const taskName = req.params.taskName;
    const stopResult = ScriptService.stopScheduledTask(taskName);
    res.send({stopResult});
};

function getTaskStatus(req, res) {
    const scriptName = req.query.scriptname;
    const taskName = req.params.taskName || scriptName;
    const status = ScriptService.getTaskStatus(taskName);
    res.send({status});
};

module.exports = {
    startScheduledTask,
    stopScheduledTask,
    getTaskStatus,
};
