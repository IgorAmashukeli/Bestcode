import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeApp as initializeApp_alias,
  provideFirebaseApp,
} from '@angular/fire/app';
import { getAuth as getAuth_alias, provideAuth } from '@angular/fire/auth';
import {
  MonacoEditorModule,
  NgxMonacoEditorConfig,
} from 'ngx-monaco-editor-v2';
import { provideHttpClient, withFetch } from '@angular/common/http';

export function myMonacoLoad() {
  (window as any).monaco.languages.register({ id: 'lean' });

  let keywords = [
    'skip',
    'tactic',
    'conv',
    'lhs',
    'arg',
    'congr',
    '#check_failure',
    'class',
    'extends',
    'noncomputable',
    'mutual',
    'funext',
    'injection',
    'using',
    'Type',
    'Sort',
    '#reduce',
    'Prop',
    'theorem',
    'fun',
    'def',
    '#check',
    '#eval',
    'universe',
    'if',
    'then',
    'else',
    'let',
    'variable',
    '#print',
    'section',
    'end',
    'namespace',
    'open',
    'axiom',
    'show',
    'from',
    'example',
    'have',
    'sorry',
    'admit',
    'calc',
    'by',
    'rw',
    'simp',
    'infix',
    'where',
    'instance',
    'set_option',
    'match',
    'inductive',
    'export',
    'renaming',
    'prefix',
    'postfix',
    'with',
    'assumption',
    'notation',
    'apply',
    'exact',
    'case',
    'intro',
    'intros',
    'rename_i',
    'rfl',
    'repeat',
    'revert',
    'generalize',
    'constructor',
    'cases',
    'try',
    'any_goals',
    'exists',
    'at',
    'local',
    'attribute',
    'split',
    'deriving',
    'structure',
  ];

  (window as any).monaco.languages.setMonarchTokensProvider('lean', {
    keywords,
    tokenizer: {
      root: [
        [
          /[a-zA-Z#][\w$]*/,
          {
            cases: {
              '@keywords': 'keyword',
              '@default': 'identifier',
            },
          },
        ],
        [/".*?"/, 'string'],
        [/--.*$/, 'comment'],
        [/[{}()[\],;]/, 'delimiter'],
      ],
    },
  });

  (window as any).monaco.editor.defineTheme('myCoolTheme', {
    base: 'vs-dark',
    inherit: false,
    rules: [
      { token: 'keyword', foreground: 'cc76d8', fontStyle: 'bold' },
      { token: 'identifier', foreground: '55afea' },
      { token: 'string', foreground: '98C379' },
      { token: 'comment', foreground: '808080' },
      { token: 'delimiter', foreground: 'ABB2BF' },
    ],
    colors: {
      'editor.foreground': '#FFFFFF',
      'editorLineNumber.foreground': '#808080',
      'editorLineNumber.activeForeground': '#FFFFFF',
    },
  });

  (window as any).monaco.editor.create(document.getElementById('mon-editor'), {
    theme: 'myCoolTheme',
    readOnly: false,
  });
}

const monacoConfig: NgxMonacoEditorConfig = {
  onMonacoLoad: myMonacoLoad,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideAnimations(),
    provideHttpClient(withFetch()),

    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
      provideAuth(() => getAuth()),
      MonacoEditorModule.forRoot(monacoConfig)
    ),
  ],
};
