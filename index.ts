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

    return {status: 200, message: "Thank you!", length: users.length};
});

app.get("/api/key/:key", ({params, set}) => {
    const key = db.getKey(params.key);
    if (!key) {set.status = 401; return {status: 401, message: "Invalid authentication key."};}

    const users = db.getUsers();
    let counter = 0;
    for (let user in users)
        if (users[user].indexBy == key.owner) counter++;

    return {status: 200, length: counter};
});

app.get("/api/key/:key/length", ({params, set}) => {
    const key = db.getKey(params.key);
    if (!key) {set.status = 401; return {status: 401, message: "Invalid authentication key."};}

    const users = db.getUsers();
    let counter = 0;
    for (let user in users)
        if (users[user].indexBy == key.owner) counter++;

    return counter;
});

app.get("/api/user/total/length", () => {
    return {status: 200, length: db.getUsers().length};
});

app.get("/api/user/total/json", () => {
    return {status: 200, users: db.getUsers()};
});

app.post("/test", ({body}) => {
    console.log(body)
});