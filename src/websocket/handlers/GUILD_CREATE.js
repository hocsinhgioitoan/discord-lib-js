import Guild from "../../structures/Guild.js";

export default function (client, data) {
    const guild = new Guild(client, data);
    if (client.guilds.has(guild.id)) {
        client.emit('guildCreate', guild);
    }
    client.guilds.set(guild.id, guild);
}