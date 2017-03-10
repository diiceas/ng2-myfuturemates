import { Student } from '../entities/student'

export interface University {
  alpha_two_code: string;
  country: string;
  domain: string;
  name: string;
  web_page: string;
  id: number,
  students: Student[]
}