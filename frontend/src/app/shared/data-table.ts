import { Component } from '@angular/core';

@Component({
  selector: 'app-data-table',
  template: `
    <div class="data-table table-responsive">
      <table class="table"><ng-content /></table>
    </div>
  `,
})
export class DataTable {}
