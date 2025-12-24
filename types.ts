
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

// Removed redundant ambient declarations for modules 'framer-motion' and 'lucide-react'
// because they are already defined in the environment. Redeclaring them with 'any'
// leads to "Subsequent variable declarations must have the same type" errors.

// Removed the global 'process' declaration as it conflicts with the built-in 'Process' type.
// The execution context already provides a properly typed 'process' global.

export {};
