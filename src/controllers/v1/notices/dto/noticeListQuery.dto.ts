import { Type } from "class-transformer";
import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from "class-validator";
import {
  NoticeOrderBy,
  NoticesCategory,
  noticeOrderBy,
  noticesCategory,
} from "src/common/interface";

export class NoticeListQueryDto {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @Min(1, { message: "채용 공고 최소 개수는 1개입니다." })
  take: number;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @Min(1, { message: "최소 페이지는 1 입니다." })
  page: number;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: "검색어는 100자를 넘을 수 없습니다." })
  keyword?: string;

  @IsString()
  @IsIn([...noticesCategory, "all"])
  category: NoticesCategory | "all";

  @IsString()
  @IsIn(noticeOrderBy)
  orderBy: NoticeOrderBy;
}
