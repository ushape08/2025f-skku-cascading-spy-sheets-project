import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetImageQuery {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  os: string; // user's operating system

  @IsNotEmpty()
  @IsString()
  client: string; // browser or e-mail client

  @IsOptional()
  @IsString()
  font?: string;

  @IsOptional()
  @IsBoolean()
  isFontInstalled?: boolean;

  @IsOptional()
  @IsString()
  extra?: string;
}
