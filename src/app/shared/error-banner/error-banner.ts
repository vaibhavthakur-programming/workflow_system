import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-banner.html',
  styleUrl: './error-banner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorBannerComponent {
  message = input<string | null>(null);
  dismiss = output<void>();

  onClose(): void {
    this.dismiss.emit();
  }
}

