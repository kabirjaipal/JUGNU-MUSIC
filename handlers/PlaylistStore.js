const MAX_TRACKS_PER_PLAYLIST = 500;

/**
 * Utilities for storing user playlists in client.music (JoshDB)
 * Data shape (per guild):
 *   key: `${guildId}.playlists.${userId}` -> { [playlistName: string]: Array<Track> }
 */
module.exports = {
  /**
   * Ensure the user playlists object exists and return it
   */
  async getAll(client, guildId, userId) {
    const key = `${guildId}.playlists.${userId}`;
    await client.music.ensure(key, {});
    return (await client.music.get(key)) || {};
  },

  /**
   * Get a single playlist array by name (case-sensitive store, case-insensitive lookup)
   */
  async get(client, guildId, userId, name) {
    const all = await this.getAll(client, guildId, userId);
    const entry = Object.entries(all).find(([n]) => n.toLowerCase() === String(name).toLowerCase());
    return entry ? { name: entry[0], tracks: entry[1] || [] } : null;
  },

  /** Create a playlist if missing */
  async create(client, guildId, userId, name) {
    const key = `${guildId}.playlists.${userId}`;
    const all = await this.getAll(client, guildId, userId);
    if (!all[name]) {
      all[name] = [];
      await client.music.set(key, all);
    }
    return { name, tracks: all[name] };
  },

  /** Add one or many tracks to a playlist */
  async addTracks(client, guildId, userId, name, tracks) {
    const key = `${guildId}.playlists.${userId}`;
    const all = await this.getAll(client, guildId, userId);
    const existing = all[name] || [];
    // Deduplicate by url (preferred) else by name+duration
    const seen = new Set(
      existing.map((t) => (t?.url ? `u:${t.url}` : `n:${(t?.name || '').toLowerCase()}|${t?.duration || 0}`))
    );
    const filtered = [];
    for (const t of tracks) {
      const keyStr = t?.url ? `u:${t.url}` : `n:${(t?.name || '').toLowerCase()}|${t?.duration || 0}`;
      if (seen.has(keyStr)) continue;
      seen.add(keyStr);
      filtered.push(t);
      if (existing.length + filtered.length >= MAX_TRACKS_PER_PLAYLIST) break;
    }
    const merged = existing.concat(filtered).slice(0, MAX_TRACKS_PER_PLAYLIST);
    all[name] = merged;
    await client.music.set(key, all);
    return merged.length;
  },

  /** Remove a track by 1-based index; returns removed track or null */
  async removeTrack(client, guildId, userId, name, index1) {
    const key = `${guildId}.playlists.${userId}`;
    const all = await this.getAll(client, guildId, userId);
    const list = all[name] || [];
    const idx = Number(index1) - 1;
    if (idx < 0 || idx >= list.length) return null;
    const [removed] = list.splice(idx, 1);
    all[name] = list;
    await client.music.set(key, all);
    return removed || null;
  },

  /** Delete a playlist; returns true if deleted */
  async delete(client, guildId, userId, name) {
    const key = `${guildId}.playlists.${userId}`;
    const all = await this.getAll(client, guildId, userId);
    if (!all[name]) return false;
    delete all[name];
    await client.music.set(key, all);
    return true;
  },

  /** Rename a playlist; returns true if renamed */
  async rename(client, guildId, userId, oldName, newName) {
    const key = `${guildId}.playlists.${userId}`;
    const all = await this.getAll(client, guildId, userId);
    if (!all[oldName]) return false;
    if (all[newName]) return false; // don't overwrite
    all[newName] = all[oldName];
    delete all[oldName];
    await client.music.set(key, all);
    return true;
  },

  /** Serialize a DisTube Song to a plain Track object */
  serializeSong(song, user) {
    if (!song) return null;
    return {
      name: song.name || song.playlist?.name || "Unknown",
      url: song.url,
      duration: song.duration || 0,
      formattedDuration: song.formattedDuration || null,
      thumbnail: song.thumbnail || null,
      uploader: song.uploader?.name || null,
      source: song.source || null,
      requestedBy: user?.id || null,
      savedAt: Date.now(),
    };
  },
};
