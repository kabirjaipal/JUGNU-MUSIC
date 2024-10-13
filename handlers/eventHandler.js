import { readdir } from "node:fs/promises";

/**
 * Loads event handlers for the client.
 * @param {Bot} client - The client instance.
 */
export default async (client) => {
  try {
    let count = 0;

    const eventFiles = await readdir("./events");
    const eventFilesFiltered = eventFiles.filter((file) =>
      file.endsWith(".js")
    );

    await Promise.all(
      eventFilesFiltered.map(async (file) => {
        try {
          await import(`../events/${file}`).then((r) => r.default);
          count++;
        } catch (error) {
          console.error(`Error loading event from file ${file}:`, error);
          return 0;
        }
      })
    );

    console.log(`> ✅ Successfully loaded ${count} events.`);
  } catch (error) {
    console.error("An error occurred while reading the events folder:", error);
  }
};
