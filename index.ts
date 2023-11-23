import {Elysia} from "elysia";
import {UDB, User} from "./db.js";

const db = new UDB(),
    app = new Elysia().listen({
        port: 9999
    });

db.init();

app.post("/api/donate/:key", ({params, body, set}) => {
    if (!params.key) {set.status = 401; return {status: 401, message: "Invalid authentication key."};}
    const key = db.getKey(params.key);
    if (!key) {set.status = 401; return {status: 401, message: "Invalid authentication key."};}

    const before_length = db.getUsers().length;

    const users = JSON.parse(body as any).users;
    for (let user in users) {
        const userObj: User = {
            uuid: user,
            username: users[user],
            indexBy: key.owner
        }

        db.addUser(userObj, key.owner);
    }

    const after_length = db.getUsers().length;
    
    console.log("Retrieved new UUIDs by " + key.owner + ".")

    return {status: 200, message: "Thank you!", valid: after_length - before_length, length: after_length};
});

app.get("/api/key/:key", ({params, set}) => {
    const key = db.getKey(params.key);
    if (!key) {set.status = 401; return {status: 401, message: "Invalid authentication key."};}

    console.log("Returned amount of listed user for " + key.owner + ".")
    
    return {status: 200, length: db.getUsers().length};
});

app.get("/api/user/total/length", () => {
    console.log("Returned all user length.")
    return {status: 200, length: db.getUsers().length};
});

app.get("/api/user/total/json", () => {
    console.log("Returned all user.")
    return {status: 200, users: db.getUsers()};
});

console.log("Initialized.")