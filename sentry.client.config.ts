// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://2ebebd61ead2cdd4d2a6f816ec80438c@o4504181161656320.ingest.us.sentry.io/4507351787634688",
  // tunnel: "/api/sentry", // Temporarily disabled to test direct connection

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Temporarily disable replay to isolate the issue
  replaysOnErrorSampleRate: 0,
  replaysSessionSampleRate: 0,

  // Remove replay integration temporarily
  integrations: [],

  // Add beforeSend to handle potential issues
  beforeSend(event, hint) {
    // Log the event for debugging
    console.log("Sentry event:", event);
    return event;
  },
});
