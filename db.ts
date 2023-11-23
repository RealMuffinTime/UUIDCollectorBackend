import {Database} from "bun:sqlite";

export class UDB<T = any> {
    private db: Database;

    constructor() {
        this.db = new Database("db.sqlite");
    }

    init() {
        this.db.run(`CREATE TABLE IF NOT EXISTS users ("uuid" varchar(32) NOT NULL, "username" text NOT NULL, "indexBy" varchar(32) NOT NULL, PRIMARY KEY ("uuid"));`);
        this.db.run(`CREATE TABLE IF NOT EXISTS keys ("key" varchar(32) NOT NULL, "owner" varchar(32) NOT NULL, PRIMARY KEY ("key"));`);
    }

    addUser(user: User, indexedBy: string) { // @ts-ignore
        this.db.run(`INSERT OR REPLACE INTO users VALUES ($uuid, $username, $indexedBy)`, {$uuid: user.uuid, $username: user.username, $indexedBy: indexedBy});
    }

    getUsers() { // @ts-ignore
        let users = [] as any;
        this.db.query("SELECT * FROM users").all().forEach(user => {
            users.push(user as User);
        });

        return users;
    }

    addKey(owner: string, key: string) { // @ts-ignore
        this.db.run(`INSERT OR REPLACE INTO keys VALUES ($key, $owner)`, {$key: key, $owner: owner});
        return {key: key, owner: owner};
    }

    getKey(key: string) {
        return this.db.query(`SELECT * FROM keys WHERE key = $key`).get({$key: key});
    }
	
	removeKey(key: string) {
		this.db.run(`DELETE FROM keys WHERE key = $key`);
		return {key: key};
	}
}

export type User = {
    uuid: string;
    username: string;
    indexBy: string;
};