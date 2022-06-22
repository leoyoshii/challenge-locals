import { ApiProperty } from '@nestjs/swagger'

export class UpdateLocalDto {
  id: string

  @ApiProperty({
    example: 'Maringá',
    description: 'Nome da localização.',
    type: String,
    required: false,
  })
  location: string

  @ApiProperty({
    example: '10/10/2022',
    description: 'Data da meta.',
    type: String,
    required: false,
  })
  meta: Date
}
