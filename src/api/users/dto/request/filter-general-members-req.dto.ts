import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import RequestPagingDto from '../../../../common/dto/paging.dto';
import { RegistrationType } from '../../entities/user.entity';

export class FilterGeneralMembersReqDto extends RequestPagingDto {
  @ApiProperty({
    enum: RegistrationType,
    required: false,
    description: 'Filter by registration type',
  })
  @IsOptional()
  @IsEnum(RegistrationType)
  registrationType?: RegistrationType;
}
