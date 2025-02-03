export type Problem = {
  id: number;
  course: string;
  title: string;
  difficulty: string;
  video_id: string;
  accepted: number;
  submitted: number;
  description_text: string;
  examples: Array<string>;
  constraints: Array<string>;
  note: string;
  languages: Array<Array<string>>;
  initial_codes: any;
  initial_language: string;
};

function add_lines(array_str: Array<string>) {
  return array_str.join('\n\n');
}

function add_br(array_str: Array<string>) {
  return array_str.join('<br>');
}

const first_problem_code: Array<string> = [
  '--your proof goes here',

  'theorem neg_true {p : Prop} : ¬ True ↔ False := by admit',
  'theorem neg_false {p : Prop} : ¬ False ↔ True := by admit',

  'theorem conj_true {p : Prop} : p ∧ True ↔ p := by admit',
  'theorem conj_false {p : Prop} : p ∧ False ↔ False := by admit',

  'theorem disj_true {p : Prop} : p ∨ True ↔ True := by admit',
  'theorem disj_false {p : Prop} : p ∨ False ↔ p := by admit',

  'theorem impl_true {p : Prop} : p → True ↔ True := by admit',
  'theorem true_impl {p : Prop} : True → p ↔ p := by admit',
  'theorem impl_false {p : Prop} : p → False ↔ ¬ p := by admit',
  'theorem false_impl {p : Prop} : False → p ↔ True := by admit',

  'theorem axiomatic_rule {p : Prop} : p → p := by admit',
  'theorem trivial_equivalence {p : Prop} : p ↔ p := by admit',

  'theorem conj_idemp {p : Prop} : p ↔ p ∧ p := by admit',
  'theorem disj_idemp {p : Prop} : p ↔ p ∨ p := by admit',

  'theorem conj_comm {p q : Prop} : (p ∧ q) ↔ (q ∧ p) := by admit',
  'theorem disj_comm {p q : Prop} : (p ∨ q) ↔ (q ∨ p) := by admit',
  'theorem impl_comm {p q : Prop} : (p ↔ q) ↔ (q ↔ p) := by admit',

  'theorem conj_assoc {p q r : Prop} : (p ∧ q) ∧ r ↔ p ∧ (q ∧ r) := by admit',
  'theorem disj_assoc {p q r : Prop} : (p ∨ q) ∨ r ↔ p ∨ (q ∨ r) := by admit',

  'theorem conj_disj_distrib {p q r : Prop} : p ∧ (q ∨ r) ↔ (p ∧ q) ∨ (p ∧ r) := by admit',
  'theorem disj_conj_distrib {p q r : Prop} : p ∨ (q ∧ r) ↔ (p ∨ q) ∧ (p ∨ r) := by admit',

  'theorem morgan_disj {p q : Prop} :  ¬(p ∨ q) ↔ ¬p ∧ ¬q := by admit',
  'theorem morgan_conj_mpr {p q : Prop} : ¬p ∨ ¬q → ¬(p ∧ q) := by admit',

  'theorem impl_def_mpr {p q : Prop} : (¬p ∨ q) → (p → q) := by admit',
  'theorem neg_imp_def_mpr {p q : Prop} : p ∧ ¬q → ¬(p → q) := by admit',
  'theorem neg_to_impl {p q : Prop} : ¬p → (p → q) := by admit',
  'theorem contraposition_mp {p q : Prop} : (p → q) → (¬q → ¬p) := by admit',

  'theorem exportation_law {p q r : Prop} : (p → (q → r)) ↔ (p ∧ q → r) := by admit',

  'theorem cases_impl_left {p q r : Prop} : ((p ∨ q) → r) ↔ (p → r) ∧ (q → r) := by admit',

  'theorem syllogism {p q r : Prop} : (p → q) → (q → r) → (p → r) := by admit',

  'theorem disj_congr {p q r : Prop} : (p ↔ q) -> ((p ∨ r) ↔ (q ∨ r)) := by admit',
  'theorem conj_congr {p q r : Prop} : (p ↔ q) -> ((p ∧ r) ↔ (q ∧ r)) := by admit',
  'theorem impl_congr_right {p q r : Prop} : (p ↔ q) → ((p → r) ↔ (q → r)) := by admit',
  'theorem impl_congr_left {p q r : Prop} : (p ↔ q) → ((r → p) ↔ (r → q)) := by admit',
  'theorem iff_congr_ {p q r : Prop} : (p ↔ q) → ((p ↔ r) ↔ (q ↔ r)) := by admit',

  'theorem iff_conj_intro{p q r : Prop} : (p ↔ q) → (p ↔ r) → (p ↔ (q ∧ r)) := by admit',
  'theorem iff_transitivity {p q r : Prop} : (p ↔ q) -> (q ↔ r) → (p ↔ r) := by admit',

  'theorem no_contradiction {p : Prop} : ¬ (p ∧ ¬ p) := by admit',

  'theorem negation_not_equiv {p : Prop} : ¬(p ↔ ¬p) := by admit',
  'theorem double_negation_mp {p : Prop} : p → ¬¬ p := by admit',

  'open Classical',

  'theorem tnd {p : Prop} : p ∨ ¬ p := by admit',

  'theorem double_negation {p : Prop} : p ↔ ¬¬p := by admit',

  'theorem cases_analysis {p q : Prop} : (p → q) → (¬p → q) → q := by admit',

  'theorem cases_impl_right {p q r : Prop} : (p → q ∨ r) → ((p → q) ∨ (p → r)) := by admit',

  'theorem Morgan_disj {p q : Prop} : ¬ (p ∧ q) ↔ ¬p ∨ ¬q := by admit',

  'theorem neg_imp_def {p q : Prop} :  ¬ (p → q) ↔ p ∧ ¬ q := by admit',
  'theorem imp_def {p q : Prop} : (p → q) ↔ (¬p ∨ q) := by admit',
  'theorem contraposition {p q : Prop} : (p → q) ↔ (¬q → ¬p) := by admit',

  'theorem peirce {p q : Prop} : (((p → q) → p) → p) := by admit',
];

