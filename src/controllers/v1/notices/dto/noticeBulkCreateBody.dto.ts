import { NoticeCreateBodyDto } from "@controllers/v1/notices/dto/noticeCreateBody.dto";
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  ValidateNested,
} from "class-validator";

export class NoticeBulkCreateBodyDto {
  @IsArray()
  @ArrayMinSize(1, { message: "채용 공고 정보를 입력해주세요." })
  @ArrayMaxSize(10, { message: "채용 공고는 10개 이상 등록할 수 없습니다." })
  @ValidateNested()
  @Type(() => NoticeCreateBodyDto)
  notices: NoticeCreateBodyDto[];
}
