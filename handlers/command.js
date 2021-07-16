const {
    readdirSync
} = require("fs");
const config = require("../config.json")
const ascii = require("ascii-table");
let table = new ascii("Commands");
const functions = require("../functions")
table.setHeading("Command", "Load status");
module.exports = (client) => {
    readdirSync("./commands/").forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));
        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);
            if (pull.name) {
                client.commands.set(pull.name, pull);
                table.addRow(file, '✅')
            } else {
                table.addRow(file, '❌ -> Missing a help.name, or help.name is not a string.')
                continue;
            } if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name))
        }
    });

    const guildonlycounter = new Map();
    client.on("ready", () => {
        console.log(`Bot User ${client.user.username} has been logged in and is ready to use!`);
        client.user.setActivity(`${config.prefix}help | 24/7 Free Music Bot`, {
            type: 'WATCHING'
        });
    });
    client.distube
        .on("playSong", async (message, queue, song) => {

            client.infos.set("global", Number(client.infos.get("global", "songs")) + 1, "songs");

            try {
                queue.connection.voice.setDeaf(true);
            } catch (error) {
                console.error(error)
                functions.embedbuilder(client, 5000, message, config.colors.no, "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error got sent to my owner!**")
                functions.errorbuilder(error.stack.toString().substr(0, 2000))
            }
            try {
                queue.connection.voice.setSelfDeaf(true);
            } catch (error) {
                console.error(error)
                functions.embedbuilder(client, 5000, message, config.colors.no, "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error got sent to my owner!**")
                functions.errorbuilder(error.stack.toString().substr(0, 2000))
            }
            try {
                functions.playsongyes(client, message, queue, song);
            } catch (error) {
                console.error(error)
                functions.embedbuilder(client, 5000, message, config.colors.no, "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error got sent to my owner!**")
                functions.errorbuilder(error.stack.toString().substr(0, 2000))
            }
        })
        .on("addSong", (message, queue, song) => {
            try {
                return functions.embedbuilder(client, 7500, message, config.colors.yes, "Added a Song!", `Song: [\`${song.name}\`](${song.url})  -  \`${song.formattedDuration}\` \n\nRequested by: ${song.user}\n\nEstimated Time: ${queue.songs.length - 1} song(s) - \`${(Math.floor((queue.duration - song.duration) / 60 * 100) / 100).toString().replace(".", ":")}\`\nQueue duration: \`${queue.formattedDuration}\``, song.thumbnail)
            } catch (error) {
                console.error(error)
                functions.embedbuilder(client, 5000, message, config.colors.no, "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error got sent to my owner!**")
                functions.errorbuilder(error.stack.toString().substr(0, 2000))
            }
        })
        .on("playList", (message, queue, playlist, song) => {
            try {
                queue.connection.voice.setDeaf(true);
            } catch (error) {
                console.error(error)
                functions.embedbuilder(5000, message, config.colors.no, "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error got sent to my owner!**")
                functions.errorbuilder(error.stack.toString().substr(0, 2000))
            }
            try {
                queue.connection.voice.setSelfDeaf(true);
            } catch (error) {
                console.error(error)
                functions.embedbuilder(client, 5000, message, config.colors.no, "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error got sent to my owner!**")
                functions.errorbuilder(error.stack.toString().substr(0, 2000))
            }
            functions.embedbuilder(client, 7500, message, config.colors.yes, "Added a Playlist!", `Playlist: [\`${playlist.name}\`](${playlist.url ? playlist.url : ""})  -  \`${playlist.songs.length ? playlist.songs.length : "undefinied"} songs\` \n\nRequested by: ${queue.songs[0].user ? queue.songs[0].user : "error"}`, playlist.thumbnail.url ? playlist.thumbnail.url : "")

            try {
                functions.playsongyes(client, message, queue, queue.songs[0]);
            } catch (error) {
                console.error(error)
                functions.embedbuilder(client, 5000, message, "#ff264a", "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error got sent to my owner!**")
                functions.errorbuilder(error.stack.toString().substr(0, 2000))
            }
        })
        .on("addList", (message, queue, playlist) => {
            try {
                return functions.embedbuilder(client, 7500, message, config.colors.yes, "Added a Playlist!", `Playlist: [\`${playlist.name}\`](${playlist.url ? playlist.url : ""})  -  \`${playlist.songs.length ? playlist.songs.length : "undefinied"} songs\` \n\nRequested by: ${queue.songs[0].user ? queue.songs[0].user : "error"}`, playlist.thumbnail.url ? playlist.thumbnail.url : "")
            } catch (error) {
                console.error(error)
                functions.embedbuilder(client, 5000, message, config.colors.no, "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error got sent to my owner!**")
                functions.errorbuilder(error.stack.toString().substr(0, 2000))
            }
        })
        .on("searchResult", (message, result) => {
            try {
                let i = 0;
                return functions.embedbuilder(client, "null", message, config.colors.yes, "", `**Choose an option from below**\n${result.map(song => `**${++i}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`)
            } catch (error) {
                console.error(error)
                functions.embedbuilder(client, 5000, message, config.colors.no, "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error got sent to my owner!**")
                functions.errorbuilder(error.stack.toString().substr(0, 2000))
            }
        })
        .on("searchCancel", (message) => {
            try {
                message.reactions.removeAll();
                message.react("❌")
            } catch (error) {
                console.error(error)
                functions.embedbuilder(client, 5000, message, config.colors.no, "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error got sent to my owner!**")
                functions.errorbuilder(error.stack.toString().substr(0, 2000))
            }
            try {
                return functions.embedbuilder(client, 5000, message, config.colors.yes, `Searching canceled`, "")
            } catch (error) {
                console.error(error)
                functions.embedbuilder(client, 5000, message, config.colors.no, "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error got sent to my owner!**")
                functions.errorbuilder(error.stack.toString().substr(0, 2000))
            }
        })
        .on("error", (message, err) => {
            try {
                message.reactions.removeAll();
                message.react("❌")
            } catch (error) {
                console.error(error)
                functions.embedbuilder(client, 5000, message, config.colors.no, "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error got sent to my owner!**")
                functions.errorbuilder(error.stack.toString().substr(0, 2000))
            }
            console.log(err);
            try {
                return functions.embedbuilder(client, "null", message, config.colors.yes, "An error encountered:", "```" + err + "```")
            } catch (error) {
                console.error(error)
                functions.embedbuilder(client, 5000, message, config.colors.no, "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error got sent to my owner!**")
                functions.errorbuilder(error.stack.toString().substr(0, 2000))
            }
        })
        .on("noRelated", message => {
            try {
                return functions.embedbuilder(client, 5000, message, config.colors.yes, "Can't find related video to play. Stop playing music.")
            } catch (error) {
                console.error(error)
                functions.embedbuilder(client, 5000, message, config.colors.no, "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error got sent to my owner!**")
                functions.errorbuilder(error.stack.toString().substr(0, 2000))
            }
        })
        .on("initQueue", queue => {
            try {
                queue.autoplay = false;
                queue.volume = 75;
                queue.filter = "bassboost6";
            } catch (error) {
                console.error(error)
                functions.errorbuilder(error.stack.toString().substr(0, 2000))
            }
        });

    console.log(table.toString());
}
