// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true, // Allow access from other devices in the network
    port: 5173, // Use the default Vite port or change as needed
  },
  proxy: {
    '/socket.io': {
      target: 'http://192.168.1.238:3000',
      ws: true,
      changeOrigin: true,
    },
  },
});
