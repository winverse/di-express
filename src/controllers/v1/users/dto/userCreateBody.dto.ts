import { IsEmail, Matches, MaxLength, MinLength } from "class-validator";

export class UserCreateBodyDto {
  @IsEmail()
  @MaxLength(50, { message: "이메일은 50자 이상 넘을 수 없습니다." })
  email: string;

  @MinLength(0, { message: "닉네임을 입력해주세요." })
  @MaxLength(30, { message: "닉네임은 30자 이상 넘을 수 없습니다." })
  @Matches(/^[가-힣a-zA-Z]+$/, {
    message: "이름은 한글, 영어, 숫자만 허용됩니다.",
  })
  username: string;
}
