import { IsNumber, IsString } from "class-validator";

export class MailerConfig {
  @IsString()
  username: string;

  @IsString()
  password: string;

  // @IsString()
  // clientId: string

  // @IsString()
  // clientSecret: string

  // @IsString()
  // refreshToken: string

  // @IsString()
  // redirectUri: string
}
