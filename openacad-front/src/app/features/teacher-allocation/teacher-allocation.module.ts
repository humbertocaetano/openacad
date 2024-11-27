import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TeacherAllocationListComponent } from './teacher-allocation-list/teacher-allocation-list.component';
import { TeacherAllocationFormComponent } from './teacher-allocation-form/teacher-allocation-form.component';

@NgModule({
  declarations: [
    TeacherAllocationListComponent,
    TeacherAllocationFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    TeacherAllocationListComponent,
    TeacherAllocationFormComponent
  ]
})
export class TeacherAllocationModule { }
