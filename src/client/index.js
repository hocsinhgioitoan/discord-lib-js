import { Rest } from '../rest/index.js';
import { WebSocket } from '../websocket/index.js';
import Options from '../utils/options.js';
import EventEmitter from 'events';

export class Client extends EventEmitter {
    constructor(options = {}) {
        super();
        this.options = Options.validate(options);
        this.rest = new Rest(this, 'https://discord.com/api/v9');
        this.token = null;
        this.shards = null;
        this.sessionStartLimit = {};
        this.DMChannels = new Map();
        this.guilds = new Map();
        this.presence = this.options.presence;
    }
    setupWS(url) {
        this.ws = new WebSocket(this, `${url}/?v=9&encoding=json`);
    }
    async login(token) {
        if (!token || typeof token !== 'string') throw new Error('No token provided.');
        this.token = token;
        this.setupWS((await this._getWs()).url);
    }
    async _getWs() {
        const data = await this.rest.request('GET', this.rest.routes.gatewayBot());
        this.sessionStartLimit = {
            total: data.session_start_limit.total,
            remaining: data.session_start_limit.remaining,
            resetAfter: data.session_start_limit.reset_after,
            maxConcurrency: data.session_start_limit.max_concurrency,
        }
        return data;
    }
}