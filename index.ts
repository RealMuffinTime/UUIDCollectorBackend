import {Elysia} from "elysia";
import {UDB, User} from "./db.ts";

const db = new UDB(),
    app = new Elysia().listen(9999);

db.init();

app.get("/api/user/index/:uuid/:username", ({params, query, set}) => {
    console.log(query.key)
    if (!query.key) {set.status = 401; return {status: 401, message: "Invalid authentication key."};}
    const key = db.getKey(query.key);
    console.log(key)
    if (!key) {set.status = 401; return {status: 401, message: "Invalid authentication key."};}
    const user: User = {
        uuid: params.uuid,
        username: params.username,
        indexBy: key.owner
    }

    db.addUser(user, key.owner);
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