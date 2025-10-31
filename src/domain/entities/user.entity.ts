export class UserEntity {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    telephones: TelephoneEntity[];
    createdAt: Date;
    updatedAt: Date;
}

export class TelephoneEntity {
    id: string;
    number: string;
    areaCode: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

