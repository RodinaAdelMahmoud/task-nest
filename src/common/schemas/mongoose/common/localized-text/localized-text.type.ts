import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class LocalizedText {
  @IsString()
  @IsNotEmpty()
  // @Matches(
  //   /^[a-zA-Z\s0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*[a-zA-Z]{1,800}[a-zA-Z\s0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*$/,
  //   {
  //     message: 'Must be a valid English string with special characters and between 1 to 800 characters',
  //   },
  // )
  // @ApiHideProperty()
  // @ApiProperty({
  //   type: String,
  //   description: `Regex: /^[a-zA-Z\s0-9!"#$%&'()*+,-./:;<=>?@[\]^_\`{|}~]*[a-zA-Z]{1,800}[a-zA-Z\s0-9!"#$%&'()*+,-./:;<=>?@[\]^_\`{|}~]*$/`,
  // })
  en: string;

  @IsString()
  @IsNotEmpty()
  // @Matches(
  //   /^[\u0621-\u064A\s0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*[\u0621-\u064A]{1,800}[\u0621-\u064A\s0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*$/,
  //   {
  //     message: 'Must be a valid Arabic string with special characters and between 1 to 800 characters',
  //   },
  // )
  // @ApiHideProperty()
  // @ApiProperty({
  //   type: String,
  //   description: `Regex: /^[\u0621-\u064A\s0-9!"#$%&'()*+,-./:;<=>?@[\]^_\`{|}~]*[\u0621-\u064A]{1,800}[\u0621-\u064A\s0-9!"#$%&'()*+,-./:;<=>?@[\]^_\`{|}~]*$/`,
  // })
  ar: string;
}
