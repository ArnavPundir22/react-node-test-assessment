const Pusher = require('pusher');

/**
 * Initializes and exports a singleton Pusher instance.
 * Gracefully degrades if credentials are not provided.
 */
class PusherClient {
  constructor() {
    this.client = null;
    this.initialize();
  }

  initialize() {
    const { PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER } = process.env;

    if (!PUSHER_APP_ID || !PUSHER_KEY || !PUSHER_SECRET || !PUSHER_CLUSTER) {
      console.warn('⚠️ Pusher credentials missing in environment variables. Real-time updates are disabled.');
      return;
    }

    try {
      this.client = new Pusher({
        appId: PUSHER_APP_ID,
        key: PUSHER_KEY,
        secret: PUSHER_SECRET,
        cluster: PUSHER_CLUSTER,
        useTLS: true,
      });
      console.log('Pusher initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Pusher:', error);
    }
  }

  /**
   * Safely triggers a Pusher event without crashing the application on failure.
   */
  async trigger(channel, event, data) {
    if (!this.client) return;

    try {
      await this.client.trigger(channel, event, data);
    } catch (error) {
      // Log the error but don't throw, ensuring the main API request still succeeds
      console.error(`[Pusher] Failed to trigger event ${event} on channel ${channel}:`, error.message);
    }
  }
}

// Export as a singleton
module.exports = new PusherClient();
