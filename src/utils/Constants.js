export const Opcodes = {
    DISPATCH: 0, // #  Receive => dispatches an event
    HEARTBEAT: 1, // #  Send/Receive => used for ping checking
    IDENTIFY: 2, // #  Send => used for client handshake
    STATUS_UPDATE: 3, // #  Send => used to update the client status
    VOICE_STATE_UPDATE: 4, // #  Send => used to join/move/leave voice channels
    VOICE_GUILD_PING: 5, // #  Send => used for voice ping checking
    RESUME: 6, //  #  Send => used to resume a closed connection
    RECONNECT: 7, // #  Receive => used to tell when to reconnect (sometimes...)
    REQUEST_GUILD_MEMBERS: 8, // #  Send => used to request guild members (when searching for members in the search bar of a guild)
    INVALID_SESSION: 9, // #  Receive => used to notify client they have an invalid session id
    HELLO: 10, // #  Receive => sent immediately after connecting, contains heartbeat and server debug information
    HEARTBEAT_ACK: 11, // #  Sent  => immediately following a client heartbeat that was received
};

export const CloseOpcodes = {
    1000: 'WS_CLOSE_REQUESTED',
    1011: 'INTERNAL_ERROR',
    4004: 'TOKEN_INVALID',
    4010: 'SHARDING_INVALID',
    4011: 'SHARDING_REQUIRED',
    4013: 'INVALID_INTENTS',
    4014: 'DISALLOWED_INTENTS',
}

function createEnum(arr) {
    const obj = {};
    for (let i = 0 ; i < arr.length ; i++) {
        if (arr[i]) {
            obj[arr[i]] = i;
            obj[i] = arr[i];
        }
    }
    return obj;
}

export const ActivityTypes = createEnum(['PLAYING', 'STREAMING', 'LISTENING', 'WATCHING', 'CUSTOM', 'COMPETING']);

export const ChannelTypes = createEnum(
    [
        'GUILD_TEXT',
        'DM',
        'GUILD_VOICE',
        'GROUP_DM',
        'GUILD_CATEGORY',
        'GUILD_NEWS',
        'GUILD_STORE',
        ...Array(3).fill(null),
        // 10
        'GUILD_NEWS_THREAD',
        'GUILD_PUBLIC_THREAD',
        'GUILD_PRIVATE_THREAD',
        'GUILD_STAGE_VOICE',
        'GUILD_DIRECTORY',
        'GUILD_FORUM',
    ]
)