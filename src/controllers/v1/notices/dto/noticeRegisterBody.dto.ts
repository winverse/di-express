import { ArrayMinSize, IsArray } from "class-validator";
import { IsCuid } from "src/common/dto";

export class NoticeRegisterBodyDto {
  @IsArray()
  @ArrayMinSize(1, { message: "최소 하나의 채용 공고 정보가 필요합니다." })
  @IsCuid({ each: true })
  noticeIds: string[];
}
