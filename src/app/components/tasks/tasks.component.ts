import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/local/task.service';
import { Task } from '../../interfaces/task.interface';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  tasks: Task[] = [
    { taskName: 'newReleasesSputnikMusicScrapper', scriptName: 'newReleasesSputnikMusicScrapper.py', status: 'Stopped' },
    { taskName: 'newReleasesHeavyBlogIsHeavy', scriptName: 'newReleasesHeavyBlogIsHeavy.py', status: 'Stopped' },
    { taskName: 'newReleasesHeavyBlogIsHeavy EDITORSPICK', scriptName: 'HBIH_MonthlyMissiveList_Scrapper.py EDITORSPICK', status: 'Stopped' },
    { taskName: 'newReleasesHeavyBlogIsHeavy DOOMSDAY', scriptName: 'HBIH_MonthlyMissiveList_Scrapper.py DOOMSDAY', status: 'Stopped' },
    { taskName: 'newReleasesHeavyBlogIsHeavy POSTROCK', scriptName: 'HBIH_MonthlyMissiveList_Scrapper.py POSTROCK', status: 'Stopped' },
    { taskName: 'newReleasesHeavyBlogIsHeavy KULT', scriptName: 'HBIH_MonthlyMissiveList_Scrapper.py KULT', status: 'Stopped' },
    // Add more tasks as needed

  ];

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    // Fetch initial status for all tasks on component initialization
    this.tasks.forEach(task => {
      this.checkStatus(task);
    });
  }

  startTask(task: Task): void {
    this.taskService.startTask(task.taskName, task.scriptName, task.args).subscribe(res => {
      task.status = 'Running';
      console.log(res);
    });
  }

  stopTask(task: Task): void {
    this.taskService.stopTask(task.taskName, task.scriptName).subscribe(res => {
      task.status = 'Stopped';
      console.log(res);
    });
  }

  checkStatus(task: Task): void {
    this.taskService.getTaskStatus(task.taskName, task.scriptName).subscribe(res => {
      task.status = res.status;
    });
  }

  startOrStopTask(task: Task): void {
    if (task.status === 'Running') {
      this.stopTask(task);
    } else {
      this.startTask(task);
    }
  }
}
