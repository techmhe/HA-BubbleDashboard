import { defineConfig } from 'vite';

// Local preview of the card with a mocked `hass` object (dev/index.html).
export default defineConfig({ root: 'dev', server: { port: 5173 } });
