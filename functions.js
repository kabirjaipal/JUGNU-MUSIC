const Discord = require("discord.js");
const { Client, Collection, MessageEmbed } = require("discord.js");
const client = new Client({
  fetchAllMembers: false,
  restTimeOffset: 0,
  shards: "auto",
  disableEveryone: true,
});
const config = require("./config.json");
const { canModifyQueue } = require("./handlers/jugnu");
module.exports.formatDate = formatDate;
module.exports.promptMessage = promptMessage;
module.exports.embedbuilder = embedbuilder;
module.exports.errorbuilder = errorbuilder;
module.exports.customplaylistembed = customplaylistembed;
module.exports.lyricsEmbed = lyricsEmbed;
module.exports.playsongyes = playsongyes;
module.exports.curembed = curembed;
module.exports.delay = delay;
module.exports.getRandomInt = getRandomInt;
module.exports.QueueEmbed = QueueEmbed;

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US").format(date);
}
async function promptMessage(message, author, time, validReactions) {
  time *= 1000;
  for (const reaction of validReactions) await message.react(reaction);
  const filter = (reaction, user) =>
    validReactions.includes(reaction.emoji.name) && user.id === author.id;
  return message
    .awaitReactions(filter, {
      max: 1,
      time: time,
    })
    .then((collected) => collected.first() && collected.first().emoji.name);
}

function embedbuilder(
  client,
  deletetime,
  message,
  color,
  title,
  description,
  thumbnail,
  author
) {
  try {
    if (title.includes("filter") && title.includes("Adding")) {
      client.infos.set(
        "global",
        Number(client.infos.get("global", "filters")) + 1,
        "filters"
      );
    }
  } catch {}
  try {
    let embed = new Discord.MessageEmbed()
      .setColor(color)
      .setFooter("Coded By Tech Boy Gaming")
      .setAuthor(message.author.tag);
    if (title) embed.setTitle(title);
    if (description) embed.setDescription(description);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (author) embed.setAuthor(author);
    if (!deletetime || deletetime === undefined || deletetime === "null") {
      message.channel.send(embed).then((msg) => {
        try {
          if (msg.channel.type === "news") msg.crosspost();
        } catch (error) {
          console.log(error);
          errorbuilder(error.stack.toString().substr(0, 2000));
        }
      });
      return;
    }
    return message.channel.send(embed).then((msg) =>
      msg.delete({
        timeout: deletetime,
      })
    );
  } catch (error) {
    embedbuilder(
      client,
      5000,
      message,
      "RED",
      "ERROR: ",
      "```" +
        error.toString().substr(0, 100) +
        "```" +
        "\n\n**Error got sent to my owner!**"
    );
    errorbuilder(error.stack.toString().substr(0, 2000));
  }
}

function errorbuilder(error) {
  console.log(error);
}

function QueueEmbed(client, queue) {
  try {
    let embeds = [];
    let k = 10;
    //defining each Pages
    for (let i = 0; i < queue.songs.length; i += 10) {
      let qus = queue.songs;
      const current = qus.slice(i, k);
      let j = i;
      k += 10;
      const info = current
        .map(
          (track) =>
            `**${j++} -** [\`${track.name}\`](${track.url}) - \`${
              track.formattedDuration
            }\``
        )
        .join("\n");
      const embed = new Discord.MessageEmbed()
        .setTitle("Server Queue")
        .setColor(config.colors.yes)
        .setDescription(
          `**Current Song - [\`${qus[0].name}\`](${qus[0].url})**\n\n${info}`
        )
        .setFooter(client.user.username + client.user.displayAvatarURL());
      embeds.push(embed);
    }
    //returning the Embed
    return embeds;
  } catch (error) {
    console.log(error);
    errorbuilder(error.stack.toString().substr(0, 2000));
  }
}

