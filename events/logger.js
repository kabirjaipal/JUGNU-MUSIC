const client = require("../index");

// client.on("debug", async (message) => {
//   console.log(message.toString());
// });

client.on("error", async (error) => {
  console.log(error);
});

// client.on("rateLimit", async (ratelimit) => {
//   console.log(JSON.stringify(ratelimit));
// });

// client.on("shardDisconnect", async (e, id) => {
//   console.log(
//     ` || <==> || [${String(new Date())
//       .split(" ", 5)
//       .join(" ")}] || <==> || Shard #${id} Disconnected || <==> ||`
//   );
// });

// client.on("shardError", async (e, id) => {
//   console.log(
//     ` || <==> || [${String(new Date())
//       .split(" ", 5)
//       .join(" ")}] || <==> || Shard #${id} Errored || <==> ||`
//   );
// });

// client.on("shardReady", async (id) => {
//   console.log(
//     ` || <==> || [${String(new Date())
//       .split(" ", 5)
//       .join(" ")}] || <==> || Shard #${id} Ready || <==> ||`
//   );
// });

// client.on("shardReconnecting", async (id) => {
//   console.log(
//     ` || <==> || [${String(new Date())
//       .split(" ", 5)
//       .join(" ")}] || <==> || Shard #${id} Reconnecting || <==> ||`
//   );
// });

// client.on("shardResume", async (id, e) => {
//   console.log(
//     ` || <==> || [${String(new Date())
//       .split(" ", 5)
//       .join(" ")}] || <==> || Shard #${id} Resumed || <==> ||`
//   );
// });

// client.on("warn", async (message) => {
//   console.log(message.toString());
// });
