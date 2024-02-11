import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CodeFormatterService {

  readonly CODE_TEXT_PATTERN = /```([\s\S]*?)```/g;
  readonly BOLD_TEXT_PATTERN = /\*\*(.*?)\*\*/g;

  constructor() { }

  formatCode(text: string): string {
    return  text.replace(this.CODE_TEXT_PATTERN, function(_, code: string) {
      return `<pre style="border-radius: 8px;"><code>${code}</code></pre>`;
    });
  }

  formatBoldText(text: string): string {
    return text.replace(this.BOLD_TEXT_PATTERN, "<strong>$1</strong>");
  }
}
