import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../ports/user-repository.port.js';
import { AuthException } from '../../../shared/exceptions/auth.exception.js';
import { UserDto } from '../../../domain/dtos/user.dto.js';

@Injectable()
export class GetUserUseCase {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository) { }

    async execute(userId: string): Promise<UserDto> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw AuthException.userNotFound();
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            telephones: user.telephones.map((tel) => ({
                id: tel.id,
                number: tel.number,
                area_code: tel.areaCode,
            })),
            created_at: user.createdAt.toISOString(),
            modified_at: user.updatedAt.toISOString(),
        };
    }
}

