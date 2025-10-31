import { UserEntity } from '../../domain/entities/user.entity.js';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface CreateUserData {
    name: string;
    email: string;
    passwordHash: string;
    telephones: Array<{
        number: string;
        areaCode: string;
    }>;
}

export interface IUserRepository {
    findByEmail(email: string): Promise<UserEntity | null>;
    findById(id: string): Promise<UserEntity | null>;
    create(data: CreateUserData): Promise<UserEntity>;
    findMany(params: {
        skip: number;
        take: number;
        where?: { name?: { contains: string; mode: 'insensitive' } };
    }): Promise<UserEntity[]>;
    count(where?: { name?: { contains: string; mode: 'insensitive' } }): Promise<number>;
}

