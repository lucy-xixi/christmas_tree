
export interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  wind: number;
}

export enum GreetingState {
  IDLE = 'IDLE',
  ANIMATING = 'ANIMATING',
  SHOW_BUBBLE = 'SHOW_BUBBLE'
}

// Ambient declarations for modules loaded via esm.sh
declare module 'framer-motion';
declare module 'lucide-react';

// Declare process global to avoid TS2591 and TS2688 errors in browser environments
declare global {
  /**
   * We augment the existing 'Process' interface to include our environment variables.
   * This avoids "Subsequent variable declarations must have the same type" errors
   * when the environment already provides a global 'process' variable.
   */
  interface ProcessEnv {
    API_KEY?: string;
    [key: string]: string | undefined;
  }

  interface Process {
    env: ProcessEnv;
  }

  // The 'process' global variable is already defined as type 'Process' in this environment.
}

export {};
