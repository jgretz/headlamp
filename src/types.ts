export type Bulb = {
  id: string;
  model: string;
  address: string;
  remotePort: number;
};

export type BulbMode = 'white' | 'color';

export type BulbColor = {
  r: number;
  g: number;
  b: number;
};

export type BulbState = {
  on: boolean;
  mode: BulbMode;
  color: BulbColor;
};
