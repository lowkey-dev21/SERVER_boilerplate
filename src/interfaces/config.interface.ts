/**
 * Interface for application environment configuration
 */
export interface AppConfig {
    nodeEnv: string;
    port: number;
    isProduction: boolean;
    isDevelopment: boolean;
    isTest: boolean;
    appUrl: string;
    mongoUri: string;
}

/**
 * Interface for database configuration
 */
export interface DbConfig {
    uri: string;
    options: {
        useNewUrlParser: boolean;
        useUnifiedTopology: boolean;
        autoIndex: boolean;
    }
}


/**
 * Interface for JWT configuration
 */
export interface JwtConfig {
    accessToken: {
        secret: string;
        expiry: string;
        algorithm: string;
        issuer: string;
    }
    refreshToken: {
        secret: string;
        expiry: string;
        algorithm: string;
        issuer: string;
    }
    resetToken: {
        secret: string;
        expiry: string;
        algorithm: string;
        issuer: string;
    }
    verificationToken: {
        secret: string;
        expiry: string;
        algorithm: string;
        issuer: string;
    }
}


/**
 * Interface for security configuration
 */
export interface SecurityConfig {
    argonSaltRounds: number;
    rateLimitWindow: number;
    rateLimitMax: number;
    corsOrigins: string[];
}