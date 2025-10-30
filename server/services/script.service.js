const cron = require('node-cron');
const { PythonShell } = require('python-shell');
const path = require('path');

const tasks = {}; // Object to store tasks

function startScheduledTask(taskName, scriptName, args) {
    // Run the task immediately
    console.log(`Executing ${taskName} for the first time...`);
    runTask(scriptName, args);

    // Schedule the task to run every 24 hours
    tasks[taskName] = cron.schedule('0 0 */24 * * *', () => {
        console.log(`Executing ${taskName}...`);
        runTask(scriptName, args);
    });
}

function runTask(scriptName, ...args) {
    const directoryPath = path.join(__dirname, '../../scripts/'); // Replace 'your_directory' with your desired directory name
    const scriptPath = path.join(directoryPath, `${scriptName}`);
    console.log('scriptPath', scriptPath);

    // Split the scriptPath into the actual path and the argument
    const [actualScriptPath, arg] = scriptPath.split(' ');

    const options = {
        mode: 'text',
        pythonOptions: ['-u'], // unbuffered output, helps in getting logs in real-time
        args: [arg],
    };

    const pyShell = new PythonShell(actualScriptPath, options);

    pyShell.on('message', function (message) {
        console.log(`Message from Python: ${message}`);
    });

    pyShell.on('error', function (error) {
        console.error(`Error in ${scriptName}:`, error);
    });

    pyShell.end(function (err, code, signal) {
        if (err) {
            console.error(`Error executing ${scriptName}:`, err);
        } else {
            console.log(`${scriptName} executed successfully`);
        }
    });
    // PythonShell.run(scriptPath, options, function (err, result) {
    //     if (err) {
    //         console.error(`Error in ${taskName}:`, err);
    //     } else {
    //         console.log(`${taskName} executed successfully:`, result);
    //     }
    // });
}

function stopScheduledTask(taskName) {
    if (tasks[taskName]) {
        tasks[taskName].stop();
        delete tasks[taskName];
        console.log(`Scheduled task ${taskName} stopped`);
        return `Scheduled task ${taskName} stopped`;
    } else {
        console.log(`No task ${taskName} is currently running`);
        return `No task ${taskName} is currently running`;
    }
}

function getTaskStatus(taskName) {
    if (tasks[taskName] && !tasks[taskName].stopped) {
        return `Running`;
    } else {
        return `Stopped`;
    }
}

module.exports = {
    tasks,
    startScheduledTask,
    stopScheduledTask,
    getTaskStatus,
};
