export interface FbMeInfo {
  email: string;
  name: string;
  picture: {
    data: {
      url: string
    }
  };
  link: string;
  id: string;
  gender: string;
}