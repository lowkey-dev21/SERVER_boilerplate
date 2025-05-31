/**
 * Interface for standardized API responses
 */
export interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T;
    meta?: {
        pagination? : {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        [key: string]: any;
    }
}