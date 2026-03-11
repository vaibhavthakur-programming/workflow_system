import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorBannerComponent } from './error-banner/error-banner';

@NgModule({
  imports: [CommonModule, ErrorBannerComponent],
  exports: [ErrorBannerComponent],
})
export class SharedModule {}
