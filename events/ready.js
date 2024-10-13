import { ActivityType } from "discord.js";
import { client } from "../bot.js";

/**
 * Event listener for when the client becomes ready.
 * This event is emitted once the bot has successfully connected to Discord and is ready to start receiving events.
 * @event client#ready
 */
client.on("ready", async () => {
  try {
    // Log a message indicating that the client is ready
    console.log(`> ✅ ${client.user.tag} is now online`);

    // Set the activity for the client
    client.user.setActivity({
      name: `Coded By Kabir ❤️‍🔥`, // Set the activity name
      type: ActivityType.Watching, // Set the activity type
    });
  } catch (error) {
    // Log any errors that occur
    console.error("An error occurred in the ready event:", error);
  }
});

/**
 * Sets the bot's presence and activity when it becomes ready.
 * @module ReadyEvent
 */
