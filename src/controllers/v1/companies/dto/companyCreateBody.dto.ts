import { IsString } from "class-validator";

export class CompanyCreateBodyDto {
  @IsString()
  name: string;
}
