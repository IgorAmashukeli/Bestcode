import express from 'express';
import cors from 'cors';
import Docker from 'dockerode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import { uri } from './../../uri.js';

const docker = new Docker();

// Получение текущей директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const volumePath = __dirname;
const containerPath = '/data';

let some_theorems = "";
let container = '';


function checkContainersForImage(imageName, callback) {
    docker.listContainers({ all: true }, function (err, containers) {
        if (err) {
            callback(err, null);
            return;
        }

        const containerWithImage = containers.some(c => c.Image === imageName);
        if (containerWithImage) {
            const existingContainer = containers.find(c => c.Image === imageName);
            container = docker.getContainer(existingContainer.Id);
        }

        callback(null, containerWithImage);
    });
}



async function runLEANContainer(data) {
    const code = data["code"];
    const required_theorems = data["required_theorems"];
    fs.writeFileSync(`${volumePath}/test.lean`, code);


    return new Promise((resolve, reject) => {
        checkContainersForImage('lean_image', async function (err, containerExists) {
            if (err) {
                console.error('Error checking containers for image:', err);
                reject(err);
                return;
            }
            

            if (!containerExists) {
                try {
                    const newContainer = await docker.createContainer({
                        Image: 'lean_image',
                        Tty: true,
                        AttachStdout: true,
                        AttachStderr: true,
                        HostConfig: {
                            Binds: [`${volumePath}:${containerPath}`],
                        },
                    });

                    container = newContainer;

                    await container.start();

                    const result = await executeLeanCommandWithTimeout(code, required_theorems, 4);
                    resolve(result);
                } catch (error) {
                    console.error('Error creating or starting container:', error);
                    reject(error);
                }
            } else {
                try {
                    await container.restart();
                    const result = await executeLeanCommandWithTimeout(code, required_theorems, 4);
                    resolve(result);
                } catch (error) {
                    console.error('Error restarting container:', error);
                    reject(error);
                }
            }
        });
    });
}



function check_including(code, required_theorems) {
    for (const theorem of required_theorems) {
        if (!code.includes(theorem)) {
            some_theorems = theorem;
            return false;
        }
    }

    return true;
}


function getTime() {
    var currentDate = new Date();

    var year = currentDate.getFullYear();
    var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    var day = currentDate.getDate().toString().padStart(2, '0');

    var hours = currentDate.getHours().toString().padStart(2, '0');
    var minutes = currentDate.getMinutes().toString().padStart(2, '0');
    var seconds = currentDate.getSeconds().toString().padStart(2, '0');

    var currentDateTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

    return currentDateTime;
}


async function executeLeanCommandWithTimeout(code, required_theorems, timeoutSeconds) {


    return new Promise((resolve, reject) => {
        const command = ['sh', '-c', `output=$(timeout ${timeoutSeconds}s lean /data/test.lean; timeout_exit_code=$?; if [ $timeout_exit_code -eq 124 ]; then echo "TIMEOUT"; fi); echo "$output"`];
        container.exec({
            Cmd: command,
            AttachStdout: true,
            AttachStderr: true
        }, function (err, exec) {
            if (err) {
                console.error('Error executing lean command:', err);
                reject(err);
                return;
            }

            exec.start(function (err, stream) {
                if (err) {
                    console.error('Error starting lean command:', err);
                    reject(err);
                    return;
                }

                let leanOutput = '';

                stream.on('data', function (chunk) {
                    leanOutput += chunk.toString();
                });



                stream.on('end', function () {
                    if (leanOutput.replace(/[^\x20-\x7E]/g, "").replace(/\s/g, "") === "TIMEOUT") {
                        resolve({ "status": 'TL', "log": 'Time Limit Exceeded' });
                    } else {
                        if (leanOutput.includes('error')) {
                            resolve({ "status": 'WP', "log": 'Wrong Proof:' + leanOutput.trim() });
                        } else if (leanOutput.includes('sorry')) {
                            resolve({ "status": 'MP', "log": 'Missing Proof:' + leanOutput.trim() });
                        } else {
                            if (check_including(code, required_theorems)) {
                                resolve({ "status": 'OK', "log": 'OK! All theorems are proved' });
                            } else {
                                resolve({ "status": 'MP', "log": 'Missing Proof: No "' + some_theorems + '" found' });
                            }
                        }
                    }
                });
            });
        });
    });
}


