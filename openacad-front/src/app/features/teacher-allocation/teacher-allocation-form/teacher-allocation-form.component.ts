import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TeacherAllocationService } from '../../../core/services/teacher-allocation.service';
import { TeacherService } from '../../../core/services/teacher.service';
import { SubjectService } from '../../../core/services/subject.service';
import { Teacher } from '../../../core/models/teacher.interface';
import { SchoolSubject } from '../../../core/models/subject.interface';
import { SchoolYear } from '../../../core/models/school-year.interface'; 
import { ClassDivision } from '../../../core/models/class-division.interface';
import { ClassService } from '../../../core/services/class.service';

@Component({
  selector: 'app-teacher-allocation-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="allocation-form-container">
      <header>
        <h1>OPENACAD</h1>
        <div class="header-buttons">
          <button routerLink="/inicio">INÍCIO</button>
          <button routerLink="/login">SAIR</button>
        </div>
      </header>

      <main>
        <div class="content-header">
          <h2>{{ isEditing ? 'Editar' : 'Nova' }} Alocação de Professor</h2>
        </div>

        <div class="form-container">
          <div *ngIf="error" class="error-message">
            {{ error }}
          </div>

          <form [formGroup]="allocationForm" (ngSubmit)="onSubmit()">

<div class="form-group">
  <label for="teacher">Professor</label>
  <select id="teacher" formControlName="teacherId">
    <option value="">Selecione um professor</option>
    <option *ngFor="let teacher of teachers" [value]="teacher.id">
      {{ teacher.name }}
    </option>
  </select>
</div>

<div class="form-group">
  <label for="year">Ano</label>
  <select id="year" formControlName="yearId">
    <option value="">Selecione o ano</option>
    <option *ngFor="let year of schoolYears" [value]="year.id">
      {{ year.name }}
    </option>
  </select>
</div>

<div class="form-group">
  <label for="division">Turma</label>
  <select id="division" formControlName="divisionId" [disabled]="!allocationForm.get('yearId')?.value">
    <option value="">Selecione a turma</option>
    <option *ngFor="let division of classDivisions" [value]="division.id">
      {{ division.name }}
    </option>
  </select>
</div>

<div class="form-group">
  <label for="subject">Disciplina</label>
  <select id="subject" formControlName="subjectId" 
          [disabled]="!allocationForm.get('divisionId')?.value || !allocationForm.get('yearId')?.value">
    <option value="">Selecione uma disciplina</option>
    <option *ngFor="let subject of subjects" [value]="subject.id">
      {{ subject.name }}
    </option>
  </select>
</div>

<div class="form-group">
  <label for="schoolYear">Ano Letivo</label>
  <select id="schoolYear" formControlName="year">
    <option [value]="currentYear" *ngFor="let currentYear of [2024, 2025, 2026]">
      {{ currentYear }}
    </option>
  </select>
</div>
            <div class="schedules-container">
              <h3>Horários</h3>
              <div formArrayName="schedules">
                <div *ngFor="let schedule of schedules.controls; let i=index" [formGroupName]="i" class="schedule-item">
                  <div class="schedule-inputs">
                    <select formControlName="weekday" [class.invalid]="schedule.get('weekday')?.invalid && schedule.get('weekday')?.touched">
                      <option value="">Selecione o dia</option>
                      <option *ngFor="let day of weekdays" [value]="day.id">
                        {{ day.name }}
                      </option>
                    </select>

                    <input type="time" formControlName="startTime" [class.invalid]="schedule.get('startTime')?.invalid && schedule.get('startTime')?.touched">
                    <input type="time" formControlName="endTime" [class.invalid]="schedule.get('endTime')?.invalid && schedule.get('endTime')?.touched">
                    
                    <button type="button" class="remove-button" (click)="removeSchedule(i)">
                      Remover
                    </button>
                  </div>
                </div>
              </div>
              
              <button type="button" class="add-schedule-button" (click)="addSchedule()">
                Adicionar Horário
              </button>
            </div>

            <div class="form-actions">
              <button type="button" class="back-button" (click)="cancel()">VOLTAR</button>
              <button type="submit" [disabled]="!allocationForm.valid || loading">
                {{ loading ? 'Salvando...' : 'SALVAR' }}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .allocation-form-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    header {
      background-color: #00a86b;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h1 {
        color: white;
        margin: 0;
      }

      .header-buttons {
        display: flex;
        gap: 1rem;

        button {
          padding: 0.5rem 1rem;
          border: 1px solid white;
          background: transparent;
          color: white;
          cursor: pointer;

          &:hover {
            background: rgba(255,255,255,0.1);
          }
        }
      }
    }

    main {
      padding: 2rem;
      flex: 1;
    }

    .content-header {
      margin-bottom: 2rem;
      
      h2 {
        margin: 0;
      }
    }

    .form-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }

      input, select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: #00a86b;
        }

        &.invalid {
          border-color: #ff4444;
        }
      }
    }

    .schedules-container {
      margin-top: 2rem;
      border-top: 1px solid #ddd;
      padding-top: 1rem;

      h3 {
        margin-bottom: 1rem;
      }
    }

    .schedule-item {
      margin-bottom: 1rem;
      
      .schedule-inputs {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr auto;
        gap: 1rem;
        align-items: center;
      }

      .remove-button {
        padding: 0.5rem 1rem;
        background-color: #ff4444;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          background-color: #cc0000;
        }
      }
    }

    .add-schedule-button {
      padding: 0.5rem 1rem;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 1rem;

      &:hover {
        background-color: #45a049;
      }
    }

    .error-message {
      color: #ff4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 2rem;

      button {
        padding: 0.75rem 2rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        
        &.back-button {
          background-color: #f0f0f0;
          color: #333;
        }
        
        &[type="submit"] {
          background-color: #00a86b;
          color: white;

          &:disabled {
            background-color: #ccc;
            cursor: not-allowed;
          }
        }

        &:hover:not(:disabled) {
          opacity: 0.9;
        }
      }
    }
  `]
})


export class TeacherAllocationFormComponent implements OnInit {
  allocationForm!: FormGroup;
  teachers: Teacher[] = [];
  subjects: SchoolSubject[] = [];
  schoolYears: SchoolYear[] = [];
  classDivisions: ClassDivision[] = [];
  isEditing: boolean = false;
  loading: boolean = false;
  error: string = '';
  weekdays = [
    { id: 1, name: 'Segunda-feira' },
    { id: 2, name: 'Terça-feira' },
    { id: 3, name: 'Quarta-feira' },
    { id: 4, name: 'Quinta-feira' },
    { id: 5, name: 'Sexta-feira' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private teacherAllocationService: TeacherAllocationService,
    private teacherService: TeacherService,
    private subjectService: SubjectService,
    private classService: ClassService    

  ) {
    this.allocationForm = this.fb.group({
      teacherId: ['', Validators.required],
      yearId: ['', Validators.required],
      divisionId: ['', Validators.required],
      subjectId: ['', Validators.required],
      year: [new Date().getFullYear(), Validators.required],
      schedules: this.fb.array([])
    });

    // Adicionar listeners para os campos dependentes
    this.allocationForm.get('yearId')?.valueChanges.subscribe(yearId => {
      this.loadClassDivisions(yearId);
      this.allocationForm.patchValue({ divisionId: '', subjectId: '' });
    });

    this.allocationForm.get('divisionId')?.valueChanges.subscribe(divisionId => {
      const yearId = this.allocationForm.get('yearId')?.value;
      if (yearId && divisionId) {
        this.loadSubjects(yearId, divisionId);
      }
      this.allocationForm.patchValue({ subjectId: '' });
    });
  }    


//  private initializeForm(): void {
//    this.allocationForm = this.fb.group({
//      teacherId: ['', Validators.required],
//      yearId: ['', Validators.required],
//      divisionId: ['', Validators.required],
//      subjectId: ['', Validators.required],
//      year: [new Date().getFullYear(), Validators.required],
//      schedules: this.fb.array([])
//    });
//
//    this.allocationForm.get('yearId')?.valueChanges.subscribe(yearId => {
//      this.loadClassDivisions(yearId);
//      this.allocationForm.patchValue({ divisionId: '', subjectId: '' });
//    });

//    this.allocationForm.get('divisionId')?.valueChanges.subscribe(divisionId => {
//      const yearId = this.allocationForm.get('yearId')?.value;
//      if (yearId && divisionId) {
//        this.loadSubjects(yearId, divisionId);
//      }
//      this.allocationForm.patchValue({ subjectId: '' });
//    });
//  }

  ngOnInit(): void {
    this.loadTeachers();
    this.loadSchoolYears();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditing = true;
      this.loadAllocation(id);
    } else {
      this.addSchedule();
    }
  }

  get schedules() {
    return this.allocationForm.get('schedules') as FormArray;
  }

  addSchedule(): void {
    const scheduleGroup = this.fb.group({
      weekday: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });

    this.schedules.push(scheduleGroup);
  }

  removeSchedule(index: number): void {
    this.schedules.removeAt(index);
  }

  loadSchoolYears(): void {
    this.classService.getSchoolYears().subscribe({
      next: (years) => this.schoolYears = years,
      error: (error) => {
        console.error('Erro ao carregar anos:', error);
        this.error = 'Erro ao carregar anos escolares';
      }
    });
  }

  loadClassDivisions(yearId: number): void {
    if (!yearId) {
      this.classDivisions = [];
      return;
    }

    this.classService.getClassDivisionsByYear(yearId).subscribe({
      next: (divisions) => this.classDivisions = divisions,
      error: (error) => {
        console.error('Erro ao carregar turmas:', error);
        this.error = 'Erro ao carregar turmas';
      }
    });
  }

  loadSubjects(yearId: number, divisionId: number): void {
    if (!yearId || !divisionId) {
      this.subjects = [];
      return;
    }

    this.subjectService.getSubjectsByYearAndDivision(yearId, divisionId).subscribe({
      next: (subjects: SchoolSubject[]) => this.subjects = subjects,
      error: (error) => {
        console.error('Erro ao carregar disciplinas:', error);
        this.error = 'Erro ao carregar disciplinas';
      }
    });
  }

  loadTeachers(): void {
    this.teacherService.getTeachers().subscribe({
      next: (data) => this.teachers = data,
      error: (error) => {
        console.error('Erro ao carregar professores:', error);
        this.error = 'Erro ao carregar professores. Tente novamente mais tarde.';
      }
    });
  }

//  loadSubjects(): void {
//    this.subjectService.getSubjectsForAllocation().subscribe({
//      next: (data) => this.subjects = data,
//      error: (error) => {
//        console.error('Erro ao carregar disciplinas:', error);
//        this.error = 'Erro ao carregar disciplinas. Tente novamente mais tarde.';
//      }
//    });
//  }

  loadAllocation(id: number): void {
    this.loading = true;
    this.teacherAllocationService.getAllocation(id).subscribe({
      next: (allocation) => {
        this.allocationForm.patchValue({
          teacherId: allocation.teacherId,
          subjectId: allocation.subjectId,
          year: allocation.year
        });

        allocation.schedules.forEach(schedule => {
          this.schedules.push(
            this.fb.group({
              weekday: [schedule.weekday, Validators.required],
              startTime: [schedule.startTime, Validators.required],
              endTime: [schedule.endTime, Validators.required]
            })
          );
        });

        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar alocação:', error);
        this.error = 'Erro ao carregar a alocação. Tente novamente mais tarde.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.allocationForm.valid) {
      this.loading = true;
      const allocationData = this.allocationForm.value;

      const operation = this.isEditing
        ? this.teacherAllocationService.updateAllocation(this.route.snapshot.params['id'], allocationData)
        : this.teacherAllocationService.createAllocation(allocationData);

      operation.subscribe({
        next: () => {
          this.router.navigate(['/alocacoes']);
        },
        error: (error) => {
          console.error('Erro ao salvar alocação:', error);
          this.error = 'Erro ao salvar a alocação. Tente novamente mais tarde.';
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/alocacoes']);
  }
}

