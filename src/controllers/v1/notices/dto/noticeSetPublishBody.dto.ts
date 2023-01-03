import { IsBoolean } from "class-validator";

export class NoticeSetPublishBodyDto {
  @IsBoolean()
  isPublished: boolean;
}
