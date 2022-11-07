import { ChannelTypes } from "../utils/Constants.js";

export default class Channel {
    constructor(client, data) {
        Object.defineProperty(this, 'client', { value: client });
        this.id = data.id;
        this.type_ = data.type;
        this.messages = new Map();
    }
    get type() {
        return ChannelTypes[this.type_];
    }
}