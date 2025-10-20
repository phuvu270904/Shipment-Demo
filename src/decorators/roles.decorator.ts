import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../common/enum/user.role';

export const ROLES_KEY = 'roles';
export const Role = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
