// dto/list-tracking.dto.ts
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  Matches,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetTrackingLogsParamsDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  os?: string;

  @IsOptional()
  @IsString()
  client?: string;

  @IsOptional()
  @IsString()
  font?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  isFontInstalled?: boolean;

  @IsOptional()
  @IsString()
  extra?: string;

  @IsOptional()
  @IsString()
  // ISO 8601
  @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d+)?$/)
  from?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d+)?$/)
  to?: string;
}
