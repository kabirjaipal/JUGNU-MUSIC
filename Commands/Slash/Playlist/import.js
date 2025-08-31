const { ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const Store = require("../../../handlers/PlaylistStore");

module.exports = {
  name: "playlistimport",
  description: `Import a playlist from a JSON attachment`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Playlist",
  cooldown: 3,
  type: ApplicationCommandType.ChatInput,
  options: [
    { name: "name", description: "Target playlist name", type: ApplicationCommandOptionType.String, required: true, autocomplete: true },
    { name: "json", description: "Raw JSON (optional if attachment)", type: ApplicationCommandOptionType.String, required: false },
    { name: "attachment", description: "JSON file", type: ApplicationCommandOptionType.Attachment, required: false },
  ],
  run: async (client, interaction) => {
    const targetName = interaction.options.getString("name");
    const jsonStr = interaction.options.getString("json");
    const att = interaction.options.getAttachment("attachment");
    try {
      let content = jsonStr || null;
        if (!content && att && att.size < 1024 * 1024) {
          const res = await fetch(att.url);
          content = await res.text();
      }
      if (!content) return client.embed(interaction, `${client.config.emoji.ERROR} Provide JSON string or attach a JSON file.`);
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
      if (!tracks.length) return client.embed(interaction, `${client.config.emoji.ERROR} No valid tracks found in JSON.`);
      const exists = await Store.get(client, interaction.guild.id, interaction.user.id, targetName);
      if (!exists) await Store.create(client, interaction.guild.id, interaction.user.id, targetName, tracks);
      else await Store.addTracks(client, interaction.guild.id, interaction.user.id, targetName, tracks);
        return client.embed(interaction, `${client.config.emoji.SUCCESS} Imported ${tracks.length} track(s) into \`${targetName}\`.`);
    } catch (e) {
      return client.embed(interaction, `${client.config.emoji.ERROR} Failed to import: ${e.message}`);
    }
  },
  autocomplete: async (client, interaction) => {
    const focused = interaction.options.getFocused()?.toLowerCase?.() || "";
    const alls = await Store.getAll(client, interaction.guild.id, interaction.user.id);
    const choices = alls.map(p => p.name).filter(Boolean);
    const filtered = choices.filter(c => c.toLowerCase().includes(focused)).slice(0, 25);
    await interaction.respond(filtered.map(n => ({ name: n, value: n })));
  }
};
