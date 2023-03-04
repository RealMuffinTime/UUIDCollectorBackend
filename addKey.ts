const uuid = process.argv[2];
if (!uuid) {console.log("Please provide the CLI with an UUID."); process.exit();}
if (!uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {console.log("Invalid UUID format. Please use long (with dashes) UUIDv4."); process.exit();}

import {UDB} from "./db.ts";
import Crypto from "node:crypto";

const db = new UDB(),
    key = Crypto.randomUUID();

console.log(db.addKey(process.argv[2], key));