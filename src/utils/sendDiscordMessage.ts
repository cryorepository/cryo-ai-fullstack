// utils/sendDiscordMessage.ts
import axios from 'axios';

const sendDiscordMessage = async (message: string): Promise<void> => {
  try {
    const webhook: string | undefined = process.env.DISCORD_WEBHOOK_TERMINAL;

    if (!webhook) {
      throw new Error('DISCORD_WEBHOOK_TERMINAL environment variable is not set');
    }

    const discordMessage = {
      content: message,
    };

    await axios.post(webhook, discordMessage);
  } catch (error) {
    console.error('Error sending message to Discord:', error);
  } finally {
    return;
  }
};

export default sendDiscordMessage;