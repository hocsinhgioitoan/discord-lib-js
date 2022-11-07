import User from "./User.js";
import Options from "../utils/options.js";
import { Opcodes } from "../utils/Constants.js";

export default class ClientUser extends User {
    constructor(client, data) {
        super(client, data);
    }
    setPresence(data = this.client.presence) {
        this.client.presence = Options.validatePresence(data);
        this.client.ws.send(JSON.stringify({
            op: Opcodes.STATUS_UPDATE,
            d: this.client.presence,
        }));
    }
    setActivity(data = {}) {
        this.client.presence.activities = [Options.validateActivity(data)];
        this.setPresence();
    }
    setStatus(status) {
        this.client.presence.status = status;
        this.setPresence();
    }
    setAFK(afk) {
        this.client.presence.afk = afk;
        this.setPresence();
    }
}