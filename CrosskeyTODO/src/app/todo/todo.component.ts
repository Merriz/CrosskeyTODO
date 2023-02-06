import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Task } from '../model/task';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit {
  @ViewChild('inputField')
  myInputField!: ElementRef;

  todoForm!: FormGroup;
  tasks: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];
  updateIndex!: any;
  editingEnabled: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      item: ['', Validators.required],
    });
    this.restoreData();
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.saveData();
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.saveData();
    }
  }

  addTask() {
    this.tasks.push({
      description: this.todoForm.value.item,
      done: false,
    });
    this.todoForm.reset();
  }

  deleteTask(i: number) {
    this.tasks.splice(i, 1);
    this.saveData();
  }

  deleteTaskInProgress(i: number) {
    this.inProgress.splice(i, 1);
    this.saveData();
  }

  deleteDone(i: number) {
    this.done.splice(i, 1);
    this.saveData();
  }

  editTask(item: Task, i: number) {
    this.todoForm.controls['item'].setValue(item.description);
    this.myInputField.nativeElement.focus();
    this.updateIndex = i;
    this.editingEnabled = true;
  }

  updateTask() {
    this.tasks[this.updateIndex].description = this.todoForm.value.item;
    this.tasks[this.updateIndex].done = false;
    this.todoForm.reset();
    this.editingEnabled = false;
    this.saveData();
  }

  saveData() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    localStorage.setItem('inProgress', JSON.stringify(this.inProgress));
    localStorage.setItem('done', JSON.stringify(this.done));
  }

  restoreData() {
    this.tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    this.inProgress = JSON.parse(localStorage.getItem('inProgress') || '[]');
    this.done = JSON.parse(localStorage.getItem('done') || '[]');
  }
}
