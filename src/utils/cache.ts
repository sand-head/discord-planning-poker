import { SlashArgument, InternalSlashCommand, SlashInhibitor } from '../../types/commands.ts';

export const botCache = {
  arguments: new Map<string, SlashArgument>(),
  commands: new Map<string, InternalSlashCommand>(),
  inhibitors: new Map<string, SlashInhibitor>()
};