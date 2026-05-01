import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-modal-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './modal-dialog.component.html',
  styleUrl: './modal-dialog.component.css'
})
export class ModalDialogComponent {
  @Input() visible: boolean = false;
  @Input() header: string = 'Dialog';
  @Input() width: string = '500px';
  @Input() styleClass: string = 'md:w-30rem';
  @Input() modal: boolean = true;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onHide = new EventEmitter<void>();

  onDialogHide() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.onHide.emit();
  }
}
