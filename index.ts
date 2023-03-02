import {Elysia} from "elysia";
import {UDB, User} from "./db.ts";

const db = new UDB(),
    app = new Elysia().listen(9999);

db.init();

app.get("/api/user/index/:uuid/:username", ({params}) => {
    const user: User = {
        uuid: params.uuid,
        username: params.username
    }

    console.log(`[NEW] > ${user}`);
    db.addUser(user);
});

app.get("/api/user/total", () => {
    return db.getUsers();
});