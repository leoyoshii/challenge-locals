import { ApiProperty } from '@nestjs/swagger'

export class CreateLocalDto {
  @ApiProperty({ example: 'Brasil', description: 'Nome do país.', type: String, required: true })
  country: string

  @ApiProperty({
    example: 'Curitiba',
    description: 'Nome da localização.',
    type: String,
    required: true,
  })
  location: string

  @ApiProperty({
    example: '10/10/2022',
    description: 'Data da meta.',
    type: String,
    required: true,
  })
  meta: Date
}
