import { GetTrackingLogsParamsDto } from './get-tracking-logs-params.dto';

export class CompareTrackingLogsResponseDto {
  similarity: number | null;
  tracking1: GetTrackingLogsParamsDto;
  tracking2: GetTrackingLogsParamsDto;
}
