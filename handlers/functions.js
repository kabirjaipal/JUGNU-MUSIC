const {
  Interaction,
  Collection,
  MessageActionRow,
  MessageButton,
  ButtonInteraction,
  CommandInteraction,
  Client,
} = require("discord.js");
const ee = require("../settings/embed.json");
const { Song, Queue } = require("distube");
const client = require("../index");

/**
 *
 * @param {Interaction} interaction
 * @param {Object} cmd
 */
function cooldown(interaction, cmd) {
  if (!interaction || !cmd) return;
  let { client, member } = interaction;
  if (!client.cooldowns.has(cmd.name)) {
    client.cooldowns.set(cmd.name, new Collection());
  }
  const now = Date.now();
  const timestamps = client.cooldowns.get(cmd.name);
  const cooldownAmount = cmd.cooldown * 1000;
  if (timestamps.has(member.id)) {
    const expirationTime = timestamps.get(member.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000; //get the lefttime
      //return true
      return timeLeft;
    } else {
      timestamps.set(member.id, now);
      setTimeout(() => timestamps.delete(member.id), cooldownAmount);
      return false;
    }
  } else {
    timestamps.set(member.id, now);
    setTimeout(() => timestamps.delete(member.id), cooldownAmount);
    return false;
  }
}

function databasing(guildid, userid) {
  if (guildid) {
    client.settings.ensure(guildid, {
      defautoplay: false,
      djroles: [],
      djonly: false,
    });
    client.music.ensure(guildid, {
      enable: false,
      channel: "",
      playmsg: "",
      queuemsg: "",
    });
  }
}

/**
 *
 * @param {CommandInteraction} interaction
 * @param {String[]} embeds
 * @returns
 */
async function swap_pages(interaction, embeds) {
  let currentPage = 0;
  let allbuttons = new MessageActionRow().addComponents([
    new MessageButton().setStyle("SECONDARY").setCustomId("0").setEmoji(`⏪`),
    new MessageButton().setStyle("PRIMARY").setCustomId("1").setEmoji(`◀️`),
    new MessageButton().setStyle("DANGER").setCustomId("2").setEmoji(`🗑`),
    new MessageButton().setStyle("PRIMARY").setCustomId("3").setEmoji(`▶️`),
    new MessageButton().setStyle("SECONDARY").setCustomId("4").setEmoji(`⏩`),
  ]);
  //Send message with buttons
  let swapmsg = await interaction.channel.send({
    embeds: [embeds[0]],
    components: [allbuttons],
  });
  //create a collector for the thinggy
  const collector = swapmsg.createMessageComponentCollector({
    time: 2000 * 60,
  });
  collector.on("collect", async (b) => {
    if (b.isButton()) {
      await b.deferUpdate().catch((e) => {});
      // page first
      if (b.customId == "0") {
        await b.deferUpdate().catch((e) => {});
        if (currentPage !== 0) {
          currentPage = 0;
          await swapmsg.edit({
            embeds: [embeds[currentPage]],
            components: [allbuttons],
          });
          await b.deferUpdate().catch((e) => {});
        }
      }
      //page forward
      if (b.customId == "1") {
        await b.deferUpdate().catch((e) => {});
        if (currentPage !== 0) {
          currentPage -= 1;
          await swapmsg.edit({
            embeds: [embeds[currentPage]],
            components: [allbuttons],
          });
          await b.deferUpdate().catch((e) => {});
        } else {
          currentPage = embeds.length - 1;
          await swapmsg.edit({
            embeds: [embeds[currentPage]],
            components: [allbuttons],
          });
          await b.deferUpdate().catch((e) => {});
        }
      }
      //go home
      else if (b.customId == "2") {
        try {
          allbuttons.components.forEach((btn) => btn.setDisabled(true));
          swapmsg.edit({
            embeds: [embeds[currentPage]],
            components: [allbuttons],
          });
        } catch (e) {}
      }
      //go forward
      else if (b.customId == "3") {
        if (currentPage < embeds.length - 1) {
          currentPage++;
          await swapmsg.edit({
            embeds: [embeds[currentPage]],
            components: [allbuttons],
          });
        } else {
          currentPage = 0;
          await swapmsg.edit({
            embeds: [embeds[currentPage]],
            components: [allbuttons],
          });
        }
      }
      // page last
      if (b.customId == "4") {
        currentPage = embeds.length - 1;
        await swapmsg.edit({
          embeds: [embeds[currentPage]],
          components: [allbuttons],
        });
      }
    }
  });

  collector.on("end", () => {
    allbuttons.components.forEach((btn) => btn.setDisabled(true));
    swapmsg.edit({ components: [allbuttons] });
  });
}