function customplaylistembed(client, message, lyrics, song) {
  if (!lyrics) lyrics = "No Songs in the playlist!";
  try {
    let embeds = [];
    let k = 1000;
    for (let i = 0; i < lyrics.length; i += 1000) {
      const current = lyrics.slice(i, k);
      k += 1000;
      const embed = new Discord.MessageEmbed()
        .setTitle("Custom Playlist")
        .setColor(config.colors.yes)
        .setDescription(current)
        .setFooter(client.user.username + client.user.displayAvatarURL());
      embeds.push(embed);
    }
    return embeds;
  } catch (error) {
    console.log(error);
    embedbuilder(
      client,
      5000,
      message,
      "RED",
      "ERROR: ",
      "```" +
        error.toString().substr(0, 100) +
        "```" +
        "\n\n**Error got sent to my owner!**"
    );
    errorbuilder(error.stack.toString().substr(0, 2000));
  }
}
function lyricsEmbed(client, message, song) {
  try {
    const lyricsFinder = require("lyrics-finder");
    let embeds = [];
    const args = message.content.substring(config.prefix.length).split(" ");
    let queue = client.distube.getQueue(message);
    let cursong = queue.songs[0];
    let lyrics = lyricsFinder(cursong);
    let k = 1000;
    for (let i = 0; i < lyrics.length; i += 1000) {
      const current = lyrics.slice(i, k);
      k += 1000;
      const embed = new Discord.MessageEmbed()
        .setTitle("Lyrics - " + song.name)
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .setColor(config.colors.yes)
        .setDescription(current)
        .setFooter("Made By Kabir Jaipal aka Tech Boy Gaming");
      embeds.push(embed);
    }
    return embeds;
  } catch (error) {
    console.log(error);
    embedbuilder(
      client,
      5000,
      message,
      "RED",
      "ERROR: ",
      "```" +
        error.toString().substr(0, 100) +
        "```" +
        "\n\n**Error got sent to my owner!**"
    );
    errorbuilder(error.stack.toString().substr(0, 2000));
  }
}
async function playsongyes(client, message, queue, song) {
  try {
    let embed1 = new Discord.MessageEmbed()

      .setColor(config.colors.yes)
      .setTitle("🎶 Playing Song!")
      .setDescription(`Song: [\`${song.name}\`](${song.url})`)
      .addField("`🩸 Requested by:", `>>> ${song.user}`, true)
      .addField(
        "⏱ Duration:",
        `>>> \`${queue.formattedCurrentTime} / ${song.formattedDuration}\``,
        true
      )
      .addField(
        "🌀 Queue:",
        `>>> \`${queue.songs.length} song(s) - ${queue.formattedDuration}\``,
        true
      )
      .addField("🔊 Volume:", `>>> \`${queue.volume} %\``, true)
      .addField("👀 Views:", `>>> \`${song.views.toLocaleString()}\``, true)
      .addField(
        "♾ Loop:",
        `>>> ${
          queue.repeatMode
            ? queue.repeatMode === 2
              ? "✅ Queue"
              : "✅ Song"
            : "❌"
        }`,
        true
      )
      .addField("↪️ Autoplay:", `>>> ${queue.autoplay ? "✅" : "❌"}`, true)
      .addField("❔ Filter:", `>>> \`${queue.filter || "❌"}\``, true)
      .setFooter("Made By Kabir Jaipal aka Tech Boy Gaming")
      .setAuthor(
        message.author.tag,
        message.member.user.displayAvatarURL({
          dynamic: true,
        })
      )
      .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`);

    var playingMessage = await message.channel.send(embed1);

    client.settings.set(message.guild.id, playingMessage.id, "playingembed");
    client.settings.set(message.guild.id, message.channel.id, "playingchannel");

    try {
      await playingMessage.react("⏭");
      await playingMessage.react("⏯");
      await playingMessage.react("🔉");
      await playingMessage.react("🔊");
      await playingMessage.react("🔇");
      await playingMessage.react("🔁");
      await playingMessage.react("⏹");
      await playingMessage.react("🎵");
    } catch (error) {
      embedbuilder(
        client,
        5000,
        message,
        config.colors.no,
        "ERROR: ",
        "```" +
          error.toString().substr(0, 100) +
          "```" +
          "\n\n**Error got sent to my owner!**"
      );
      errorbuilder(error.stack.toString().substr(0, 2000));
      console.log(error);
    }
    const filter = (reaction, user) =>
      ["⏭", "⏯", "🔉", "🔊", "🔇", "⏹", "🎵"].includes(
        reaction.emoji.id || reaction.emoji.name
      ) && user.id !== message.client.user.id;

    var collector = await playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000,
    });
    collector.on("collect", async (reaction, user) => {
      //return if no queue available
      if (!queue) return;

      //create member out of the user
      const member = reaction.message.guild.member(user);

      //remoe the reaction
      reaction.users.remove(user);

      //if member not connected, return error
      if (!member.voice.channel)
        return embedbuilder(
          client,
          3000,
          message,
          config.colors.no,
          "`" + message.author.tag + "`" + " You must join a Voice Channel"
        );

      //if member is not same vc as bot return error
      if (member.voice.channel.id !== member.guild.me.voice.channel.id)
        return embedbuilder(
          client,
          3000,
          message,
          config.colors.no,
          "`" + message.author.tag + "`" + " You must join my Voice Channel"
        );

      switch (reaction.emoji.id || reaction.emoji.name) {
        case "⏭":
          queue.playing = true;
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.connection.dispatcher.end();
          embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            "SKIPPED!",
            `Skipped the song`
          );
          collector.stop();
          break;

        case "⏯":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.playing) {
            queue.playing = !queue.playing;
            // queue.connection.dispatcher.pause(true);
            client.distube.pause(message);
            embedbuilder(
              client,
              3000,
              message,
              config.colors.yes,
              "PAUSHED!",
              `⏸ paused the music`
            );
          } else {
            queue.playing = !queue.playing;
            // queue.connection.dispatcher.resume();
            client.distube.resume(message);
            embedbuilder(
              client,
              3000,
              message,
              config.colors.yes,
              "RESUMED!",
              `▶ resumed the music!`
            );
          }
          break;

        case "🔇":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.volume <= 0) {
            queue.volume = 100;
            queue.connection.dispatcher.setVolumeLogarithmic(100 / 100);
            embedbuilder(
              client,
              3000,
              message,
              config.colors.yes,
              "UNMUTED!",
              `🔊 unmuted the music!`
            );
          } else {
            queue.volume = 0;
            queue.connection.dispatcher.setVolumeLogarithmic(0);
            embedbuilder(
              client,
              3000,
              message,
              config.colors.yes,
              "MUTED!",
              `🔇 muted the music!`
            );
          }
          break;

        case "🔉":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.volume - 10 <= 0) queue.volume = 0;
          else queue.volume = queue.volume - 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          queue.textChannel;
          embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            `🔉 decreased the volume, the volume is now ${queue.volume}%`
          );
          break;

        case "🔊":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.volume + 10 >= 100) queue.volume = 100;
          else queue.volume = queue.volume + 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            `🔊 increased the volume, the volume is now ${queue.volume}%`
          );
          break;

        case "🔁":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.loop = !queue.loop;
          embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            `Loop is now ${queue.loop ? "**on**" : "**off**"}`
          );
          break;

        case "⏹":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.songs = [];
          embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            `⏹ stopped the music!`
          );
          try {
            queue.connection.dispatcher.end();
          } catch (error) {
            console.error(error);
            queue.connection.disconnect();
          }
          collector.stop();
          break;

        default:
          reaction.users.remove(user).catch(console.error);
          break;
        case "🎵":
          reaction.users.remove(user).catch(console.error);
          const song = queue.songs[0];
          //get current song duration in s
          //get thumbnail
          let thumb;
          if (song.thumbnail === undefined)
            thumb =
              "https://cdn.discordapp.com/attachments/778600026280558617/781024479623118878/ezgif.com-gif-maker_1.gif";
          else thumb = song.thumbnail.url;
          //define current time
          const seek =
            (queue.connection.dispatcher.streamTime -
              queue.connection.dispatcher.pausedTime) /
            1000;
          //define embed
          embedbuilder(
            client,
            8000,
            message,
            config.colors.yes,
            "♪Now playing♪",
            +song.thumbnail.url + `[**${song.name}**](${song.url})`
          );

          break;
      }
    });
    collector.on("end", () => {
      playingMessage.reactions.removeAll();
      playingMessage.delete({
        timeout: 7200,
      });
    });
  } catch (error) {
    console.log(error);
    embedbuilder(
      client,
      5000,
      message,
      config.colors.no,
      "ERROR: ",
      "```" +
        error.toString().substr(0, 100) +
        "```" +
        "\n\n**Error got sent to my owner!**"
    );
    errorbuilder(error.stack.toString().substr(0, 2000));
  }
}
function curembed(client, message) {
  try {
    let queue = client.distube.getQueue(message); //get the current queue
    let song = queue.songs[0];
    embed = new Discord.MessageEmbed()
      .setColor(config.colors.yes)
      .setTitle("🎶 Playing Song!")
      .setDescription(`Song: [\`${song.name}\`](${song.url})`)
      .addField("`🩸 Requested by:", `>>> ${song.user}`, true)
      .addField(
        "⏱ Duration:",
        `>>> \`${queue.formattedCurrentTime} / ${song.formattedDuration}\``,
        true
      )
      .addField(
        "🌀 Queue:",
        `>>> \`${queue.songs.length} song(s) - ${queue.formattedDuration}\``,
        true
      )
      .addField("🔊 Volume:", `>>> \`${queue.volume} %\``, true)
      .addField(
        "♾ Loop:",
        `>>> ${
          queue.repeatMode
            ? queue.repeatMode === 2
              ? "✅ Queue"
              : "✅ Song"
            : "❌"
        }`,
        true
      )
      .addField("↪️ Autoplay:", `>>> ${queue.autoplay ? "✅" : "❌"}`, true)
      .addField("❔ Filter:", `>>> \`${queue.filter || "❌"}\``, true)
      .setFooter("Made By Kabir Jaipal aka Tech Boy Gaming")
      .setAuthor(
        message.author.tag,
        message.member.user.displayAvatarURL({
          dynamic: true,
        })
      )
      .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`);
    return embed; //sending the new embed back
  } catch (error) {
    console.log(error);
    embedbuilder(
      5000,
      message,
      config.colors.no,
      "ERROR: ",
      "```" +
        error.toString().substr(0, 100) +
        "```" +
        "\n\n**Error got sent to my owner!**"
    );
    errorbuilder(error.stack.toString().substr(0, 2000));
  }
}

function delay(delayInms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
