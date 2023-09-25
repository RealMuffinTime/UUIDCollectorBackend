import {Elysia} from "elysia";
import {UDB, User} from "./db.ts";

const db = new UDB(),
    app = new Elysia().listen({
        port: 9999
    });

db.init();

app.post("/api/user/index", ({body, query, set}) => {
    if (!query.key) {set.status = 401; return {status: 401, message: "Invalid authentication key."};}
    const key = db.getKey(query.key);
    if (!key) {set.status = 401; return {status: 401, message: "Invalid authentication key."};}

    const users = JSON.parse(body as any).users;
    for (let user in users) {
        const userObj: User = {
            uuid: user,
            username: users[user],
            indexBy: key.owner
        }

        db.addUser(userObj, key.owner);
    }
    
    console.log("Retrieved new UUIDs by " + key.owner + ".")

    return {status: 200, message: "Thank you!", length: users.length};
});

app.get("/api/key/:key", ({params, set}) => {
    const key = db.getKey(params.key);
    if (!key) {set.status = 401; return {status: 401, message: "Invalid authentication key."};}

    const users = db.getUsers();
    let counter = 0;
    for (let user in users)
        if (users[user].indexBy == key.owner) counter++;

    console.log("Returned amount of listed user for " + key.owner + ".")
    
    return {status: 200, length: counter};
});

app.get("/api/key/:key/length", ({params, set}) => {
    const key = db.getKey(params.key);
    if (!key) {set.status = 401; return {status: 401, message: "Invalid authentication key."};}

    const users = db.getUsers();
    let counter = 0;
    for (let user in users)
        if (users[user].indexBy == key.owner) counter++;
    
    console.log("Returned amount of listed user length for " + key.owner + ".")

    return counter;
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