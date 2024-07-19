import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  attributes: Record<string, any>;

  @IsNotEmpty()
  @IsString()
  leadEmail: string;
}
