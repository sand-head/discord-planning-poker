import {
  createSlashCommand,
  deleteSlashCommand,
  executeSlashCommand,
  ExecuteSlashCommandOptions,
  getSlashCommands,
  InteractionCommandPayload,
  InteractionResponseType,
  SlashCommand,
} from "../../deps.ts";
import { botCache } from "./cache.ts";

const failureResponse: ExecuteSlashCommandOptions = {
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: "Uh oh! Something bad happened, please let the devs know!",
  },
};

export const logCommand = () => {
};

export const syncCommands = async (prune: boolean = true) => {
  // ok first, let's see what commands discord has for us
  const globalCommands = await getSlashCommands() as SlashCommand[];
  console.info(`Found ${globalCommands.length} pre-existing slash command(s).`);

  // now we'll add all our commands
  // we'll keep track of the names that did get used
  // and also swap cache entries to use IDs instead of names as keys
  const usedCommandNames: string[] = [];
  const theBeforeCache = new Map(botCache.commands);
  botCache.commands.clear();

  for (let [name, command] of theBeforeCache) {
    const slashCommand = await createSlashCommand({
      ...command,
    }) as SlashCommand;

    usedCommandNames.push(name);
    botCache.commands.set(slashCommand.id, command);
  }

  if (prune) {
    // if we've set to prune unused commands, let's do that!
    const unusedCommands = globalCommands.filter((c) =>
      !usedCommandNames.includes(c.name)
    );
    for (let unusedCommand of unusedCommands) {
      await deleteSlashCommand(unusedCommand.id);
    }
    console.info(
      `Synced ${usedCommandNames.length} command(s) and pruned ${unusedCommands.length}.`,
    );
  } else {
    console.info(`Synced ${usedCommandNames.length} command(s).`);
  }
};

export const handleSlashCommands = async (
  payload: InteractionCommandPayload,
) => {
  const { id } = payload.data!;
  const command = botCache.commands.get(id);
  if (!command) {
    console.error("could not find command", payload);
    executeSlashCommand(payload.id, payload.token, failureResponse);
    return;
  }

  try {
    // todo: args
    const response = await command.handle(payload, {});
    // todo: log
    executeSlashCommand(payload.id, payload.token, response);
  } catch (err) {
    // todo: log
    executeSlashCommand(payload.id, payload.token, failureResponse);
  }
};
