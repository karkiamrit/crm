import { ApiProperty } from '@nestjs/swagger';

export class OrganizationReponseDto {
  @ApiProperty({
    description: 'The name of the organization.',
    example: 'Organization Name',
  })
  name: string;

  @ApiProperty({
    description: 'The email of the organization.',
    example: 'Organization Email',
  })
  email: string;

  @ApiProperty({
    description: 'The address of the organization.',
    example: 'Organization Address',
  })
  address: string;

  @ApiProperty({
    description: 'The phone number of the organization.',
    example: 'Organization Phone',
  })
  phone: string;
}
