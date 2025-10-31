
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface TelephoneInput {
    number: string;
    area_code: string;
}

export interface SignUpInput {
    name: string;
    email: string;
    password: string;
    telephones: TelephoneInput[];
}

export interface SignInInput {
    email: string;
    password: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    telephones: Telephone[];
    created_at: string;
    modified_at: string;
}

export interface Telephone {
    id: string;
    number: string;
    area_code: string;
}

export interface SignUpResponse {
    id: string;
    created_at: string;
    modified_at: string;
}

export interface SignInResponse {
    token: string;
}

export interface PaginatedUsers {
    users: User[];
    total: number;
    page: number;
    pageSize: number;
}

export interface IQuery {
    getUser(): User | Promise<User>;
    listUsers(page?: Nullable<number>, pageSize?: Nullable<number>, search?: Nullable<string>): PaginatedUsers | Promise<PaginatedUsers>;
}

export interface IMutation {
    signUp(input: SignUpInput): SignUpResponse | Promise<SignUpResponse>;
    signIn(input: SignInInput): SignInResponse | Promise<SignInResponse>;
}

type Nullable<T> = T | null;
