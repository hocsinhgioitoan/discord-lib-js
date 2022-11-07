import Message from "../../structures/Message.js";

export default function (client, data) {
    const message = new Message(client, data);
    if (data.guild_id) {
        const guild = client.guilds.get(data.guild_id);
        const channel = guild.channels.get(data.channel_id);
        if (channel) {
            channel.messages.set(data.id, message);
        }
    } else {
        const channel = client.channels.get(data.channel_id);
        if (channel) {
            channel.messages.set(data.id, message);
        }
    }
    client.emit('messageCreate', message);
}