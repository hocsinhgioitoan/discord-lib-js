import ClientUser from '../../structures/ClientUser.js';

export default function (client, data) {
    client.user = new ClientUser(client, data.user);
    for (const guild of data.guilds) {
        client.guilds.set(guild.id, guild);
    }
    let i = setInterval(() => {
        if (![...client.guilds.values()].find(x => x.unavailable)) {
            client.emit('ready');
            clearInterval(i);
        }
    }, 100);
}