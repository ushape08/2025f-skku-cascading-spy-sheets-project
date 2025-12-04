import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TrackingDocument = HydratedDocument<Tracking>;

@Schema({
  timestamps: true,
})
export class Tracking {
  @Prop({
    type: String,
    required: true,
  })
  id: string; // HTML request에 부여되는 id

  @Prop({
    type: String,
    required: false,
  })
  os?: string;

  @Prop({
    type: String,
    required: false,
  })
  client?: string;

  @Prop({
    type: String,
    required: false,
  })
  font?: string;

  @Prop({
    type: Boolean,
    required: false,
  })
  isFontInstalled?: boolean;

  @Prop({
    type: String,
    required: false,
  })
  extra?: string;
}

export const TrackingSchema = SchemaFactory.createForClass(Tracking);

TrackingSchema.index({ id: 1, timestamp: 1 });
