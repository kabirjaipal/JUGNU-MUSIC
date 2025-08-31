const { Message, PermissionFlagsBits } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const Store = require("../../../handlers/PlaylistStore");

module.exports = {
  name: "playlistimport",
  aliases: ["plimport"],
  description: `Import a playlist from a JSON attachment`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Playlist",
  cooldown: 3,
  run: async (client, message, args) => {
    // Expect a name and an attachment containing { name, tracks }
    const targetName = args.join(" ").trim();
    if (!targetName) return client.embed(message, `${client.config.emoji.ERROR} Provide a playlist name to import into.`);
    const attachment = message.attachments.first();
    let content = null;
    try {
      if (attachment && attachment.url && attachment.size < 1024 * 1024) {
        // fetch attachment content
        const res = await fetch(attachment.url);
        content = await res.text();
      } else if (message.content && message.content.includes("```")) {
        const code = message.content.split("```")[1] || "";
        content = code.trim();
      }
      if (!content) return client.embed(message, `${client.config.emoji.ERROR} Attach a JSON file or paste JSON in a code block.`);
      const data = JSON.parse(content);
      if (!data || !Array.isArray(data.tracks)) throw new Error("Invalid schema");
      const tracks = data.tracks
        .filter(t => t && (t.url || t.name) && (!t.duration || Number.isFinite(t.duration)))
        .map(t => ({
          name: (t.name || "").toString().slice(0, 256),
          url: t.url ? t.url.toString() : undefined,
          duration: typeof t.duration === "number" ? t.duration : undefined,
          uploader: t.uploader ? t.uploader.toString() : undefined,
          thumbnail: t.thumbnail ? t.thumbnail.toString() : undefined,
          source: t.source ? t.source.toString() : undefined,
        }));
      if (!tracks.length) return client.embed(message, `${client.config.emoji.ERROR} No valid tracks found in JSON.`);
      // create or add
      const exists = await Store.get(client, message.guild.id, message.author.id, targetName);
      if (!exists) {
        await Store.create(client, message.guild.id, message.author.id, targetName, tracks);
      } else {
        await Store.addTracks(client, message.guild.id, message.author.id, targetName, tracks);
      }
      return client.embed(message, `${client.config.emoji.SUCCESS} Imported ${tracks.length} track(s) into '${targetName}'.`);
    } catch (e) {
      return client.embed(message, `${client.config.emoji.ERROR} Failed to import: ${e.message}`);
    }
  },
};
