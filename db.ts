import {Database} from "bun:sqlite";

export class UDB<T = any> {
    private db: Database;

    constructor() {
        this.db = new Database("db.sqlite");
    }

    init() {
        this.db.run(`CREATE TABLE IF NOT EXISTS users ("uuid" varchar(32) NOT NULL, "username" text NOT NULL, PRIMARY KEY ("uuid"));`);
    }

    addUser(user: User) { // @ts-ignore
        this.db.run(`INSERT OR REPLACE INTO users VALUES ($uuid, $username)`, {$uuid: user.uuid, $username: user.username});
    }

    getUsers() { // @ts-ignore
        let users = [] as any;
        this.db.query("SELECT * FROM users").all().forEach(user => {
            users.push(user as User);
        });

        return users;
    }
}

export type User = {
    uuid: string;
    username: string;
};