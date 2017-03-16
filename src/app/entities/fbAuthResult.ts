export interface AuthResponse {
    accessToken: string;
    expiresIn: number;
    signedRequest: string;
    userID: number;
}

export interface FbAuthResult {
    status: string;
    authResponse: AuthResponse;
}