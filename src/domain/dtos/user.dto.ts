export class TelephoneDto {
  id: string;
  number: string;
  area_code: string;
}

export class UserDto {
  id: string;
  name: string;
  email: string;
  telephones: TelephoneDto[];
  created_at: string;
  modified_at: string;
}

export class PaginatedUsersDto {
  users: UserDto[];
  total: number;
  page: number;
  pageSize: number;
}

export class JwtPayloadDto {
  id: string;
  email: string;
}

