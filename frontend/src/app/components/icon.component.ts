import { Component, input } from '@angular/core';

const PATHS: Record<string, string> = {
  book: 'M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H4V4Zm9 3a3 3 0 0 1 3-3h5v14h-4a4 4 0 0 0-4 3',
  home: 'M3 11 12 3l9 8M5 10v11h5v-7h4v7h5V10',
  tasks: 'M9 5h11M9 12h11M9 19h11M3 5l1 1 2-2M3 12l1 1 2-2M3 19l1 1 2-2',
  plus: 'M12 5v14M5 12h14',
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  clock: 'M12 8v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  check: 'm5 12 4 4L19 6',
  circle: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  edit: 'm15 5 4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15v5Z',
  trash: 'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7',
  close: 'm6 6 12 12M6 18 18 6',
  calendar: 'M8 3v4m8-4v4M4 10h16M4 5h16v16H4V5',
  filter: 'M3 6h18M6 12h12M9 18h6',
  cap: 'm2 9 10-5 10 5-10 5L2 9Zm4 2v6q6 5 12 0v-6m4-2v8',
};
@Component({
  selector: 'app-icon',
  template:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path [attr.d]="paths[name()] || paths[\'circle\']" /></svg>',
  styles:
    ':host{display:inline-flex;width:1.25em;height:1.25em;flex-shrink:0;vertical-align:middle}svg{width:100%;height:100%}',
})
export class IconComponent {
  readonly name = input('circle');
  protected readonly paths = PATHS;
}
