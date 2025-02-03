import { Injectable } from '@angular/core';
import * as monaco from 'monaco-editor';

@Injectable({
  providedIn: 'root',
})
export class MonacoService {
  constructor() {
    // Register your custom language
    monaco.languages.register({ id: 'lean' });

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

    monaco.languages.setMonarchTokensProvider('lean', {
      keywords,
      tokenizer: {
        root: [
          [
            /[a-zA-Z#][\w$]*/,
            {
              cases: {
                '@keywords': 'keyword',
                '@default': 'variable',
              },
            },
          ],
          [/".?"/, 'string'],
          [/\/\//, 'comment'],
        ],
      },
    });
  }
}
