export type GetImageQuery = {
  id: string;
  os?: string; // user's operating system
  client?: string; // browser or e-mail client
  font?: string;
  isFontInstalled?: boolean;
  extra?: string;
};
