interface FontInformation {
  font: string;
  isInstalled: boolean;
}

export class GetTrackingLogByIdResponseDto {
  id: string;

  os?: string;

  client?: string;

  fonts: FontInformation[];

  extra?: string;

  constructor(id: string) {
    this.id = id;
    this.fonts = [];
  }
}
