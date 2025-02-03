import { Routes, Router } from '@angular/router';
import { MathComponent } from './math/math.component';
import { ProgrammingComponent } from './programming/programming.component';
import { HomeComponent } from './home/home.component';
import { ProblemsComponent } from './problems/problems.component';
import { AuthGuard } from './services/auth_guard.service';
import { inject } from '@angular/core';
import { WarningDialogComponent } from './warning_dialog/warning_dialog.component';
import { ProblemComponent } from './problem/problem.component';

const routesSimple: Routes = [
  { path: '', component: HomeComponent },
  { path: 'math', component: MathComponent },
  {
    path: 'programming',
    component: ProgrammingComponent,
  },
];

export const mathRouteNames: Array<string> = [
  'logic',
  'set',
  'combinatorics',
  'graph',
  'algebra',
  'computation',
  'linear',
  'calculus',
  'complex',
  'probability',
  'topology',
  'functionalAn',
  'differential',
  'algtop',
  'number',
  'category',
];

export const mathTitles: Array<string> = [
  'Logic',
  'Set theory',
  'Combinatorics',
  'Graph theory',
  'Algebra',
  'Theory of computation',
  'Linear algebra and geometry',
  'Real analysis',
  'Complex analysis',
  'Probability theory',
  'Functional analysis',
  'Topology',
  'Differential geometry',
  'Algebraic topology',
  'Number theory',
  'Category theory',
];

const mathRoutes: Routes = mathRouteNames.map((path, index) => ({
  path: 'math/' + path,
  component: ProblemsComponent,
  data: { title: mathTitles[index] },
}));

export const programmingRouteNames: Array<string> = [
  'hardware',
  'compiler',
  'dsa',
  'streaming',
  'external',
  'operating',
  'concurrency',
  'functionalProg',
  'distributed',
  'networking',
  'databases',
  'security',
  'system',
  'manAn',
  'ml',
  'quantum',
];

export const programmingTitles: Array<string> = [
  'Computer architecture',
  'Compilers and translators',
  'Data structures and algorithms',
  'Streaming algorithms',
  'External memory algorithms',
  'Operating systems',
  'Concurrency',
  'Functional programming and type theory',
  'Distributed systems',
  'Networking',
  'Databases',
  'Security',
  'System design',
  'Data management/analytics',
  'Data science/Machine learning',
  'Quantum computing',
];

const programmingRoutes: Routes = programmingRouteNames.map((path, index) => ({
  path: 'programming/' + path,
  component: ProblemsComponent,
  data: { title: programmingTitles[index] },
}));

const routes_with_math: Routes = routesSimple.concat(mathRoutes);
const routes_with_math_and_programming =
  routes_with_math.concat(programmingRoutes);

routes_with_math_and_programming.push({
  path: 'math/:param1/:param2',
  component: ProblemComponent,
});
routes_with_math_and_programming.push({
  path: 'programming/:param1/:param2',
  component: ProblemComponent,
});

routes_with_math_and_programming.push({
  path: '**',
  redirectTo: '/',
});

export const routes = routes_with_math_and_programming;

export const math_indices: { [key: string]: number } = {
  logic: 0,
  set: 1,
  combinatorics: 2,
  graph: 3,
  algebra: 4,
  computation: 5,
  linear: 6,
  calculus: 7,
  complex: 8,
  probability: 9,
  topology: 10,
  functionalAn: 11,
  differential: 12,
  algtop: 13,
  number: 14,
  category: 15,
};

export const programming_indices: { [key: string]: number } = {
  hardware: 0,
  compiler: 1,
  dsa: 2,
  streaming: 3,
  external: 4,
  operating: 5,
  concurrency: 6,
  functionalProg: 7,
  distributed: 8,
  networking: 9,
  databases: 10,
  security: 11,
  system: 12,
  manAn: 13,
  ml: 14,
  quantum: 15,
};
