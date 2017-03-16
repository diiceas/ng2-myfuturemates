import { Student } from '../entities/student'
import { FbUserInfo } from '../entities/fbUserInfo';

export class University {
  alpha_two_code: string;
  country: string;
  domain: string;
  name: string;
  web_page: string;
  id: number;
  students: Student[];

  constructor(
    alpha_two_code: string,
    country: string,
    domain: string,
    name: string,
    web_page: string,
    id: number,
    students: Student[]) {
    this.alpha_two_code = alpha_two_code;
    this.country = country;
    this.domain = domain;
    this.name = name;
    this.web_page = web_page;
    this.id = id;
    this.students = students;
  }

  getStudentByUserInfo(user: FbUserInfo): Student {
    if (user.isConnedted()) {
      let students = this.students.filter(student => user.getFacebookId() == +student.acf.facebook_id);
      return students.length > 0 ? students[0] : {} as Student;
    }
    return {} as Student;
  }
}