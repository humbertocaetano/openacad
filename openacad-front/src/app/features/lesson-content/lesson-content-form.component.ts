@Component({
  template: `
    <form [formGroup]="lessonForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label for="date">Data da Aula</label>
        <input type="date" formControlName="date">
      </div>

      <div class="form-group">
        <label for="content">Conteúdo</label>
        <textarea formControlName="content" rows="4"></textarea>
      </div>

      <div class="form-group">
        <label for="objective">Objetivo</label>
        <textarea formControlName="objective" rows="3"></textarea>
      </div>

      <div class="form-group">
        <label for="resources">Recursos Utilizados</label>
        <textarea formControlName="resources" rows="2"></textarea>
      </div>

      <div class="form-group">
        <label for="evaluationMethod">Método de Avaliação</label>
        <textarea formControlName="evaluationMethod" rows="2"></textarea>
      </div>

      <div class="form-group">
        <label for="observations">Observações</label>
        <textarea formControlName="observations" rows="2"></textarea>
      </div>

      <button type="submit">Salvar</button>
    </form>
  `
})
