const client = require("../index");
const { databasing } = require("../handlers/functions");

client.on("voiceStateUpdate", async (os, ns) => {
  if (!ns.guild || ns.member.user.bot) return;
  databasing(ns.guild.id, ns.member.id);

  // auto speak in stage channel
  if (
    ns.channelId &&
    ns.channel.type === "GUILD_STAGE_VOICE" &&
    ns.guild.me.voice.suppress
  ) {
    if (
      ns.guild.me.permissions.has("SPEAK") ||
      (ns.channel && ns.channel.permissionsFor(ns.guild.me).has("SPEAK"))
    ) {
      ns.guild.me.voice.setSuppressed(false).catch((e) => {});
    }
  }
});
