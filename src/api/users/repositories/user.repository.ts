import { Repository } from 'typeorm';
import { UserEntity, RegistrationType } from '../entities/user.entity';
import CustomRepository from '../../../repository/typeorm-ex.decorator';

@CustomRepository(UserEntity)
export default class UserRepository extends Repository<UserEntity> {
  async findByNickname(nickname: string): Promise<UserEntity | null> {
    return this.findOne({ where: { nickname } });
  }

  async findByIdAddress(idAddress: string): Promise<UserEntity | null> {
    return this.findOne({ where: { idAddress } });
  }

  async findByIdAddressAndRegistrationType(
    idAddress: string,
    registrationType: RegistrationType,
  ): Promise<UserEntity | null> {
    return this.findOne({
      where: { idAddress, registration_type: registrationType },
    });
  }
}
