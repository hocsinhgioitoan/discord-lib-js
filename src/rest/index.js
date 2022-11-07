import { Routes } from 'discord-api-types/v9';
import { DiscordError as RestError } from '../error/index.js';
import axios from 'axios';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const packageJSON = require('../../../package.json');

export class Rest {
    constructor(client, baseURL) {
        Object.defineProperty(this, 'client', { value: client });
        this.baseURL = baseURL;
        this.routes = Routes;
    }

    request(method, url, options = {}) {
        return new Promise((resolve, reject) => {
            axios({
                method: method,
                url: this.baseURL + url,
                headers: {
                    Authorization: `Bot ${this.client.token}`,
                    'Content-Type': options.contentType || 'application/json',
                    'User-Agent': `DiscordBot (${packageJSON.homepage}, ${packageJSON.version})`,
                },
                data: options.data,
            })
            .then(d => {
                this.client.emit('debug', `REST: ${method} ${url} ${d.status}`);
                resolve(d.data);
            })
            .catch(e => reject(new RestError(e, options)));
        })
    }
}