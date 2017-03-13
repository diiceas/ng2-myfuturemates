export interface FbAuthResult{
    status: string;
    authResponse: {
        accessToken: string,
        expiresIn: number,
        signedRequest: string,
        userID: number
    }
}