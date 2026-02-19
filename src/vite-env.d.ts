/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_API_KEY: string;
    readonly VITE_API_URL: string;
    // other env vars...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }