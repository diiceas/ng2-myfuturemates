import { FbAuthResult } from './fbAuthResult'

export class FbUserInfo {
  private authResult: FbAuthResult;
  private joinedToUni: boolean;

  constructor(authResult: FbAuthResult, joinedToUni: boolean) {
    this.authResult = authResult;
    this.joinedToUni = joinedToUni;
  }

  isConnedted(): boolean {
    return this.authResult.status === "connected";
  }

  isInitialized(): boolean {
    return this.authResult.status === "initialized"
  }

  isJoinedToUni(): boolean {
    return this.joinedToUni;
  }

  getFacebookId(): number {
    return this.authResult.authResponse.userID;
  }
}