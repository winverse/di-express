import { IsIn, IsString, MaxLength, MinLength } from "class-validator";
import { NoticesCategory, noticesCategory } from "src/common/interface";

export class NoticeCreateBodyDto {
  @IsString()
  @MinLength(1, { message: "채용 공고 제목을 입력해주세요." })
  @MaxLength(100, { message: "채용 공고 제목은 100자를 넘을 수 없습니다." })
  title: string;

  @IsString()
  @MinLength(1, { message: "채용 공고 소개글을 작성해주세요." })
  @MaxLength(500, { message: "채용 공고 소개글은 500자를 넘을 수 없습니다." })
  description: string;

  @IsString()
  @IsIn(noticesCategory)
  category: NoticesCategory;
}
