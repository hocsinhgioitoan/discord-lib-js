import { CDNRoutes } from 'discord-api-types/v9';

export default class User {
    constructor(client, data) {
        Object.defineProperty(this, 'client', { value: client });
        this.id = data.id;
        this.username = data.username;
        this.discriminator = data.discriminator;
        this.avatar = data.avatar;
        this.bot = Boolean(data.bot);
        this.flags = data.public_flags ?? 0;
    }
    get tag() {
        return `${this.username}#${this.discriminator}`;
    }
    avatarURL(options = {}) {
        return this.avatar ? CDNRoutes.userAvatar(this.id, this.avatar, options.format, options.size) : CDNRoutes.defaultUserAvatar(this.discriminator);
    }
}