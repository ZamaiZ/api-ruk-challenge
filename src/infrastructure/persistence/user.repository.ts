import { Injectable } from '@nestjs/common';
import { IUserRepository, CreateUserData } from '../../application/ports/user-repository.port.js';
import { UserEntity } from '../../domain/entities/user.entity.js';
import { PrismaService } from './prisma.service.js';

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.prisma.user.findUnique({
            where: { email },
            include: { telephones: true },
        });
    }

    async findById(id: string): Promise<UserEntity | null> {
        return this.prisma.user.findUnique({
            where: { id },
            include: { telephones: true },
        });
    }

    async create(data: CreateUserData): Promise<UserEntity> {
        return this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash: data.passwordHash,
                telephones: {
                    create: data.telephones.map((tel) => ({
                        number: tel.number,
                        areaCode: tel.areaCode,
                    })),
                },
            },
            include: { telephones: true },
        });
    }

    async findMany(params: {
        skip: number;
        take: number;
        where?: { name?: { contains: string; mode: 'insensitive' } };
    }): Promise<UserEntity[]> {
        return this.prisma.user.findMany({
            where: params.where,
            skip: params.skip,
            take: params.take,
            include: { telephones: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async count(where?: { name?: { contains: string; mode: 'insensitive' } }): Promise<number> {
        return this.prisma.user.count({ where });
    }
}

