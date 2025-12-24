
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

// Fix: Removed redundant and conflicting ambient declarations for framer-motion, lucide-react, and process global.
// These are already defined by the environment or library types, causing "subsequent variable declaration" errors.
