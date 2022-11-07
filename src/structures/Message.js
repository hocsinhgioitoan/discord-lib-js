import User from "./User.js";
import { parseMessageData } from "../utils/utils.js";

export default class Message {
    constructor(client, data) {
        Object.defineProperty(this, 'client', { value: client });
        this.id = data.id;
        this.channelId = data.channel_id;
        this.guildId = data.guild_id;
        this.author = new User(client, data.author);
        this.content = data.content;
        this.timestamp = new Date(data.timestamp);
        this.editedTimestamp = data.edited_timestamp ? new Date(data.edited_timestamp) : null;
        this.tts = data.tts;
        this.attachments = data.attachments;
        this.embeds = data.embeds;
        this.nonce = data.nonce;
        this.pinned = data.pinned;
        this.webhookId = data.webhook_id;
        this.type = data.type;
    }
    get channel() {
        return this.guildId ? this.guild?.channels?.get(this.channelId) : this.client.channels.get(this.channelId);
    }
    get guild() {
        return this.client.guilds.get(this.guildId);
    }
    reply(options = {}) {
        if (typeof options === 'string') {
            options = { content: options, message_reference: { message_id: this.id, channel_id: this.channelId, guild_id: this.guildId } };
        } else if (typeof options === 'object') {
            options = parseMessageData({
                ...options,
                message_reference: { message_id: this.id, channel_id: this.channelId, guild_id: this.guildId }
            });
        }
        this.client.rest.request('POST', this.client.rest.routes.channelMessages(this.channelId), {
            data: options,
        });
    }
    edit(options = {}) {
        if (typeof options === 'string') {
            options = { content: options };
        } else if (typeof options === 'object') {
            options = parseMessageData(options);
        }
        this.client.rest.request('PATCH', this.client.rest.routes.channelMessage(this.channelId, this.id), {
            data: options,
        });
    }
    delete(timeout = 0) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.client.rest.request('DELETE', this.client.rest.routes.channelMessage(this.channelId, this.id));
                resolve();
            }, timeout ?? 0);
        });
    }
}