import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalEndPoints } from './localAPIEndpoints';

@Injectable()
export class TaskService {
//   private apiUrl = 'http://localhost:3000'; // Replace with your server URL

constructor(
    private http: HttpClient,
    private localEndPoints: LocalEndPoints) { }

    setUrlParameters(url: string, params: any): string {
        let urlWithParams = url;
        for (const param in params) {
            if (params.hasOwnProperty(param)) {
                urlWithParams = urlWithParams.replace(`:${param}`, params[param]);
            }
        }
        return urlWithParams;

    }

  startTask(taskName: string, scriptName: string) {
    let taskPath = this.setUrlParameters(this.localEndPoints.startTaskEndPoint, {taskName});
    console.log(scriptName);
    return this.http.post<any>(taskPath, { scriptname:scriptName });
  }

  stopTask(taskName: string, scriptName: string) {
    let taskPath = this.setUrlParameters(this.localEndPoints.stopTaskEndPoint, {taskName});
    return this.http.post<any>(taskPath, { scriptname:scriptName });
  }

  getTaskStatus(taskName: string, scriptName: string) {
    let taskPath = this.setUrlParameters(this.localEndPoints.taskStatusEndPoint, {taskName});
    return this.http.get<any>(taskPath, {params:{ scriptname:scriptName }});
  }
}
