import { IsCuid } from 'src/common/dto';

export class UserWithdrawalBodyDto {
  @IsCuid({ message: 'id가 cuid 형식이 아닙니다.' })
  userId?: string;
}
