export function parseMessageData(data_ = {}) {
    const data = {
        content: null,
        tts: false,
        embeds: [],
        components: [],
        message_reference: null,
        attachments: [],
        sticker_ids: [],
    }
    if (typeof data_.content === 'string') {
        data.content = data_.content;
    }
    if (typeof data_.tts === 'boolean') {
        data.tts = data_.tts;
    }
    if (Array.isArray(data_.embeds)) {
        data.embeds = data_.embeds;
    }
    if (Array.isArray(data._components)) {
        data.components = data_.components;
    }
    if (typeof data_.message_reference === 'object') {
        data.message_reference = {
            ...data_.message_reference,
            fail_if_not_exists: false,
        };
    }
    return data;
}