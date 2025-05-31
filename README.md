# Express TypeScript Boilerplate

A production-ready boilerplate for building secure, scalable REST APIs using Express and TypeScript.

## Features

- 🚀 Express & TypeScript
- 🔒 Authentication & Authorization
- 📝 Request Validation
- 🗃️ MongoDB with Mongoose
- 📊 Winston Logging
- 🛡️ Security Best Practices
- ⚡️ Error Handling
- 🧪 Testing Setup

## Quick Start

```bash
# Clone the repository
git clone <your-repo-url>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
├── configs/         # Configuration files
├── controllers/     # Route controllers
├── interfaces/      # TypeScript interfaces
├── middlewares/    # Express middlewares
├── models/         # Mongoose models
├── routes/         # Route definitions
├── schemas/        # Validation schemas
├── utils/          # Utility functions
├── app.ts          # Express app setup
└── server.ts       # App entry point
```

## Code Examples

### 1. Route Definition

Routes are defined in the `routes` directory:

```typescript
// Example auth routes
import { Router } from 'express';
import { validateRequest } from '../middlewares/validation.middleware';
import { authController } from '../controllers/auth.controller';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/register', 
    validateRequest(registerSchema),
    authController.register
);

router.post('/login',
    validateRequest(loginSchema),
    authController.login
);

export default router;
```

### 2. Authentication Middleware

Protect routes with authentication middleware:

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../configs/config';
import { createError } from '../../utils/error.util';
import logger from '../../utils/logger.util';
import { UserRole, JwtPayload, UserPayload } from '../../interfaces/auth.interface';

/**
 * Extended Request interface to include user information
 */
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

/**
 * Middleware to verify JWT access token
 */
export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') 
            ? authHeader.split(' ')[1] 
            : null;

        if (!token) {
            // Log the error and return a 401 Unauthorized response
            res.status(401).json({message: 'Access denied. No token provided.'});
            logger.security('NoTokenProvided', 'Access denied. No token provided');
            return next(createError('Access denied. No token provided.', 401));
        }


        // Cast the decoded token to our custom JwtPayload interface
        const decoded = jwt.verify(
            token, 
            jwtConfig.accessToken.secret, 
            {
                issuer: jwtConfig.accessToken.issuer,
                algorithms: [jwtConfig.accessToken.algorithm as jwt.Algorithm]
            }
        ) as JwtPayload;

        req.user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role
        };

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            logger.security('TokenExpired', 'Access token expired', {
                error: error.message
            });
            next(createError('Token expired', 401));
        } else {
            logger.error('Authentication error', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            next(createError('Invalid token', 401));
        }
    }
};

/**
 * Middleware to restrict access based on user roles
 */
export const restrictTo = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw createError('User not authenticated', 401);
        }

        if (!roles.includes(req.user.role)) {
            logger.security('UnauthorizedAccess', 'Permission denied', {
                userId: req.user.id,
                requiredRoles: roles,
                userRole: req.user.role
            });
            throw createError('Permission denied', 403);
        }

        next();
    };
};

/**
 * Middleware to verify refresh token
 */
export const verifyRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            throw createError('Refresh token not provided', 401);
        }

        const decoded = jwt.verify(
            refreshToken,
            jwtConfig.refreshToken.secret,
            {
                issuer: jwtConfig.refreshToken.issuer,
                algorithms: [jwtConfig.refreshToken.algorithm as jwt.Algorithm]
            }
        ) as JwtPayload;

        req.user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role
        };

        next();
    } catch (error) {
        logger.security('RefreshTokenError', 'Invalid refresh token', {
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        next(createError('Invalid refresh token', 401));
    }
};
```

### 3. Model Definition

Define MongoDB models with TypeScript support:

```typescript
import mongoose, { Schema } from 'mongoose';
import { IUser, UserRole } from '../interfaces/auth.interface';

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.USER
    }
}, {
    timestamps: true
});

export const User = mongoose.model<IUser>('User', userSchema);
```

### 4. Controller Implementation

Controllers handle the business logic:

```typescript
export const authController = {
    register: catchAsync(async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const user = await User.create({
            email,
            password
        });

        logger.info('New user registered', { userId: user._id });

        sendSuccess(res, 201, 'User registered successfully', {
            user: {
                id: user._id,
                email: user.email
            }
        });
    })
};
```

### 5. Logging Examples

The boilerplate includes a powerful logging system:

```typescript
// Success logging
logger.apiSuccess('GET', '/api/users', 200, 150, 'user123');

