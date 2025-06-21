import jwt from "jsonwebtoken";

class Token {
  private secret: string;
  private payload: object;
  private expiresIn: string;
  constructor(secret: string, payload: object, expiresIn: string) {
    this.secret = secret;
    this.payload = payload;
    this.expiresIn = expiresIn;
  }

  generate() {
    if (!this.secret) {
      throw new Error("Secret key is required for token generation");
    }

    return jwt.sign(this.payload, this.secret, {
      expiresIn: this.expiresIn,
    } as any);
  }

  verify() {
    if (!this.secret) {
      throw new Error("Secret key is required for token verification");
    }

    return jwt.verify(this.payload as unknown as string, this.secret);
  }

  static verifyToken(secret: string, token: string) {
    if (!secret) {
      throw new Error("Secret key is required for token verification");
    }
    return jwt.verify(token, secret);
  }
}

export const generateToken = (
  secret: string,
  payload: object,
  expiresIn: string
): string => {
  const token = new Token(secret, payload, expiresIn);
  return token.generate();
};

export const verifyToken = (secret: string, token: string): object | string => {
  return Token.verifyToken(secret, token);
};

export const decodeToken = (token: string): object | null => {
  try {
    return jwt.decode(token) as object;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};
