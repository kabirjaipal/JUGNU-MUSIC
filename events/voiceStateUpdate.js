const { ChannelType, Colors } = require("discord.js");
const client = require("../index");
const { msToDuration } = require("../handlers/functions");

const leaveTimeout = client.config.options.leaveTimeout;

client.on("voiceStateUpdate", async (oldState, newState) => {
  if (!newState.guild || newState.member.user.bot) return;
  const queue = client.distube.getQueue(newState.guild);

  // Auto speak in stage channel
  if (
    newState.channelId &&
    newState.channel.type === ChannelType.GuildStageVoice &&
    newState.guild.me.voice.suppress
  ) {
    try {
      await newState.guild.me.voice.setSuppressed(false);
    } catch (error) {
      console.error("Failed to unsuppress bot's voice:", error);
    }
  }

  if (!queue) return;
  const db = await client.music?.get(`${queue.textChannel.guildId}.vc`);

  // 24/7 music system
  try {
    const twentyFourSevenEnabled = db?.enable;

    if (!twentyFourSevenEnabled && oldState.channel && !newState.channel) {
      // If not in 24/7 mode and someone leaves the voice channel
      const channel = queue.voiceChannel;
      if (!channel) return;

      const members = channel.members.filter((m) => !m.user.bot);

      if (members.size < 1) {
        // Send message that the bot will leave the voice channel in given time if 24/7 mode is not enabled
        const textChannel = queue.textChannel;
        const msg = await textChannel.send({
          embeds: [
            {
              description: `I will leave the voice channel in \`${msToDuration(
                leaveTimeout
              )}\` if 24/7 mode is not enabled.`,
              color: Colors.Red,
            },
          ],
        });
        setTimeout(() => msg.delete().catch(() => {}), 3000);
        // Only the bot is in the channel
        const leaveTimeoutHandle = setTimeout(async () => {
          await queue.stop();
          await client.editPlayerMessage(queue.textChannel);
          const leaveMsg = await textChannel.send({
            embeds: [
              {
                description: "I left the voice channel because I was alone.",
                color: Colors.Red,
              },
            ],
          });
          setTimeout(() => leaveMsg.delete().catch(() => {}), 3000);
        }, leaveTimeout);

        client.leaveTimeoutHandles.set(newState.guildId, leaveTimeoutHandle);
      }
    }

    // Clear leave timeout if someone joins the voice channel
    if (!twentyFourSevenEnabled && !oldState.channel && newState.channel) {
      const leaveTimeoutHandle = client.leaveTimeoutHandles.get(
        oldState.guildId
      );
      if (leaveTimeoutHandle) {
        clearTimeout(leaveTimeoutHandle); // Cancel the timeout
        client.leaveTimeoutHandles.delete(oldState.guildId); // Remove the handle from the map
      }
    }
  } catch (error) {
    console.log(`24/7 System Error: `, error);
  }
});
