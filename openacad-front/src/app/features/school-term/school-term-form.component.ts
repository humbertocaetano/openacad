@Component({
  template: `
    <form [formGroup]="termForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label for="year">Ano Letivo</label>
        <input type="number" formControlName="year">
      </div>

      <div class="form-group">
        <label for="startDate">Início do Ano Letivo</label>
        <input type="date" formControlName="startDate">
      </div>

      <div class="form-group">
        <label for="endDate">Término do Ano Letivo</label>
        <input type="date" formControlName="endDate">
      </div>

      <div formArrayName="nonSchoolDays">
        <h3>Períodos não Letivos</h3>
        <button type="button" (click)="addNonSchoolDay()">Adicionar Período</button>
        
        <div *ngFor="let period of nonSchoolDays.controls; let i=index" [formGroupName]="i">
          <select formControlName="type">
            <option value="HOLIDAY">Feriado</option>
            <option value="VACATION">Férias</option>
          </select>
          <input type="date" formControlName="startDate">
          <input type="date" formControlName="endDate">
          <input type="text" formControlName="description" placeholder="Descrição">
          <button type="button" (click)="removeNonSchoolDay(i)">Remover</button>
        </div>
      </div>

      <button type="submit">Salvar</button>
    </form>
  `
})
