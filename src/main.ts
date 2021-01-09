import { startBot, config } from '../deps.ts';
import { botCache } from "./utils/cache.ts";
import { handleSlashCommands, syncCommands } from "./utils/commandHandler.ts";
import { importDirectory } from "./utils/helpers.ts";

// load environment variables into Deno.env, exits if any missing
config({
  export: true,
  safe: true,
});

await importDirectory(Deno.realPathSync('./src/commands'));
console.log(`Loaded ${botCache.commands.size} command(s).`);

await startBot({
  token: Deno.env.get('BOT_TOKEN')!,
  intents: [],
  eventHandlers: {
    ready: async () => {
      console.log('Connected to gateway!');
      await syncCommands();
    },
    interactionCreate: handleSlashCommands
  }
});