/**
 *
 * @param {Client} client
 * @param {GuildMember} member
 * @param {Song} song
 * @returns
 */

function check_dj(client, member, song) {
  //if no message added return
  if (!client) return false;
  //get the adminroles
  var roleid = client.settings.get(member.guild.id, "djroles");
  let djonly = client.settings.get(member.guild.id, "djonly");
  //if no dj roles return false, so that it continues
  if (String(roleid) == "") return false;

  //define variables
  var isdj = false;
  //loop through the roles
  for (let i = 0; i < roleid.length; i++) {
    //if the role does not exist, then skip this current loop run
    if (!member.guild.roles.cache.get(roleid[i])) continue;
    //if he has role set var to true
    if (member.roles.cache.has(roleid[i])) isdj = true;
    //add the role to the string
  }
  //if no dj and not an admin, return the string
  if (
    !isdj &&
    !member.permissions.has("ADMINISTRATOR") &&
    song.user.id != member.id
  )
    return roleid.map((i) => `<@&${i}>`).join(", ");
  //if he is a dj or admin, then return false, which will continue the cmd
  else return false;
}

/**
 *
 * @param {*} duration Number | Time in Milliseconds
 * @returns Object of Formatted Time in Days to milliseconds
 */
function parseDuration(duration) {
  let remain = duration;
  let days = Math.floor(remain / (1000 * 60 * 60 * 24));
  remain = remain % (1000 * 60 * 60 * 24);

  let hours = Math.floor(remain / (1000 * 60 * 60));
  remain = remain % (1000 * 60 * 60);

  let minutes = Math.floor(remain / (1000 * 60));
  remain = remain % (1000 * 60);

  let seconds = Math.floor(remain / 1000);
  remain = remain % 1000;

  let milliseconds = remain;

  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
}

/**
 *
 * @param {*} o Object of Time from days to nanoseconds/milliseconds
 * @param {*} useMilli Optional Boolean parameter, if it should use milliseconds or not in the showof
 * @returns Formatted Time
 */
function formatTime(o, useMilli = false) {
  let parts = [];
  if (o.days) {
    let ret = o.days + " Day";
    if (o.days !== 1) {
      ret += "s";
    }
    parts.push(ret);
  }
  if (o.hours) {
    let ret = o.hours + " Hr";
    if (o.hours !== 1) {
      ret += "s";
    }
    parts.push(ret);
  }
  if (o.minutes) {
    let ret = o.minutes + " Min";
    if (o.minutes !== 1) {
      ret += "s";
    }
    parts.push(ret);
  }
  if (o.seconds) {
    let ret = o.seconds + " Sec";
    if (o.seconds !== 1) {
      ret += "s";
    }
    parts.push(ret);
  }
  if (useMilli && o.milliseconds) {
    let ret = o.milliseconds + " ms";
    parts.push(ret);
  }
  if (parts.length === 0) {
    return "instantly";
  } else {
    return parts;
  }
}

/**
 *
 * @param {*} duration Number | Time in Millisceonds
 * @param {*} useMilli Optional Boolean parameter, if it should use milliseconds or not in the showof
 * @returns Formatted Time
 */
function duration(duration, useMilli = false) {
  let time = parseDuration(duration);
  return formatTime(time, useMilli);
}

/**
 *
 * @param {Queue} queue
 * @returns
 */
function createBar(queue) {
  try {
    let length = 15;
    let index = Math.round(
      (queue.currentTime / queue.songs[0].duration) * length
    );
    let indicator = "🔘";
    let line = "▬";
    if (index >= 1 && index <= length) {
      let bar = line.repeat(length - 1).split("");
      bar.splice(index, 0, indicator);
      let timestamp = queue.formattedCurrentTime;
      return `\`${timestamp}\` | ${bar.join("")} | \`${
        queue.songs[0].formattedDuration
      }\``;
      // return `${bar.join("")}`;
    } else {
      return `${indicator}${line.repeat(length - 1)}`;
    }
  } catch (e) {
    console.log(e);
  }
}

function shuffle(a) {
  try {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  } catch (e) {
    console.log(String(e.stack));
  }
}

module.exports = {
  cooldown,
  databasing,
  swap_pages,
  check_dj,
  parseDuration,
  formatTime,
  duration,
  createBar,
  shuffle,
};
