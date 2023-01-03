import { IsEmail, MaxLength } from "class-validator";

export class UserLoginBodyDto {
  @IsEmail()
  @MaxLength(50, { message: "이메일은 50자 이상 넘을 수 없습니다." })
  email: string;
}
