import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  fetchProblemData(
    course: string,
    topic: string,
    problemId: number
  ): Observable<any> {
    const url = `http://localhost:3000/get_problem/${course}/${topic}/${problemId}`;
    return this.http.get<any[]>(url);
  }

  fetchUserData(user_id: string): Observable<any> {
    const url = `http://localhost:3000/get_user/${user_id}`;
    return this.http.get<any[]>(url);
  }

  createUserData(user_id: string): Observable<any> {
    const url = `http://localhost:3000/create_user/${user_id}`;
    return this.http.post<any>(url, {});
  }

  fetchProblemsData(course: string, topic: string): Observable<any> {
    const url = `http://localhost:3000/get_problems/${course}/${topic}`;
    return this.http.get<any[]>(url);
  }

  submitMath(topic: string, id: string, code: string): Observable<any> {
    const url = `http://localhost:3000/submit_math/${topic}/${id}`;
    return this.http.post<any>(url, { code: code });
  }


  submitProgramming(topic: string, id: string, code: string): Observable<any> {
    const url = `http://localhost:3000/submit_programming/${topic}/${id}`;
    return this.http.post<any>(url, {code : code})
  }

  runProgramming(topic: string, id: string, code: string): Observable<any> {
    const url = `http://localhost:3000/run_programming/${topic}/${id}`;
    return this.http.post<any>(url, {code : code})
  }

  solveProblem(
    user_id: string,
    course: string,
    topic: string,
    id: string
  ): Observable<any> {
    const url = `http://localhost:3000/problem_solved/${user_id}/${course}/${topic}/${id}`;
    return this.http.put<any>(url, {});
  }

  addSubmissions(
    json_object: any,
    user_id: string,
    course: string,
    topic: string,
    id: string
  ): Observable<any> {
    const url = `http://localhost:3000/add_submissions/${user_id}/${course}/${topic}/${id}`;
    return this.http.put<any>(url, json_object);
  }

  fetchSubmissions(
    user_id: string,
    course: string,
    topic: string,
    id: string
  ): Observable<any> {
    const url = `http://localhost:3000/get_submissions/${user_id}/${course}/${topic}/${id}`;
    return this.http.get<any>(url);
  }
}
