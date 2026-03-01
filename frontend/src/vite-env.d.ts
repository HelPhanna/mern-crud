/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Add all other VITE_ variables you use here
  // readonly VITE_SOME_KEY: string;
  // readonly VITE_APP_NAME: string;
  // etc...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
