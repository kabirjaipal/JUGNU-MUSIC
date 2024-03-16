const { EmbedBuilder } = require("discord.js");
const JUGNU = require("./Client");
const { check_dj, skip } = require("./functions");

/**
 *
 * @param {JUGNU} client
 */
module.exports = async (client) => {
  // interaction handling
  try {
    client.on("interactionCreate", async (interaction) => {
      if (!interaction.guild || interaction.user.bot) return;
      if (interaction.isButton()) {
        await interaction.deferUpdate().catch((e) => {});
        const { customId, member } = interaction;
        let voiceMember = interaction.guild.members.cache.get(member.id);
        let channel = voiceMember.voice.channel;
        let queue = client.distube.getQueue(interaction.guildId);
        let checkDJ = await check_dj(
          client,
          interaction.member,
          queue?.songs[0]
        );

        switch (customId) {
          case "autoplay":
            {
              if (!channel) {
                return send(
                  interaction,
                  `** ${client.config.emoji.ERROR} You Need to Join Voice Channel**`
                );
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel `
                );
              } else if (!queue) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} i am Not Playing Right Now `
                );
              } else if (checkDJ) {
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS} You are not DJ and also you are not song requester..`
                );
              } else if (!queue.autoplay) {
                queue.toggleAutoplay();
                return send(
                  interaction,
                  ` ${client.config.emoji.SUCCESS} Autoplay Enabled !! `
                );
              } else {
                queue.toggleAutoplay();
                return send(
                  interaction,
                  ` ${client.config.emoji.SUCCESS} Autoplay is Disabled !!.`
                );
              }
            }
            break;
          case "skip":
            {
              if (!channel) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} You Need to Join Voice Channel`
                );
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel `
                );
              } else if (!queue) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} i am Not Playing Right Now `
                );
              } else if (checkDJ) {
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS} You are not DJ and also you are not song requester..`
                );
              } else {
                await skip(queue);
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS}  Song Skipped !!`
                );
              }
            }
            break;
          case "stop":
            {
              if (!channel) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} You Need to Join Voice Channel`
                );
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel `
                );
              } else if (!queue) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} i am Not Playing Right Now `
                );
              } else if (checkDJ) {
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS} You are not DJ and also you are not song requester..`
                );
              } else {
                await queue.stop().catch((e) => {});
                return send(
                  interaction,
                  ` ${client.config.emoji.SUCCESS} Song Stoped and Left Channel !!.`
                );
              }
            }
            break;
          case "pauseresume":
            {
              if (!channel) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} You Need to Join Voice Channel`
                );
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel `
                );
              } else if (!queue) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} i am Not Playing Right Now `
                );
              } else if (checkDJ) {
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS} You are not DJ and also you are not song requester..`
                );
              } else if (queue.paused) {
                await queue.resume();
                return send(
                  interaction,
                  ` ${client.config.emoji.SUCCESS} Queue Resumed!! `
                );
              } else if (!queue.paused) {
                await queue.pause();
                return send(
                  interaction,
                  ` ${client.config.emoji.SUCCESS} Queue Paused !! `
                );
              }
            }
            break;
          case "loop":
            {
              if (!channel) {
                return send(
                  interaction,
                  `${client.config.emoji.ERROR} You Need to Join Voice Channel`
                );
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return send(
                  interaction,
                  `${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel`
                );
              } else if (!queue) {
                return send(
                  interaction,
                  `${client.config.emoji.ERROR} I am Not Playing Right Now`
                );
              } else if (checkDJ) {
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS} You are not a DJ and also you are not the song requester..`
                );
              } else {
                switch (queue.repeatMode) {
                  case 0: // off
                    await queue.setRepeatMode(1);
                    return send(
                      interaction,
                      `${client.config.emoji.SUCCESS} Song Loop On !!`
                    );
                  case 1: // song
                    await queue.setRepeatMode(2);
                    return send(
                      interaction,
                      `${client.config.emoji.SUCCESS} Queue Loop On !!`
                    );
                  case 2: // queue
                    await queue.setRepeatMode(0);
                    return send(
                      interaction,
                      `${client.config.emoji.SUCCESS} Loop Off !!`
                    );
                  default:
                    return send(
                      interaction,
                      `${client.config.emoji.ERROR} Unknown loop mode`
                    );
                }
              }
            }
            break;

          default:
            break;
        }
      }
    });

    async function send(interaction, string) {
      interaction
        .followUp({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.embed.color)
              .setDescription(`> ${string.substring(0, 3000)}`)
              .setFooter(client.getFooter(interaction.user)),
          ],
          ephemeral: true,
        })
        .catch((e) => null);
    }
  } catch (e) {
    console.log(e);
  }
};
