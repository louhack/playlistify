const ScriptService = require('../services/script.service');

// const { startScheduledTask, stopScheduledTask, getTaskStatus } = scriptService;

function startScheduledTask(req, res) {
    // console.log(req);
    const scriptName = req.body.scriptname;
    console.log('taskName', scriptName);
    if (!ScriptService.tasks[scriptName]) {
        console.log('starting task');
        ScriptService.startScheduledTask(scriptName);
         // Return the user with the appropriate HTTP Status Code and Message.
        return res.status(200).json({status: 200, message: `Scheduled task ${scriptName} started`});
    } else {
        return res.status(304).json({status: 304, message:`Task ${scriptName} is already running`});
    }
};

function stopScheduledTask(req, res) {
    const scriptName = req.body.scriptname;
    const stopResult = ScriptService.stopScheduledTask(scriptName);
    res.send({stopResult});
};

function getTaskStatus(req, res) {
    const scriptName = req.query.scriptname;
    const status = ScriptService.getTaskStatus(scriptName);
    res.send({status});
};

module.exports = {
    startScheduledTask,
    stopScheduledTask,
    getTaskStatus,
};
