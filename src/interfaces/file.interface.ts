/**
 * Enum for supported file types
 */
export enum FileType {
    IMAGE = 'image',
    DOCUMENT = 'document',
    VIDEO = 'video',
    AUDIO = 'audio',
}

/**
 * Interface for file upload configuration
 */
export interface FileUploadConfig {
    maxFileSize: number;
    allowedMimeTypes: string[];
    destination: string;
    fileType: FileType;
}

/**
 Interface for uploaded file metadata
 */
export interface UploadedFile {
    filedname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
    fileType: FileType;
    url?: string;
}