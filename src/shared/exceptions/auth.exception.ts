import { GraphQLError } from 'graphql';

export class AuthException {
    static emailAlreadyExists(): GraphQLError {
        return new GraphQLError('Email already exists', {
            extensions: { code: 'EMAIL_ALREADY_EXISTS', status: 400 },
        });
    }

    static invalidCredentials(): GraphQLError {
        return new GraphQLError('Invalid credentials', {
            extensions: { code: 'INVALID_CREDENTIALS', status: 401 },
        });
    }

    static unauthorized(): GraphQLError {
        return new GraphQLError('Unauthorized', {
            extensions: { code: 'UNAUTHORIZED', status: 401 },
        });
    }

    static invalidToken(): GraphQLError {
        return new GraphQLError('Invalid or expired token', {
            extensions: { code: 'INVALID_TOKEN', status: 401 },
        });
    }

    static userNotFound(): GraphQLError {
        return new GraphQLError('User not found', {
            extensions: { code: 'USER_NOT_FOUND', status: 404 },
        });
    }
}

