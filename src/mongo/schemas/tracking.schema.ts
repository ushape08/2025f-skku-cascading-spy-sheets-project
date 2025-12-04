import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Tracking {
  @Prop({
    type: String,
    required: true,
  })
  id: string; // HTML request에 부여되는 id

  @Prop({
    type: Date,
    required: true,
  })
  timestamp: Date; // template engine을 기반으로 HTML 페이지를 만든 시점

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
    type: [String],
    default: [],
  })
  fonts: string[];

  @Prop({
    type: String,
    required: false,
  })
  extra?: string;
}

export const TrackingSchema = SchemaFactory.createForClass(Tracking);

TrackingSchema.index(
  { id: 1, timestamp: 1 },
  { unique: true, name: 'id_timestamp_index' },
);
