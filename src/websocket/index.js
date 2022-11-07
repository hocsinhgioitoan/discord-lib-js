import ws from 'ws';
import { Opcodes } from '../utils/Constants.js';
import { WebSocketError } from '../error/index.js';
export class WebSocket extends ws {
    constructor(client, url) {
        super(url);
        Object.defineProperty(this, 'client', { value: client });
        this.heartbeatInterval = null;
        this.queueHeartbeat = null;
        this.seq = null;
        this.sessionId = null;
        this.resumeURL = null;
        this.ping = -1;
        this._lastHeartbeat = null;
        this.setup();
    }
    setup() {
        this.on('open', () => {
            this.client.emit('debug', 'WebSocket: Opened');
            this.sendHeartbeat();
        });
        this.on('message', (data) => {
            data = JSON.parse(data);
            this.seq = data.s;
            switch (data.op) {
                case Opcodes.DISPATCH:
                    this.handlerDispatch(data);
                    break;
                case Opcodes.HELLO:
                    this.heartbeatInterval = data.d.heartbeat_interval;
                    this.identify();
                    break;
                case Opcodes.INVALID_SESSION:
                case Opcodes.RECONNECT:
                case Opcodes.HEARTBEAT:
                    console.log(data);
                    break;
                case Opcodes.HEARTBEAT_ACK:
                    this.client.emit('debug', 'WebSocket: Heartbeat Acknowledged');
                    this.ping = Date.now() - this._lastHeartbeat;
                    this.queueHeartbeat = setTimeout(() => {
                        this.sendHeartbeat();
                    }, this.heartbeatInterval);
                    break;
            }
        });
        this.on('close', (code, reason) => {
            this.client.emit('debug', `WebSocket: Closed ${code} ${reason}`);
            this.clear();
            throw new WebSocketError({
                code,
                data: reason?.toString(),
            });
        });
        this.on('error', (error) => {
            this.client.emit('debug', `WebSocket: Error ${error}`);
            this.clear();
            throw new WebSocketError(error);
        });
    }
    identify() {
        this.send(JSON.stringify({
            op: Opcodes.IDENTIFY,
            d: {
                token: this.client.token,
                intents: this.client.options.intents,
                properties: this.client.options.properties,
                large_threshold: this.client.options.large_threshold,
                presence: this.client.options.presence,
            },
        }));
        this.client.emit('debug', `WebSocket: Identify (Intents: ${this.client.options.intents ?? 1})`);
    }
    sendHeartbeat() {
        this.send(JSON.stringify({
            op: Opcodes.HEARTBEAT,
            d: this.seq,
        }));
        this._lastHeartbeat = Date.now();
        this.client.emit('debug', 'WebSocket: Heartbeat Sent');
    }
    clear() {
        clearTimeout(this.queueHeartbeat);
        this.queueHeartbeat = null;
    }
    handlerDispatch(data) {
        if (!data.t) return;
        this.client.emit('debug', `WebSocket: Dispatch ${data.t}`);
        if (data.t === 'READY') {
            this.sessionId = data.d.session_id;
            this.resumeURL = data.d.resume_gateway_url;
        }
        import(`./handlers/${data.t}.js`).then((handler) => {
            handler.default(this.client, data.d);
        }).catch((e) => {
            console.log(e)
        });
    }
}