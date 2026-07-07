import { useEffect, useRef } from 'react';
import Pusher from 'pusher-js';

/**
 * Custom hook to manage a Pusher connection and handle events robustly.
 * Keeps event handlers up-to-date without needing to re-bind on every render.
 */
function usePusher(channelName, events) {
  const pusherRef = useRef(null);
  const channelRef = useRef(null);
  
  // Use a ref for events so we don't re-bind if the function references change,
  // preventing memory leaks or missed events.
  const eventsRef = useRef(events);
  useEffect(() => {
    eventsRef.current = events;
  }, [events]);

  useEffect(() => {
    const pusherKey = process.env.REACT_APP_PUSHER_KEY;
    const pusherCluster = process.env.REACT_APP_PUSHER_CLUSTER;

    if (!pusherKey || !pusherCluster) {
      console.warn('⚠️ Pusher credentials missing. Real-time updates disabled.');
      return;
    }

    // Initialize Pusher only once
    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
    });
    pusherRef.current = pusher;

    // Subscribe to channel
    const channel = pusher.subscribe(channelName);
    channelRef.current = channel;

    // Bind all provided events dynamically
    Object.keys(eventsRef.current).forEach((eventName) => {
      channel.bind(eventName, (data) => {
        // Always call the most recent version of the handler
        if (eventsRef.current[eventName]) {
          eventsRef.current[eventName](data);
        }
      });
    });

    // Cleanup on unmount to prevent leaks
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [channelName]);

  return {
    pusher: pusherRef.current,
    channel: channelRef.current,
  };
}

export default usePusher;
