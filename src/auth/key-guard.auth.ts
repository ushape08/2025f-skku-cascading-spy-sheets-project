import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const challengeKey = req.headers['x-api-key'];

    const apiKey = this.configService.get<string>('API_KEY');
    if (!challengeKey || apiKey !== challengeKey) {
      throw new UnauthorizedException('Invalid API key');
    }
    return true;
  }
}
