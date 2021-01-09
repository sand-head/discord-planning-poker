import { CreateSlashCommandOptions, ExecuteSlashCommandOptions, InteractionCommandPayload } from '../deps.ts';

export interface SlashArgument {
  /** The unique name of the argument. */
  name: string;
}

export type InternalSlashCommand = CreateSlashCommandOptions & {
  /** The command's handler function, which is executed when the command is run. */
  handle(payload: InteractionCommandPayload, args: any): Promise<ExecuteSlashCommandOptions>;
};

export interface SlashInhibitor {
  /** The unique name of the inhibitor. */
  name: string;
}