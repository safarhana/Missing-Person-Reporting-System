import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Pusher = require('pusher');

export interface AdminAlertPayload {
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'success' | 'alert';
}

@Injectable()
export class PusherService {
  private readonly logger = new Logger(PusherService.name);
  private pusher: Pusher | null = null;
  public readonly channel = 'mprs-admin-channel';
  public readonly event = 'admin-alert';

  constructor(private readonly configService: ConfigService) {
    const appId = this.configService.get<string>('PUSHER_APP_ID');
    const key = this.configService.get<string>('PUSHER_KEY');
    const secret = this.configService.get<string>('PUSHER_SECRET');
    const cluster = this.configService.get<string>('PUSHER_CLUSTER') || 'ap2';

    if (appId && key && secret && appId !== 'mock_app_id' && secret !== 'mock_secret') {
      try {
        this.pusher = new Pusher({
          appId,
          key,
          secret,
          cluster,
          useTLS: true,
        });
        this.logger.log(
          `Pusher client connected on cluster '${cluster}' for channel '${this.channel}'`,
        );
      } catch (err) {
        this.logger.warn(`Failed to initialize Pusher instance: ${(err as Error).message}`);
      }
    } else {
      this.logger.warn(
        'Pusher live credentials not provided. Real-time events will be safely logged until valid PUSHER_APP_ID and PUSHER_SECRET are configured.',
      );
    }
  }

  async triggerAdminAlert(payload: AdminAlertPayload): Promise<{ success: boolean; delivered: boolean; message: string }> {
    const alertData = {
      title: payload.title,
      message: payload.message,
      type: payload.type || 'info',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (!this.pusher) {
      this.logger.log(
        `[Pusher Standby] Channel: ${this.channel} | Event: ${this.event} | Payload: ${JSON.stringify(alertData)}`,
      );
      return {
        success: true,
        delivered: false,
        message: 'Pusher live credentials pending; event logged successfully.',
      };
    }

    try {
      await this.pusher.trigger(this.channel, this.event, alertData);
      this.logger.log(
        `[Pusher Triggered] Channel: ${this.channel} | Event: ${this.event} | "${alertData.title}"`,
      );
      return {
        success: true,
        delivered: true,
        message: 'Pusher alert sent successfully.',
      };
    } catch (error) {
      this.logger.error(`Error triggering Pusher event: ${(error as Error).message}`);
      return {
        success: false,
        delivered: false,
        message: (error as Error).message,
      };
    }
  }
}