const first_description: Array<string> = [
  '<br>Propositions with constants:',
  '<b>- ¬ False ↔ True</b>',
  '<b>- ¬ True ↔ False</b>',
  '<b>- p ∧ True ↔ p</b>',
  '<b>- p ∧ False ↔ False</b>',
  '<b>- p ∨ True ↔ True</b>',
  '<b>- p ∨ False ↔ p</b>',
  '<b>- p → True ↔ True</b>',
  '<b>- True → p ↔ p</b>',
  '<b>- p → False ↔ ¬p</b>',
  '<b>- False → p ↔ True</b>',
  '<br>Reflexivity propositions:',
  '<b>- p → p</b>',
  '<b>- p ↔ p</b>',
  '<b>- p ↔ p ∧ p</b>',
  '<b>- p ↔ p ∨ p</b>',
  '<br>Commutativity propositions:',
  '<b>- (p ∧ q) ↔ (q ∧ p)</b>',
  '<b>- (p ∨ q) ↔ (q ∨ p)</b>',
  '<b>- (p ↔ q) ↔ (q ↔ p)</b>',
  '<br>Associativity propositions:',
  '<b>- (p ∧ q) ∧ r ↔ p ∧ (q ∧ r)</b>',
  '<b>- (p ∨ q) ∨ r ↔ p ∨ (q ∨ r)</b>',
  '<br>Distributivity propositions:',
  '<b>- p ∧ (q ∨ r) ↔ (p ∧ q) ∨ (p ∧ r)</b>',
  '<b>- p ∨ (q ∧ r) ↔ (p ∨ q) ∧ (p ∨ r)</b>',
  '<br>De Morgan law:',
  '<b>- ¬(p ∨ q) ↔ ¬p ∧ ¬q</b>',
  '<b>- ¬ (p ∧ q) ↔ ¬p ∨ ¬q</b>',
  '<br>Implication and negation propositions relationship:',
  '<b>- (p → q) ↔ (¬p ∨ q)</b>',
  '<b>- ¬ (p → q) ↔ p ∧ ¬ q</b>',
  '<b>- (p → q) ↔ (¬q → ¬p)</b>',
  '<b>- ¬p → (p → q)</b>',
  '<br>Exportation law propostions:',
  '<b>- (p → (q → r)) ↔ (p ∧ q → r)</b>',
  'Implication and disjunction propositions relationship:',
  '<b>- ((p ∨ q) → r) ↔ (p → r) ∧ (q → r)</b>',
  '<b>- (p → q ∨ r) → ((p → q) ∨ (p → r))</b>',
  '<br>Syllogism:',
  '<b>- (p → q) → (q → r) → (p → r)</b>',
  '<br>Congruence propositions:',
  '<b>- (p ↔ q) -> ((p ∨ r) ↔ (q ∨ r))</b>',
  '<b>- (p ↔ q) -> ((p ∧ r) ↔ (q ∧ r))</b>',
  '<b>- (p ↔ q) → ((p → r) ↔ (q → r))</b>',
  '<b>- (p ↔ q) → ((r → p) ↔ (r → q))</b>',
  '<b>- (p ↔ q) → ((p ↔ r) ↔ (q ↔ r)</b>',
  '<br>Implication and conjunction propositions relationship:',
  '<b>- (p ↔ q) → (p ↔ r) → (p ↔ (q ∧ r))</b>',
  '<br>Transitivity of eqiuvalence propositions:',
  '<b>- (p ↔ q) -> (q ↔ r) → (p ↔ r)</b>',
  '<br>Propositions with negation:',
  '<b>- ¬(p ∧ ¬p)</b>',
  '<b>- ¬(p ↔ ¬p)</b>',
  '<b>- p ∨ ¬ p</b>',
  '<b>- p ↔ ¬¬p</b>',
  '<br>Cases analysis propositions',
  '<b>- (p → q) → (¬p → q) → q</b>',
  '<br>Pierce law:',
  '<b>- (((p → q) → p) → p)</b>',
];

