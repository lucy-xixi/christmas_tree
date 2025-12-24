
export interface Ornament {
  id: string;
  type: 'ball' | 'star' | 'bell' | 'candy';
  color: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export interface TreeState {
  baseImage: string;
  isCustomized: boolean;
  ornaments: Ornament[];
  isLit: boolean;
  snowEnabled: boolean;
}

export enum AppStatus {
  IDLE = 'idle',
  EDITING = 'editing',
  GENERATING = 'generating',
  ERROR = 'error'
}
