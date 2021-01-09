import { InteractionResponseType } from '../../deps.ts';
import { createCommand } from '../utils/helpers.ts';

createCommand({
  name: 'ping',
  description: 'Type /ping, get "Pong!"',
  handle: async () => {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'Pong!'
      }
    }
  }
});