async function runCppContainer(data) {
    code = data["code"]
    extra_flag = data["extra_flag"]

    fs.writeFileSync(`${volumePath}/test.cpp`, code);

    return new Promise((resolve, reject) => {
        checkContainersForImage('gcc', async function (err, containerExists) {
            if (err) {
                console.error('Error checking containers for image:', err);
                reject(err);
                return;
            }

            if (!containerExists) {
                try {
                    const newContainer = await docker.createContainer({
                        Image: 'gcc',
                        Tty: true,
                        Cmd : ['/bash'],
                        AttachStdout: true,
                        AttachStderr: true,
                        HostConfig: {
                            Binds: [`${volumePath}:${containerPath}`],
                        },
                    });

                    container = newContainer;

                    await container.start();

                    const result = await compileCppCommand(extra_flag);
                    resolve(result);
                } catch (error) {
                    console.error('Error creating or starting container:', error);
                    reject(error);
                }
            } else {
                try {
                    await container.restart();
                    const result = await compileCppCommand(extra_flag);
                    resolve(result);
                } catch (error) {
                    console.error('Error restarting container:', error);
                    reject(error);
                }
            }
        });
    });
}


async function compileCppCommand(extra_flag) {
    return new Promise((resolve, reject) => {
        const command = ['sh', '-c', `g++ --std=c++20 -Wall -Wextra -Werror ${extra_flag} /data/test.cpp`];
        container.exec({
            Cmd: command,
            AttachStdout: true,
            AttachStderr: true
        }, function (err, exec) {
            if (err) {
                console.error('Error compiling c++ code:', err);
                reject(err);
                return;
            }

            exec.start(function (err, stream) {
                if (err) {
                    console.error('Error compiling c++ code:', err);
                    reject(err);
                    return;
                }

                let compileCppCommand = '';

                stream.on('data', function (chunk) {
                    compileCppCommand += chunk.toString();
                });


                stream.on('end', function () {
                    resolve({ 'compile_logs': compileCppCommand });
                });
            });
        });
    });
}


function parseWALog(logData) {
    const logParts = logData.split('\n');
    
    const input = logParts[2].replace('input: ', '');
    const correctOutput = logParts[3].replace('correct output: ', '');
    const yourOutput = logParts[4].replace('your output: ', '');

    return {
        status: "WA",
        log: "wrong answer",
        test_case : logParts[1],
        input: input,
        correctOutput: correctOutput,
        yourOutput: yourOutput
    };
}



function parseOKLog(logData) {
    const logParts = logData.split('\n');
    const max_time = logParts[1];
    return {
        status: "OK",
        log: "OK! ",
        runtime: max_time
    }
}


async function executeCppCommandWithTimeout(code, timeoutSeconds) {
    return new Promise((resolve, reject) => {
        const command = ["/a.out"];
        container.exec({
            Cmd: command,
            AttachStdout: true,
            AttachStderr: true
        }, function (err, exec) {
            if (err) {
                console.error('Error executing cpp code:', err);
                reject(err);
                return;
            }

            exec.start(function (err, stream) {
                if (err) {
                    console.error('Error starting cpp code:', err);
                    reject(err);
                    return;
                }

                let cppOutput = '';

                stream.on('data', function (chunk) {
                    cppOutput += chunk.toString();
                });


                stream.on('end', function () {
                    if (cppOutput.includes('TL')) {
                        resolve({ "status": 'TL', "log": 'Time Limit Exceeded' });
                    } else {
                        if (cppOutput.includes('WA')) {
                            resolve(parseWALog(cppOutput.trim()));
                        } else if (cppOutput.includes('OK')) {
                            resolve(parseOKLog(cppOutput.trim()));
                        } else {
                            resolve({ "status": 'RE', "log": "Runtime Error:\n" + cppOutput.trim() })
                        }
                    }
                });
            });
        });
    });
}


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})
const database_name = "BestCode";



const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
let server;
let db;