// Error logging
logger.apiError('POST', '/api/auth/login', 401, 100, 
    new Error('Invalid credentials'));

// Security logging
logger.security('BruteForceAttempt', 
    'Multiple failed login attempts detected', {
    ipAddress: '192.168.1.1',
    attempts: 5
});
```

## Logging Guide

This boilerplate uses Winston for advanced logging capabilities. The logging system is preconfigured with different levels and formats for both console and file outputs.

### Log Levels

```typescript
const logLevels = {
    error: 0,  // Errors and critical issues
    warn: 1,   // Warnings and non-critical issues
    info: 2,   // General information
    http: 3,   // HTTP request logging
    debug: 4   // Debugging information
};
```

### Basic Logging

```typescript
import logger from '../utils/logger.util';

// Basic logging examples
logger.error('Database connection failed', { error: err.message });
logger.warn('API rate limit approaching', { current: 980, limit: 1000 });
logger.info('Server started', { port: 3000 });
logger.http('Incoming request', { method: 'GET', path: '/api/users' });
logger.debug('Cache miss', { key: 'user:123' });
```

### Specialized Logging Methods

#### API Request Logging
```typescript
// Success cases
logger.apiSuccess(
    'GET',                // HTTP Method
    '/api/users/123',     // Endpoint
    200,                 // Status Code
    150,                 // Response Time (ms)
    'user_abc'           // User ID (optional)
);

// Error cases
logger.apiError(
    'POST',
    '/api/orders',
    400,
    200,                 // Response Time (ms)
    new Error('Invalid payload'),
    'user_abc'           // User ID (optional)
);
```

#### Security Event Logging
```typescript
logger.security(
    'AuthenticationFailed',
    'Multiple failed login attempts detected',
    {
        ipAddress: '192.168.1.100',
        attempts: 5,
        timeWindow: '5m'
    }
);

logger.security(
    'PermissionDenied',
    'Unauthorized access attempt to admin panel',
    {
        userId: 'user_123',
        resource: '/admin/users'
    }
);
```

#### System Event Logging
```typescript
logger.system(
    'DatabaseMigration',
    'Database migration completed successfully',
    {
        version: '1.2.0',
        executionTime: '3.5s'
    }
);

logger.system(
    'ServiceStatus',
    'External payment service is down',
    {
        service: 'PaymentAPI',
        downtime: '5m',
        impact: 'high'
    }
);
```

### Log File Structure

Logs are stored in the `/logs` directory with the following files:

- `combined.log`: All log entries
- `error.log`: Error-level logs only
- `exceptions.log`: Uncaught exceptions
- `rejections.log`: Unhandled promise rejections

### Log Rotation

Logs are automatically rotated:
- Maximum file size: 20MB
- Keep last 14 days of logs
- Compressed archives for older logs

### Environment Configuration

```env
LOG_LEVEL=info              # Logging level (error, warn, info, http, debug)
LOG_TO_CONSOLE=true        # Enable console logging
LOG_TO_FILE=true          # Enable file logging
LOG_DIR=logs              # Log files directory
LOG_MAX_SIZE=20m         # Maximum log file size
LOG_MAX_FILES=14d        # Keep logs for 14 days
```

### Best Practices

1. **Error Logging**: Always include stack traces and relevant context
   ```typescript
   try {
       await someOperation();
   } catch (error) {
       logger.error('Operation failed', {
           error: error.message,
           stack: error.stack,
           context: { operationId: '123' }
       });
   }
   ```

2. **Request Logging**: Log both incoming and outgoing requests
   ```typescript
   logger.http('External API call', {
       service: 'PaymentAPI',
       method: 'POST',
       duration: 200,
       status: response.status
   });
   ```

3. **Security Events**: Always log security-related events
   ```typescript
   logger.security('AccessControl', 'Role modified', {
       adminId: '123',
       targetUser: '456',
       oldRole: 'user',
       newRole: 'admin'
   });
   ```

## Environment Variables

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/your-db
JWT_SECRET=your-secret-key
LOG_LEVEL=info
```

## API Documentation

Base URL: `http://localhost:3000/api`

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login user |
| GET | /auth/me | Get current user |

## Security Features

- Helmet for security headers
- Rate limiting
- JWT authentication
- Password hashing with Argon2
- XSS protection
- Request validation
- CORS configuration

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

ISC

---

For more detailed documentation, please visit the [Wiki](your-wiki-url).