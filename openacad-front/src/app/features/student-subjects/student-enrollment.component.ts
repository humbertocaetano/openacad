// src/app/features/student-subjects/student-enrollment.component.ts
@Component({
  selector: 'app-student-enrollment',
  template: `
    <div class="enrollment-container">
      <header>
        <h1>OPENACAD</h1>
        <div class="header-buttons">
          <button routerLink="/inicio">INÍCIO</button>
          <button routerLink="/login">SAIR</button>
        </div>
      </header>

      <main>
        <h2>Matrícula em Disciplinas</h2>
        
        <div class="enrollment-content">
          <div class="available-subjects">
            <h3>Disciplinas Disponíveis</h3>
            <table>
              <thead>
                <tr>
                  <th>Disciplina</th>
                  <th>Professor</th>
                  <th>Ano</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let subject of availableSubjects">
                  <td>{{ subject.name }}</td>
                  <td>{{ subject.teacher_name }}</td>
                  <td>{{ subject.year }}</td>
                  <td>
                    <button (click)="enrollSubject(subject.id)" 
                            class="enroll-button">
                      Matricular
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="enrolled-subjects">
            <h3>Disciplinas Matriculadas</h3>
            <table>
              <thead>
                <tr>
                  <th>Disciplina</th>
                  <th>Professor</th>
                  <th>Ano</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let enrollment of enrolledSubjects">
                  <td>{{ enrollment.subject_name }}</td>
                  <td>{{ enrollment.teacher_name }}</td>
                  <td>{{ enrollment.year }}</td>
                  <td>{{ enrollment.status }}</td>
                  <td>
                    <button (click)="cancelEnrollment(enrollment.enrollment_id)" 
                            class="cancel-button">
                      Cancelar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [/* ... estilos seguindo o padrão da aplicação ... */]
})
export class StudentEnrollmentComponent implements OnInit {
  availableSubjects: any[] = [];
  enrolledSubjects: any[] = [];
  studentId: number;
  error = '';

  constructor(
    private studentSubjectService: StudentSubjectService,
    private route: ActivatedRoute
  ) {
    this.studentId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.loadSubjects();
  }

  loadSubjects() {
    this.studentSubjectService.getAvailableSubjects(this.studentId)
      .subscribe({
        next: (subjects) => this.availableSubjects = subjects,
        error: (error) => this.error = 'Erro ao carregar disciplinas disponíveis'
      });

    this.studentSubjectService.getEnrolledSubjects(this.studentId)
      .subscribe({
        next: (subjects) => this.enrolledSubjects = subjects,
        error: (error) => this.error = 'Erro ao carregar disciplinas matriculadas'
      });
  }

  enrollSubject(teacherSubjectId: number) {
    this.studentSubjectService.enrollStudent(this.studentId, teacherSubjectId)
      .subscribe({
        next: () => this.loadSubjects(),
        error: (error) => this.error = 'Erro ao realizar matrícula'
      });
  }

  cancelEnrollment(enrollmentId: number) {
    if (confirm('Tem certeza que deseja cancelar esta matrícula?')) {
      this.studentSubjectService.cancelEnrollment(enrollmentId)
        .subscribe({
          next: () => this.loadSubjects(),
          error: (error) => this.error = 'Erro ao cancelar matrícula'
        });
    }
  }
}
