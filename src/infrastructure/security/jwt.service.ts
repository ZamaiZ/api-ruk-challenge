import { Injectable } from '@nestjs/common';
import { SignJWT, jwtVerify } from 'jose';
import { JwtPayloadDto } from '../../domain/dtos/user.dto.js';

@Injectable()
export class JwtService {
    private readonly secret = new TextEncoder().encode(
        process.env.JWT_SECRET || ''
    );

    async sign(payload: JwtPayloadDto): Promise<string> {
        return new SignJWT({ id: payload.id, email: payload.email })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(this.secret);
    }

    async verify(token: string): Promise<JwtPayloadDto | null> {
        try {
            const { payload } = await jwtVerify(token, this.secret);
            return {
                id: payload.id as string,
                email: payload.email as string,
            };
        } catch {
            return null;
        }
    }
}

