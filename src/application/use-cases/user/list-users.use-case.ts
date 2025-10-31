import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../ports/user-repository.port.js';
import { PaginatedUsersDto } from '../../../domain/dtos/user.dto.js';

@Injectable()
export class ListUsersUseCase {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository) { }

    async execute(page = 1, pageSize = 10, search?: string): Promise<PaginatedUsersDto> {
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const where = search
            ? {
                name: {
                    contains: search,
                    mode: 'insensitive' as const,
                },
            }
            : undefined;

        const [users, total] = await Promise.all([
            this.userRepository.findMany({ skip, take, where }),
            this.userRepository.count(where),
        ]);

        return {
            users: users.map((user) => ({
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
            })),
            total,
            page,
            pageSize,
        };
    }
}

