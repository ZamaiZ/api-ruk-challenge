export class TelephoneInputDto {
    number: string;
    area_code: string;
}

export class SignUpInputDto {
    name: string;
    email: string;
    password: string;
    telephones: TelephoneInputDto[];
}

export class SignInInputDto {
    email: string;
    password: string;
}

export class SignUpResponseDto {
    id: string;
    created_at: string;
    modified_at: string;
}

export class SignInResponseDto {
    token: string;
}

