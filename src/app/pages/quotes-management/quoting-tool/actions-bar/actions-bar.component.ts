import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ngx-actions-bar',
  templateUrl: './actions-bar.component.html',
  styleUrls: ['./actions-bar.component.scss']
})
export class ActionsBarComponent implements OnInit {

  @Input() isSaving = false;
  @Input() isGenerating = false;
  @Input() isProcessing = false;
  @Input() status = '';

  constructor() { }

  @Output() close = new EventEmitter<any>();
  @Output() viewPricing = new EventEmitter<any>();
  @Output() saveQuote = new EventEmitter<any>();
  @Output() generateQuote = new EventEmitter<any>();

  ngOnInit(): void {
  }

  onViewPricing() {
    this.viewPricing.emit();
  }

  onCancel() {
    this.close.emit();
  }

  onSaveQuote() {
    this.saveQuote.emit();
  }

  onGenerateQuote() {
    this.generateQuote.emit();
  }
}
