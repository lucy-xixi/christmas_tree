
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
