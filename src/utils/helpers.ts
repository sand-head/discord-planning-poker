import { InternalSlashCommand } from '../../types/commands.ts';
import { botCache } from './cache.ts';

export const createCommand = (command: InternalSlashCommand) => {
  if (command.name.length <= 3)
    throw new Error(`Command ${command.name} must have a length greater than 3 characters.`);
  else if (command.name.length >= 32)
    throw new Error(`Command ${command.name} must have a length less than 32 characters.`);
  botCache.commands.set(command.name, command);
}

let uniqueFilePathCounter = 0;
export async function importDirectory(path: string) {
  const files = Deno.readDirSync(Deno.realPathSync(path));

  for (const file of files) {
    if (!file.name) continue;

    const currentPath = `${path}/${file.name}`;
    if (file.isFile) {
      await import(`file:///${currentPath}#${uniqueFilePathCounter}`);
      continue;
    }

    importDirectory(currentPath);
  }
  uniqueFilePathCounter++;
}