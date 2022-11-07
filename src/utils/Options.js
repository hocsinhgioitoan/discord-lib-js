import Intents from "./Intents.js";
import { ActivityTypes } from "./Constants.js";

export default class Options extends null {
    static create() {
        return {
            intents: 1,
            large_threshold: 50,
            presence: {
                activities: [],
                status: "online",
                afk: false
            },
            properties: {
                os: process.platform,
                browser: "Discord iOS",
                device: "node.js",
            }
        }
    }
    static validate(options = {}) {
        const default_ = Options.create();
        if ('intents' in options) {
            default_.intents = Intents.resolve(options.intents);
        }
        if ('large_threshold' in options) {
            if (typeof options.large_threshold != 'number') {
                throw new TypeError('large_threshold must be a number');
            }
            if (options.large_threshold < 50 || options.large_threshold > 250) {
                throw new RangeError('large_threshold invalid');
            }
            default_.large_threshold = options.large_threshold;
        }
        if ('presence' in options) {
            if (typeof options.presence != 'object') {
                throw new TypeError('presence must be an object');
            }
            options.presence = Options.validatePresence(options.presence);
        }
        if ('properties' in options) {
            if (typeof options.properties != 'object') {
                throw new TypeError('properties must be an object');
            }
            default_.properties = options.properties;
        }
        return default_;
    }
    static validatePresence(presence = {}) {
        if ('activities' in presence) {
            if (!Array.isArray(presence.activities)) {
                throw new TypeError('presence.activities must be an array');
            }
            presence.activities = presence.activities.map(Options.validateActivity);
        }
        if ('status' in presence) {
            if (typeof presence.status != 'string') {
                throw new TypeError('presence.status must be a string');
            }
            if (!['online', 'idle', 'dnd', 'invisible'].includes(presence.status)) {
                throw new TypeError('presence.status invalid');
            }
        }
        if ('afk' in presence) {
            if (typeof presence.afk != 'boolean') {
                throw new TypeError('presence.afk must be a boolean');
            }
        }
        presence.since = null;
        return presence;
    }
    static validateActivity(activity = {}) {
        if ('name' in activity) {
            if (typeof activity.name != 'string') {
                throw new TypeError('activity.name must be a string');
            }
        }
        if ('type' in activity) {
            if (typeof ActivityTypes[activity.type] == 'undefined') {
                throw new TypeError('activity.type invalid');
            }
            activity.type = (typeof activity.type == 'number' ? activity.type : ActivityTypes[activity.type]);
        }
        if ('url' in activity) {
            if (typeof activity.url != 'string') {
                throw new TypeError('activity.url must be a string');
            }
            if (!activity.type) {
                activity.type = ActivityTypes.STREAMING;
            } else if (activity.type != ActivityTypes.STREAMING) {
                throw new TypeError('activity.url invalid');
            }
        }
        return activity;
    }
}