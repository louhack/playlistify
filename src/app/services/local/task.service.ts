import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalEndPoints } from './localAPIEndpoints';
import { setUrlParameters } from '../../shared/utils';

@Injectable()
export class TaskService {
//   private apiUrl = 'http://localhost:3000'; // Replace with your server URL

constructor(
    private http: HttpClient,
    private localEndPoints: LocalEndPoints) { }


  startTask(taskName: string, scriptName: string, args: string[]) {
    let taskPath = setUrlParameters(this.localEndPoints.startTaskEndPoint, {taskName});
    console.log(scriptName);
    return this.http.post<any>(taskPath, { scriptname:scriptName, args:args });
  }

  stopTask(taskName: string, scriptName: string) {
    let taskPath = setUrlParameters(this.localEndPoints.stopTaskEndPoint, {taskName});
    return this.http.post<any>(taskPath, { scriptname:scriptName });
  }

  getTaskStatus(taskName: string, scriptName: string) {
    let taskPath = setUrlParameters(this.localEndPoints.taskStatusEndPoint, {taskName});
    return this.http.get<any>(taskPath, {params:{ scriptname:scriptName }});
  }
}
