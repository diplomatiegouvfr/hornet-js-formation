var http = require("http");

// http://rundeck.org/2.6.9/api/index.html#running-a-job
// https://stackoverflow.com/questions/35453726/trigger-rundeck-job-via-api
const USAGE = "Usage: node trigger-rundeck.js RUNDECK_HOST RUNDECK_JOB_ID RUNDECK_TOKEN RUNDECK_APP_VERSION";

/*
 * Le temps d'attente initial est assez bas pour détecter rapidement les erreurs.
 */
const INITIAL_WAIT = 15; // secondes
const SUB_WAIT = 5; // secondes
const SUB_WAIT_COUNT = 30;

var host, jobId, token, version;

if (process.argv.length !== 6) {
    console.error("Illegal number of parameters");
    console.error(USAGE);
    process.exit(1);
} else {
    host = process.argv[2];
    jobId = process.argv[3];
    token = process.argv[4];
    version = process.argv[5];
}

function trigger(resolve, reject) {
    console.log("Trigger deployment");
    const OPTIONS = {
        host: host,
        port: 80,
        path: '/api/17/job/' + jobId + '/executions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Rundeck-Auth-Token': token
        }
    };
    const body = {
        "argString": "-PROJECT_VERSION " + version + " -APPLICATION_VERSION " + version + " -MODULE_VERSION " + version
    };

    var req = http.request(OPTIONS, function (res) {
        res.on('data', resolve);
    });
    req.write(JSON.stringify(body));
    req.end();
    req.on('error', reject);
}

/**
 * Equivalent : curl -s -H "X-Rundeck-Auth-Token: RUNDECK_TOKEN" RUNDECK_API/execution/$1/state
 * @param id
 * @param resolve
 * @param reject
 */
function status(id, resolve, reject) {
    const OPTIONS = {
        host: host,
        port: 80,
        path: '/api/17/execution/' + id + '/state',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'X-Rundeck-Auth-Token': token
        }
    };

    var dataChunks = [];
    var req = http.request(OPTIONS, function (res) {
        res.on('data', function (data) {
            //stockage de la réponse au fur et à mesure qu'elle nous parvient
            dataChunks.push(data);
        });
        res.on('end', function () {
            var response = JSON.parse(dataChunks.join(""));
            console.log("completed:", response.completed);
            console.log("executionState:", response.executionState);
            resolve(response.completed ? response.executionState : false);
        });
    });
    req.end();
    req.on('error', reject);
}

function waitForEnd(id, countdown) {
    if (countdown) {
        console.log("Waits for deployment to finsih");
        status(id, function (completed) {
            console.log("Status is:", completed);
            if (completed) {
                if (completed === "SUCCEEDED") {
                    console.log("Done.");
                    process.exit(0); // Done
                } else {
                    console.error("Deployment failed!");
                    process.exit(1); // Echéc
                }
            } else {
                setTimeout(waitForEnd, SUB_WAIT * 1000, id, countdown - 1);
            }
        }, function (error) {
            console.error("An error occurs: ", error);
            process.exit(1);
        });
    } else {
        console.error("Application was not deployed within timeout.");
        process.exit(1);
    }
}

function main() {
    trigger(function (data) {
        var id = JSON.parse(data).id;
        console.log("Deployment launched with id:", id);
        console.log("Waits for", INITIAL_WAIT, "seconds");
        setTimeout(waitForEnd, INITIAL_WAIT * 1000, id, SUB_WAIT_COUNT);
    }, function (error) {
        console.error("An error occurs: ", error);
        process.exit(1);
    })
}

main();