async function startServer() {
    try {
        server = app.listen(port, () => {
            console.log(`Server listening at http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Error starting server:', err);
    }
}


async function closeServer() {
    try {
        if (server) {
            server.close(async () => {
                console.log('Server is closed.');
            });
        }
    } catch (err) {
        console.error('Error closing server:', err);
        process.exit(1);
    }
}


async function connect(client) {
    try {
        await client.connect();
        console.log("Connected to Cosmos DB");
    } catch (err) {
        console.error("Error connecting to Cosmos DB:", err);
    }
}


async function getDatabase(client, databaseName) {
    try {
        db = await client.db(databaseName);
    } catch (err) {
        console.error("Error creating/finding database:", err);
    }
}


async function getCollection(collectionName) {
    try {
        const collection = await db.collection(collectionName);
        return collection;
    } catch (err) {
        console.error("Error creating/finding collection:", err);
    }
}


async function disconnect(client) {
    try {
        await client.close();
        console.log("Disconnected from Cosmos DB");
    } catch (err) {
        console.error("Error disconnecting to Cosmos DB:", err);
        process.exit(1);
    }
}

async function init() {
    await connect(client);
    await getDatabase(client, "BestCode");
    await startServer();
}


async function stop() {
    await closeServer();
    await disconnect(client);
}


init();
process.on('SIGINT', () => {
    stop();
});



async function insertDocument(collection, document) {
    try {
        const _ = await collection.insertOne(document);
    } catch (err) {
        console.error("Error inserting the document into the collection", err);
    }
}


async function getDocumentByQuery(collection_name, query) {
    try {
        const collection = await getCollection(collection_name);
        const document = await collection.findOne(query);
        if (!document) {
            console.log("No document with this query");
            return {};
        }
        return document;
    } catch (err) {
        console.error("Error retrieving the document by the query", err);
    }
}




async function getDocumentsByQuery(collection_name, query) {
    try {
        const collection = await getCollection(collection_name);
        const documents = await collection.find(query).toArray();
        return documents;
    } catch (err) {
        console.error("Error retrieving the documents by the query", err);
        return [];
    }
}


async function getDocumentKeyByQuery(collection_name, query) {
    try {
        const collection = await getCollection(collection_name);
        const document = await collection.findOne(query);
        if (document) {
            return document._id.toHexString();
        } else {
            return null;
        }
        

    } catch (err) {
        console.error("Error retrieving the document keys by the query", err);
        return [];
    }
}


async function getDocumentKeysByQuery(collection_name, query) {
    try {
        const collection = await getCollection(collection_name);
        const documents = await collection.find(query).toArray();
        const keys = documents.map(doc => doc._id.toHexString());
        return keys;

    } catch (err) {
        console.error("Error retrieving the document keys by the query", err);
        return [];
    }
}



async function getDocumentAndKeysByQuery(collection_name, query) {
    try {
        const collection = await getCollection(collection_name);
        const document = await collection.findOne(query);

        return [document._id.toHexString(), document];
    } catch (err) {
        console.error("Error retrieving the documents and their keys by the query", err);
        return [];
    }
}



async function getDocumentsAndKeysByQuery(collection_name, query) {
    try {
        const collection = await getCollection(collection_name);
        const documents = await collection.find(query).toArray();

        const jsonObjects = documents.map(doc => [doc._id.toHexString(), doc]);

        return jsonObjects;
    } catch (err) {
        console.error("Error retrieving the documents and their keys by the query", err);
        return [];
    }
}


async function getAllDocumentKeys() {
    try {
        const collection = await getCollection("ProblemKeys");

        const keys = await collection.findOne({});

        if (keys) {
            return [keys['keys']];
        } else {
            return [];
        }
    } catch (err) {
        console.error(err);
        return null;
    }
}


async function getAllDocumentsWithKeysByCourse(collection_name, cur_course) {
    try {
        const collection = await getCollection(collection_name);

        const query = {"course" : cur_course};

        const sort = {};
        sort['id'] = 1;

        const docs = await collection.find(query).sort(sort).toArray();

        if (docs) {
            const allDocuments = docs.map(doc => {
                return {
                    key: doc._id.toHexString(),
                    content: {
                        "title": doc['title'],
                        "course": doc['course'],
                        "id": doc['id'],
                        "difficulty": doc['difficulty'],
                        "video_id": doc['video_id']
                    }
                };
            });
            return allDocuments;

        } else {
            return [];
        }
    } catch (err) {
        console.error("Error retrieving all documents and their keys by course", err);
        return null;
    }
}


async function getDocumentByKey(collection, key) {
    try {
        const document = await collection.findOne({ _id: ObjectId.createFromHexString(key) });
        if (!document) {
            console.log("No document with this key");
            return null;
        }
        return document;
    } catch (err) {
        console.error("Error retrieving the document by key", err);
    }
}


async function updateDocumentByKey(collection_name, key, updatedContent) {
    try {
        const collection = await getCollection(collection_name);

        const doc = await getDocumentByKey(collection, key);

        if (doc) {
            const res = await collection.updateOne({ _id: ObjectId.createFromHexString(key) },
            {$set : updatedContent});


            if (res.matchedCount == 1) {
                return true;
            } else {
                return false;
            }
        } else {
            console.log("Document with key", key, "not found.");
            return false;
        }
    } catch (err) {
        console.error(err);
        return false;
    }
}


app.get('/get_problems/:course/:topic', async (req, res) => {
    try {
        const course = req.params.course;
        const topic = req.params.topic;
        const list = await getAllDocumentsWithKeysByCourse("Problems", '/' + course + '/' + topic);
        res.status(200).json(list);

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})


app.get('/get_problem/:course/:topic/:problemId', async (req, res) => {
    try {
        const course = req.params.course;
        const topic = req.params.topic;
        const problemId = req.params.problemId;

        const query = { "id": parseInt(problemId), "course": '/' + course + '/' + topic };
        const problem = await getDocumentsByQuery("Problems", query);

        res.status(200).json(problem)

    } catch (error) {
        console.error("Error fetching problem:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.get('/get_user/:user_id', async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const query = { "user_id": user_id }
        const user = await getDocumentsByQuery("Users", query)
        res.status(200).json(user)

    } catch (error) {
        console.error("Error fetching problem:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


app.post('/create_user/:user_id', async (req, res) => {
    try {

        const collection = await getCollection("Users");

        const user_id = req.params.user_id;
        const result = await getAllDocumentKeys();
        if (result == null || result.length != 1) {
            res.status(500).json({ error: "Wrong result" });
            return;
        }
        const [keys] = result;

        let userInfo_result = {};

        keys.forEach(key => {
            userInfo_result[key] = {
                "status": "Not solved",
                "last solutions": []
            };
        });

        const userInfo = { "user_id": user_id, "problems": userInfo_result };

        await insertDocument(collection, userInfo);
        const ins_res = await getDocumentByQuery("Users", {"user_id": user_id});

        if (ins_res) {
            res.status(200).json(ins_res);
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }

    } catch (error) {
        res.status(500).json({ error: 'Internal server error2' });
    }
})



app.post('/submit_math/:topic/:problem_id', async (req, res) => {
    try {
        const code = req.body;
        const topic = req.params.topic;
        const problemId = req.params.problem_id;


        const query = { "id": parseInt(problemId), "course": '/' + 'math' + '/' + topic };
        const problem = await getDocumentByQuery("Problems", query);

        const requirements = problem['requirements'];
        
        const result = await runLEANContainer({ "code": code["code"], "required_theorems": requirements });



        problem['submitted']++;

        const keys = await getDocumentKeysByQuery("Problems", query);
        const key = keys[0];

        const response = await updateDocumentByKey("Problems", key, problem);

        result['time'] = getTime()
        result['code'] = code["code"];


        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});







app.put('/problem_solved/:user_id/:course/:topic/:problem_id', async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const course = req.params.course;
        const topic = req.params.topic;
        const problem_id = req.params.problem_id;

        

        const query_problem = { "id": parseInt(problem_id), "course": '/' + course + '/' + topic };
        const key_problem = await getDocumentKeyByQuery('Problems', query_problem);


        const query_user = { "user_id": user_id };
        const key_and_objects_user = await getDocumentAndKeysByQuery('Users', query_user);

    
        const key_user = key_and_objects_user[0];

        let content_user = key_and_objects_user[1];



        content_user["problems"][key_problem]["status"] = "Solved";

        const result = await updateDocumentByKey("Users", key_user, {"problems" : content_user["problems"]});

        const problem = await getDocumentByQuery("Problems", query_problem);

        problem['accepted']++;



        const response = await updateDocumentByKey("Problems", key_problem, problem);



        if (result) {
            res.status(200).json("OK");
        } else {
            res.status(404).json("Something went wrong");
        }


    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
})



app.put('/add_submissions/:user_id/:course/:topic/:problem_id', async (req, res) => {
    try {
        const json_object = req.body;

        const user_id = req.params.user_id;
        const course = req.params.course;
        const topic = req.params.topic;
        const problem_id = req.params.problem_id;

        const query_problem = { "id": parseInt(problem_id), "course": '/' + course + '/' + topic };
        const key_problem = await getDocumentKeyByQuery('Problems', query_problem);

        const query_user = { "user_id": user_id };
        const key_and_objects_user = await getDocumentAndKeysByQuery('Users', query_user);
        const key_user = key_and_objects_user[0]
        let content_user = key_and_objects_user[1];



        if ((content_user["problems"][key_problem]["last solutions"]).length < 3) {

            content_user["problems"][key_problem]["last solutions"].push(json_object);

            const result = await updateDocumentByKey("Users", key_user, content_user);

            if (result) {
                res.status(200).json(content_user);
            } else {
                res.status(404).json("Something went wrong");
            }




        } else if (content_user["problems"][key_problem]["last solutions"].length == 3) {


            content_user["problems"][key_problem]["last solutions"] = [
                content_user["problems"][key_problem]["last solutions"][1],
                content_user["problems"][key_problem]["last solutions"][2],
                json_object
            ]

            const result = await updateDocumentByKey("Users", key_user, content_user);

            if (result) {
                res.status(200).json(content_user);
            } else {
                res.status(404).json("Something went wrong");
            }



        } else {
            res.status(404).json("Something went wrong")
        }

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})




app.get('/get_submissions/:user_id/:course/:topic/:problem_id', async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const course = req.params.course;
        const topic = req.params.topic;
        const problem_id = req.params.problem_id;

        const query_problem = { "id": parseInt(problem_id), "course": '/' + course + '/' + topic };
        const key_problem = await getDocumentKeyByQuery('Problems', query_problem);

        const query_user = { "user_id": user_id };
        const key_and_objects_user = await getDocumentAndKeysByQuery('Users', query_user);
        const content_user = key_and_objects_user[1];

        const result = content_user["problems"][key_problem]["last solutions"];


        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})




app.post('/run_programming/:topic/:problem_id', async (req, res) => {
    try {
        const code = req.body;
        const topic = req.params.topic;
        const problemId = req.params.problem_id;

        const query = { "id": parseInt(problemId), "course": '/' + 'programming' + '/' + topic };
        const problem = await getDocumentByQuery("Problems", query);
        const run_headers = problem['run_headers'];
        const run_body = problem['run_code'];
        const run_code = run_headers + code["code"] + run_body;


        const compile_result = await runCppContainer({ "code": run_code, "extra_flag": "-fsanitize=address" });
        const logs = compile_result["compile_logs"];
        let result;
        if (logs != '') {
            result = {"status" : "CE", "log" : "Compilation Error:\n" + logs};
            
        } else {
            result = await executeCppCommandWithTimeout(run_code, 1);
            
        }
        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})



app.post('/submit_programming/:topic/:problem_id', async (req, res) => {
    try {

        const code = req.body;
        const topic = req.params.topic;
        const problemId = req.params.problem_id;

        const query = { "id": parseInt(problemId), "course": '/' + 'programming' + '/' + topic };
        const problem = await getDocumentByQuery("Problems", query);
        const submit_headers = problem['submit_headers'];
        const submit_body = problem['submit_code'];
        const submit_code = submit_headers + code["code"] + submit_body;

        const compile_result = await runCppContainer({ "code": submit_code, "extra_flag": "-fsanitize=address" });
        const logs = compile_result["compile_logs"];

        problem['submitted']++;
        const keys = await getDocumentKeysByQuery("Problems", query);
        const key = keys[0];

        const _ = await updateDocumentByKey("Problems", key, problem);



        let result;
        if (logs != '') {
            result = {"status" : "CE", "log" : "Compilation Error: \n" + logs};
            result['time'] = getTime();
            result['code'] = code["code"];
            result['runtime'] = '-';
        } else {
            result = await executeCppCommandWithTimeout(submit_code, 1);
            result['time'] = getTime()
            result['code'] = code["code"];
            if (result['status'] != 'OK') {
                result['runtime'] = '-';
            }
            
        }
        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})