import { CloseOpcodes } from "../utils/Constants.js";

export class DiscordError extends Error {
    constructor(error, metadata) {
        super(error);
        this.data = null;
        this.status = null;
        this.headers = null;
        this.path = null;
        this.metadata = metadata;
        if (error.response) {
            this.data = error.response.data;
            this.status = error.response.status;
            this.headers = error.response.headers;
            this.path = error.response.config.url;
        }
    }
}
export class WebSocketError extends Error {
    constructor(error, metadata) {
        super(CloseOpcodes[error.code] ?? 'Unknown Error');
        this.data = null;
        this.code = null;
        this.metadata = metadata;
        if (error.data) {
            this.data = error.data;
            this.code = error.code;
        }
    }
}