export const math_problems: Array<Array<Problem>> = [
  [
    {
      id: 0,
      course: '/math/logic',
      title: 'Propositional tautologies',
      difficulty: 'Easy',
      video_id: 'y3svPgyGnLc',
      accepted: 0,
      submitted: 0,
      description_text:
        'This is task to prove, using <b>LEAN 4</b> language. <br> Proofs should be done, using <b>tactics</b>. <br> In each math problem you will be given a list of permitted/forbidden tactis. <br> To proof each theorem, remove <b>"admit"</b> and replace it with <b>proof tree of tactics</b>.<br> To make it simplier, use curly brackets, when need to prove multiple cases.<br><br> <br> Proof the following propositional tautologies. <br> Suppose, <b>p</b>, <b>q</b> and <b>r</b> - propositional variables. <br><br>' +
        add_br(first_description),
      examples: [],
      constraints: [],
      note: '<br> Note that in this task you are allowed to use only the following tactics: <br><br>- <i>Hypothesis renaming: </i> <b>rename_i</b> <br>- <i>Hypothesis selection</i>: <b>exact h</b>, where h is the current hypothesis and <b>assumption</b><br><br>- ∧ <i>introduction</i>: <b>apply And.intro</b><br>- ∧ <i>elimination</i>: <b>cases h with | intro h₁ h₂ =></b>, where h is then current hypothesis and h₁, h₂ are new hypothesis names<br><br>- ∨ <i>introduction left</i>: <b>apply Or.inl</b><br> - ∨ <i>introduction right</i>: <b>apply Or.inr</b><br> - ∨ <i>elimination</i>: <b>cases h {} {}</b>, where h is the current hypothesis<br><br>- → <i>introduction:</i> <b>intro h</b>, where h is a new hypothesis name<br>- → <i>elimination: </i> <b>apply h</b>, where h is such current hypothesis that has type <b>g → goal</b> for some proposition <b>g</b> <br><br>- ¬ <i>introduction</i> - <b>intro h</b>, where h is a new hypothesis<br> - ¬ <i>elimination: </i> <b> apply byContradiction</b>* <br> <br> <i>True introduction: </i> <b>apply True.true</b> <br> <br> Also remember that <b>¬ p</b> is <b>p → False</b> and you may want to use → rules.<br><br> You are allowed to <b>apply</b> any theorem, proved upper. <br> You are also allowed to create your own helper theorems and prove them, using aforesaid tactics or previously proved (including your another own helper) theorems. <br><br> *Note that you are allowed to use <b>apply byContradiction</b> only for the theorems below <i>open Classical</i> statement. <br> <br> For reference, see this documentation: <a href="https://leanprover.github.io/theorem_proving_in_lean4/title_page.html">LEAN 4 proving</a>',
      languages: [['LEAN', 'lean']],
      initial_codes: {
        lean: add_lines(first_problem_code),
      },
      initial_language: 'lean',
    },
  ],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
];

export const programming_problems: Array<Array<Problem>> = [
  [],
  [],
  [
    {
      id: 0,
      course: '/programming/dsa',
      title: 'Sample template problem',
      difficulty: 'Easy',
      video_id: 'y3svPgyGnLc',
      accepted: 0,
      submitted: 0,
      description_text:
        'Given two integers: <b><b>n</b></b> and <b>k</b>, return <b>n + k</b>',
      examples: [
        '\t<b><b>Input</b></b>: n = 1, k = 2<br>\t<b><b>Output</b></b>: 3<br>\t<b><b>Explanation</b></b>: n + k = 1 + 2 = 3',
        '\t<b><b>Input</b></b>: n = 2, k = 2<br>\t<b><b>Output</b></b>: 4<br>',
        '\t<b><b>Input</b></b>: n = 3, k = 3<br>\t<b><b>Output</b></b>: 6<br>',
      ],
      constraints: ['1 <= n <= 3', '2 <= k <= 4'],
      note: '<b><b>Follow up</b></b>: Can you do it in <b>O(1)</b>?',
      languages: [
        ['C++', 'cpp'],
        ['Python', 'python'],
        ['JavaScript', 'javascript'],
        ['Java', 'java'],
      ],
      initial_codes: {
        cpp: '#include <iostream>\n\nint summa(int n, int k) {\n    // your code here\n}\n\nint main() {\n    // your code here\n}',
        python: '#your code here:\ndef my_function(n, k):\nreturn 0',
        javascript:
          '//your code here\nfunction myFunction(n, k) {\n\n    return 0;\n}',
        java: '//your code here\npublic class MyClass {\n    public static void myFunction(int n, int k) {\n        // Your Java code here\n        return 0;\n    }\n\n    public static void main(String[] args) {}\n}',
      },
      initial_language: 'cpp',
    },
  ],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
];
