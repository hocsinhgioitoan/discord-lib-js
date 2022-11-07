import Channel from "./Channel.js";
import { parseMessageData } from "../utils/utils.js";

export default class GuildTextChannel extends Channel {
    constructor(client, guild, data) {
        super(client, data);
        this.name = data.name;
        this.position = data.position;
        this.topic = data.topic;
        this.nsfw = data.nsfw;
        Object.defineProperty(this, 'guild', { value: guild });
    }
    send(options) {
        if (typeof options === 'string') {
            options = { content: options };
        } else if (typeof options === 'object') {
            options = parseMessageData(options);
        }
        this.client.rest.request('POST', this.client.rest.routes.channelMessages(this.id), {
            data: options,
        });
    }
}