import { CDNRoutes } from "discord-api-types/v9";
import GuildTextChannel from "./GuildTextChannel.js";
import { ChannelTypes } from "../utils/Constants.js";

export default class Guild {
    constructor(client, data) {
        Object.defineProperty(this, 'client', { value: client });
        this.id = data.id;
        this.name = data.name;
        this.icon = data.icon;
        this.description = data.description;
        this.ownerId = data.owner_id;
        this.channels = new Map();
        this.setup(data);
    }
    setup(data) {
        if ('channels' in data) {
            for (const channel of data.channels) {
                switch (channel.type) {
                    case ChannelTypes.GUILD_TEXT:
                        this.channels.set(channel.id, new GuildTextChannel(this.client, this, channel));
                        break;
                }
            }
        }
    }
    iconURL(options = {}) {
        return this.icon ? CDNRoutes.guildIcon(this.id, this.icon, options.format, options.size) : null;
    }
}