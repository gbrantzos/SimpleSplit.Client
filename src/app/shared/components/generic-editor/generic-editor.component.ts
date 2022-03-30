import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { GenericFormComponent } from "@shared/components/generic-form/generic-form.component";
import { FormDefinition } from "@shared/services/schema.models";

@Component({
  selector: 'smp-generic-editor',
  templateUrl: './generic-editor.component.html',
  styleUrls: ['./generic-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericEditorComponent implements OnInit {
  @ViewChild('form') form: GenericFormComponent;
  @Input() definition: FormDefinition;
  @Input() model: any;
  @Input() allowDelete = false;
  @Input() closeEvent: () => void;
  @Input() submitEvent: (model: any) => void;
  @Input() deleteEvent: (model: any) => void;

  constructor() { }

  ngOnInit(): void { }

  onClose() { this.closeEvent(); }

  onDelete() {
    const model = {...this.model, ...this.form.getModel()};
    this.deleteEvent(model);
  }

  onSubmit() {
    const model = {...this.model, ...this.form.getModel()};
    this.submitEvent(model);
  }

  onModelChanged(event) {
    // console.log(event);
  }

}
