import { IsEnum, IsString, IsUrl, Matches } from 'class-validator';
import { MediaTypeEnum } from './media.enum';

export class Media {
  @IsString()
  @IsEnum(MediaTypeEnum)
  type: MediaTypeEnum;

  @IsString()
  @IsUrl()
  @Matches(/^(https:\/\/media\.target(-dev|-tst)?\.(space|world))/)
  url: string;
}
