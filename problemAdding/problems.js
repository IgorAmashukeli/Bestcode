const fs = require('fs');

function add_lines(array_str) {
    return array_str.join('\n\n');
}


const sixth_problem_code = 
[
'-- previous problem defitions',
'def exists_unique (P : α → Prop) : Prop := (∃ (x : α), P x ∧ (∀ y : α, (P y → x = y)))',
'open Lean TSyntax.Compat in',
'macro "∃!" xs:explicitBinders ", " b:term : term => expandExplicitBinders ``exists_unique xs b',
'axiom Set : Type',
'axiom membership : Set → Set → Prop',
'infix:50 (priority := high) " ∈ " => membership',
'infix:50 (priority := high) " ∉ " => (fun (x : Set) => (fun (y : Set) => ¬ membership x y))',
'axiom prop_to_set (P : Set → Prop) (h : ∃! x, P x) : Set',
'axiom set_to_prop (P : Set → Prop) (h : ∃! x, P x) : P (prop_to_set P h) ∧ ∀ x, x ≠ prop_to_set P h → ¬P x',
'def forall_in_A (P : Set → Prop) (A : Set) : Prop := (∀ x, (x ∈ A → P x))',
'def exists_in_A (P : Set → Prop) (A : Set) : Prop := (∃ x, (x ∈ A ∧ P x))',
'def exists_uniq_in_A (P : Set → Prop) (A : Set) : Prop := (∃! x, (x ∈ A ∧ P x))',
'declare_syntax_cat idents',
'syntax ident : idents',
'syntax ident idents : idents',
'syntax "∀" idents "∈" term ";" term : term',
'syntax "∃" idents "∈" term ";" term : term',
'syntax "∃!" idents "∈" term ";" term : term',
'macro_rules',
'  | `(∀ $idnt:ident ∈ $A:term; $b:term)  => `(forall_in_A (fun $idnt:ident => $b) $A)',
'  | `(∀ $idnt:ident $idnts:idents ∈ $A:term; $b:term) => `(forall_in_A (fun $idnt:ident => (∀ $idnts:idents ∈ $A; $b)) $A)',
'  | `(∃ $idnt:ident ∈ $A:term; $b:term)  => `(exists_in_A (fun $idnt:ident => $b) $A)',
'  | `(∃ $idnt:ident $idnts:idents ∈ $A:term; $b:term) => `(exists_in_A (fun $idnt:ident => (∀ $idnts:idents ∈ $A; $b)) $A)',
'  | `(∃! $idnt:ident ∈ $A:term; $b:term)  => `(exists_uniq_in_A (fun $idnt:ident => $b) $A)',
'  | `(∃! $idnt:ident $idnts:idents ∈ $A:term; $b:term) => `(exists_uniq_in_A (fun $idnt:ident => (∀ $idnts:idents ∈ $A; $b)) $A)',
'def empty (A : Set) : Prop := ∀ b, (b ∉ A)',
'def non_empty (A : Set) : Prop := ∃ b, (b ∈ A)',
'def subset (A B : Set) : Prop := ∀ x ∈ A; x ∈ B',
'def is_successor (m n : Set) : Prop := ∀ x, (x ∈ n ↔ x ∈ m ∨ x = m)',
'infix:50 (priority := high) " ⊆ " => subset',
'axiom exists_unique_empty : (∃! x, empty x)',
'axiom unique_unordered_pair : (∀ a₁ a₂, ∃! C, ∀ x, (x ∈ C ↔ x = a₁ ∨ x = a₂))',
'axiom unique_union : ∀ A, ∃! B, ∀ x, (x ∈ B ↔ ∃ y ∈ A; x ∈ y)',
'axiom unique_specification (P : Set → Prop) : (∀ A, ∃! B, ∀ x, (x ∈ B ↔ x ∈ A ∧ P x))',
'axiom unique_boolean : (∀ A, ∃! B, ∀ x, (x ∈ B ↔ x ⊆ A))',
'noncomputable def empty_set := prop_to_set empty exists_unique_empty',
'noncomputable def unordered_pair_set : (Set → Set → Set) := fun (a₁ : Set) => fun (a₂ : Set) =>',
'  prop_to_set (fun (B) => ∀ x, (x ∈ B ↔ x = a₁ ∨ x = a₂)) (unique_unordered_pair a₁ a₂)',
'noncomputable def singleton_set : (Set → Set) := fun (a) => unordered_pair_set a a',
'noncomputable def union_set : (Set → Set) := fun (A) => prop_to_set (fun (B) => ∀ x, (x ∈ B ↔ ∃ y ∈ A; x ∈ y)) (unique_union A)',
'noncomputable def specification_set (P : Set → Prop) : (Set → Set) :=',
'  fun (A) => prop_to_set (fun (B) => (∀ x, x ∈ B ↔ x ∈ A ∧ P x)) (unique_specification P A)',
'notation (priority := high) "∅" => empty_set',
'notation (priority := high) "{" a₁ ", " a₂ "}" => unordered_pair_set a₁ a₂',
'notation (priority := high) "{" a "}" => singleton_set a',
'notation (priority := high) "⋃" => union_set',
'syntax "{" ident "∈" term "|" term "}" : term',
'macro_rules',
'  | `({ $x:ident ∈ $A:term | $property:term })  => `(specification_set (fun ($x) => $property) $A)',
'noncomputable def union_2sets (A B : Set) := ⋃ {A, B}',
'infix:60 (priority:=high) " ∪ " => union_2sets',
'noncomputable def intersect_2sets (A B : Set) := {x ∈ A | x ∈ B}',
'infix:60 (priority:=high) " ∩ " => intersect_2sets',
'noncomputable def difference (A B : Set) := {x ∈ A | x ∉ B}',
'infix:60 (priority:=high) " \\\\ " => difference',
'noncomputable def symmetric_difference (A B : Set) := (A \\ B) ∪ (B \\ A)',
'infix:60 (priority:=high) " △ " => symmetric_difference',
'noncomputable def intersection_set : Set → Set := fun (A) => {x ∈ ⋃ A | ∀ y ∈ A; x ∈ y}',
'notation (priority := high) "⋂" => intersection_set',
'declare_syntax_cat set_comprehension',
'syntax term "; " set_comprehension : set_comprehension',
'syntax term : set_comprehension',
'syntax "{" set_comprehension "}" : term',
'macro_rules',
'| `({$term1:term; $term2:term}) => `(unordered_pair_set $term1:term $term2:term)',
'| `({$elem:term; $rest:set_comprehension}) => `({$rest:set_comprehension} ∪ {$elem:term})',
'noncomputable def boolean_func_sym : Set → Set :=',
'  fun (A : Set) => prop_to_set (fun (B : Set) => ∀ x, (x ∈ B ↔ x ⊆ A)) (unique_boolean A)',
'notation (priority := high) "ℙow" => boolean_func_sym',

'-- (a₁, a₂) (ordered pair) construction',
'noncomputable def ordered_pair_set (a b : Set) := {{a}, {a, b}}',
'notation (priority := high) "(" a₁ ", " a₂ ")" => ordered_pair_set a₁ a₂',

'-- ordered pair main property',
'theorem ordered_pair_set_prop : ∀ a b c d, (a, b) = (c, d) ↔ (a = c ∧ b = d) := sorry',

'-- set, where ordered pair "lives"',
'theorem ordered_pair_set_belonging: ∀ A B, ∀ a ∈ A; ∀ b ∈ B; (a, b) ∈ ℙow (ℙow (A ∪ B)) := sorry',


'-- interesting ways to deconstruct ordered pairs',
'theorem inter_pair_is_singl_fst : ∀ a b, ⋂ (a, b) = {a} := sorry',
'theorem union_pair_is_all_coords : ∀ a b, ⋃ (a, b) = {a, b} := sorry',
'theorem coordinates_snd_corr_lemma : ∀ a b, {x ∈ ⋃ (a, b) | ⋃ (a, b) ≠ ⋂ (a, b) → x ∉ ⋂ (a, b)} = {b} := sorry',

'-- first coordinate and second coordinate projectors',
'noncomputable def fst_coor (A : Set) : Set := ⋃ (⋂ A)',
'noncomputable def snd_coor (A : Set) : Set := ⋃ ({x ∈ ⋃ A | ⋃ A ≠ ⋂ A → x ∉ ⋂ A})',

'-- ordered pair projectors main property',
'theorem coordinates_fst_coor : ∀ a b, fst_coor (a, b) = a := sorry',
'theorem coordinates_snd_copr : ∀ a b, snd_coor (a, b) = b := sorry',


'-- A × B (cartesian product) construction',
'noncomputable def cartesian_product (A : Set) (B : Set) : Set := {z ∈ ℙow (ℙow (A ∪ B)) | ∃ x ∈ A; ∃ y ∈ B; z = (x, y)}',
'infix:60 (priority:=high) " × " => cartesian_product',

'-- cartesian product main property',
'theorem cartesian_product_is_cartesian: ∀ A B pr, pr ∈ (A × B) ↔ (∃ x ∈ A; ∃ y ∈ B; pr = (x, y)) := sorry',


'-- cartesian product main property in terms of ordered pairs',
'theorem cartesian_product_pair_prop : ∀ A B a b, (a, b) ∈ (A × B) ↔ (a ∈ A ∧ b ∈ B) := sorry',

'-- tuple construction',
'-- ⁅a⁆, ⁅a, b⁆, ⁅a, b, c⁆, ⁅a, b, c, d⁆, ...',
'declare_syntax_cat pair_comprehension',
'syntax  pair_comprehension "; " term : pair_comprehension',
'syntax term : pair_comprehension',
'syntax "⁅" pair_comprehension "⁆" : term',
'macro_rules',
'| `(⁅ $term1:term⁆) => `($term1)',
'| `(⁅ $term1:term; $term2:term⁆) => `(ordered_pair_set $term1 $term2)',
'| `(⁅ $rest:pair_comprehension; $elem:term⁆) => `(ordered_pair_set ⁅$rest:pair_comprehension⁆ $elem:term)',



'-- binary relation property',
'noncomputable def binary_relation (R : Set) : Prop := ∀ z ∈ R; ∃ a, ∃ b, z = (a, b)',

'-- write (x . P . y) istead of (x, y) ∈ P',
'macro_rules',
'| `(($x:term . $P:term . $y:term)) => `(($x, $y) ∈ $P)',

'-- set, where first and second coordinates of pairs in binary relation "live"',
'theorem binary_relation_elements_set: ∀ R x y, (x . R . y) → (x ∈ ⋃ (⋃ R) ∧ y ∈ ⋃ (⋃ R)) := sorry',

'-- domain and range of binary relation',
'noncomputable def dom (R : Set) := {x ∈ ⋃ (⋃ R) | ∃ y, (x . R . y)}',
'noncomputable def rng (R : Set) := {y ∈ ⋃ (⋃ R) | ∃ x, (x . R . y)}',

'-- for binary relation R, U (U R) is actually domain ∪ range',
'theorem dom_rng_rel_prop: ∀ R, (binary_relation R) → (dom R ∪ rng R = ⋃ (⋃ R)) := sorry',


'-- main domain property',
'theorem dom_prop : ∀ R x, x ∈ dom R ↔ ∃ y, (x . R . y) := sorry',

'-- main range property',
'theorem rng_prop : ∀ R y, y ∈ rng R ↔ ∃ x, (x . R . y) := sorry',


'-- each binary relation is a subset of domain × range.',
'theorem binary_relation_prop : ∀ R, binary_relation R → R ⊆ dom R × rng R := sorry',
'-- each subset of cartesian product is binary relation with domain and range properties',
'theorem prop_then_binary_relation : ∀ A B R, R ⊆ A × B → binary_relation R ∧ dom R ⊆ A ∧ rng R ⊆ B := sorry',

'-- another domain and range property',
'theorem rel_dom_rng_elem : ∀ R, binary_relation R → ∀ x y, (x . R . y) → x ∈ dom R ∧ y ∈ rng R := sorry',


'-- union and intersection of binary relation is binary relation',

'theorem union2_rel_is_rel : ∀ P Q, binary_relation P → binary_relation Q → binary_relation (P ∪ Q) := sorry',
'theorem intersect2_rel_is_rel : ∀ P Q, binary_relation P → binary_relation Q → binary_relation (P ∩ Q) := sorry',



'-- binary relation, implemented as a cartesian product subset',
'noncomputable def binary_relation_between (A B R : Set) : Prop := R ⊆ A × B',
'noncomputable def binary_relation_on (A R : Set) : Prop := R ⊆ A × A',

'-- cartesian complement of any set is a binary relation',

'noncomputable def comp (A B R : Set) : Set := (A × B) \\ R',
'theorem comp_is_rel : ∀ A B R, binary_relation (comp A B R) := sorry',


'-- property, enough for subset of binary relation',

'theorem rel_subset : (∀ P Q, binary_relation P → binary_relation Q → (∀ x y, (x . P . y) → (x . Q . y)) → P ⊆ Q) := sorry',


'-- property, enough for equality of binary relation',

'theorem relation_equality : (∀ P Q, binary_relation P → binary_relation Q → ((∀ x y, (x . P . y) ↔ (x . Q . y)) → P = Q)) := sorry',


'-- R⁻¹ (inverse binary relation) construction',

'noncomputable def inv (R : Set) : Set := {z ∈ rng R × dom R | ∃ x, ∃ y, (z = (y, x) ∧ (x . R . y))}',
'syntax term"⁻¹" : term',
'macro_rules',
'| `($term1:term⁻¹) => `(inv $term1)',

'-- inverse binary relation is binary relation',
'theorem inv_is_rel : ∀ R, binary_relation R → (binary_relation (R⁻¹)) := sorry',


'-- inverse binary relation properties',

'theorem inv_pair_prop: ∀ R, binary_relation R → ∀ x y, (x . R . y) ↔ (y . (R⁻¹) . x):= sorry',
'theorem inv_prop : ∀ R, binary_relation R → (R⁻¹)⁻¹ = R := sorry',
'theorem inv_dom: ∀ R, binary_relation R → dom (R⁻¹) = rng R := sorry',
'theorem inv_rng: ∀ R, binary_relation R → rng (R⁻¹) = dom R := sorry',




'-- P ∘ Q (composition of binary relations) construction',

'noncomputable def composition (P Q : Set) : Set := {pr ∈ dom Q × rng P | ∃ x y, (pr = (x, y)) ∧ ∃ z, (x . Q . z) ∧ (z . P . y)}',
'infix:60 (priority:=high) " ∘ " => composition',

'-- composition of any sets is binary relation',
'theorem composition_is_rel : ∀ P Q, binary_relation (P ∘ Q) := sorry',


'-- composition properties',

'theorem composition_pair_prop : ∀ P Q, ∀ x y, (x . (P ∘ Q) . y) ↔ ∃ z, (x . Q . z) ∧ (z . P . y) := sorry',
'theorem composition_pair_assoc: ∀ P Q R x y, (x . ((P ∘ Q) ∘ R) . y) ↔ (x . (P ∘ (Q ∘ R)) . y) := sorry',
'theorem composition_assoc : ∀ P Q R, ((P ∘ Q) ∘ R) = (P ∘ (Q ∘ R)) := sorry',


'-- inverse of composition',

'theorem inv_composition_pair_prop : ∀ P Q, binary_relation P → binary_relation Q → (∀ x y, (x . ((P ∘ Q)⁻¹) . y) ↔ (x . ((Q⁻¹) ∘ P⁻¹) . y)) := sorry',
'theorem inv_composition_prop : ∀ P Q, binary_relation P → binary_relation Q → (P ∘ Q)⁻¹ = ((Q⁻¹) ∘ (P⁻¹)) := sorry',


'-- inverse of union',

'theorem inv_union_pair_prop : ∀ P Q, binary_relation P → binary_relation Q → ∀ x y, (x . ((P ∪ Q)⁻¹) . y) ↔ (x . (P⁻¹ ∪ Q⁻¹) . y) := sorry',
'theorem inv_union_prop : ∀ P Q, binary_relation P → binary_relation Q → (P ∪ Q)⁻¹ = ((P⁻¹) ∪ Q⁻¹) := sorry',

'-- complement of inverse',

'theorem comp_inv_prop_pair : ∀ P A B, binary_relation_between A B P → ∀ x y, (x . (comp A B (P⁻¹)) . y) ↔ (x . ((comp B A P)⁻¹) . y) := sorry',
'theorem comp_inv_prop : ∀ P A B, binary_relation_between A B P → comp A B (P⁻¹) = (comp B A P)⁻¹ := sorry',

'-- composition of union of relations and  relation',

'theorem union_composition_pair_prop_right : ∀ P Q R, ∀ x y, (x . ((P ∪ Q) ∘ R) . y) ↔ (x . ((P ∘ R) ∪ (Q ∘ R)) . y) := sorry',
'theorem union_composition_prop_right : ∀ P Q R, ((P ∪ Q) ∘ R) = ((P ∘ R) ∪ (Q ∘ R))  := sorry',
'theorem union_composition_pair_prop_left : ∀ P Q R, ∀ x y, (x . (P ∘ (Q ∪ R)) . y) ↔ (x . ((P ∘ Q) ∪ (P ∘ R)) . y) := sorry',
'theorem compostion_union_prop_left : ∀ P Q R, P ∘ (Q ∪ R) = (P ∘ Q) ∪ (P ∘ R) := sorry',


'-- subset-monotonic composition property',

'theorem monotonic_subset_composition_pair_right : ∀ P Q R, P ⊆ Q → (∀ x y, (x . (P ∘ R) . y) → (x . (Q ∘ R) . y)) := sorry',
'theorem monotonic_subset_composition_right : ∀ P Q R, P ⊆ Q → P ∘ R ⊆ Q ∘ R := sorry',
'theorem monotonic_subset_composition_pair_left : ∀ P Q R, P ⊆ Q → (∀ x y, (x . (R ∘ P) . y) → (x . (R ∘ Q) . y)) := sorry',
'theorem monotonic_subset_composition_left : ∀ P Q R, P ⊆ Q → R ∘ P ⊆ R ∘ Q := sorry',


'-- composition of intersection of binary relations and binary relation',

'theorem intersect2_composition_prop_right: ∀ P Q R, (P ∩ Q) ∘ R ⊆ (P ∘ R) ∩ (Q ∘ R) := sorry',
'theorem intersect2_composition_prop_left: ∀ P Q R, P ∘ (Q ∩ R) ⊆ (P ∘ Q) ∩ (P ∘ R) := sorry',


'-- identical binary relation',

'noncomputable def id_ (A : Set) : Set := {t ∈ (A × A) | ∃ x : Set, t = (x, x)}',
'theorem id_is_rel : ∀ A, binary_relation (id_ A) := sorry',


'-- id properties',

'theorem id_prop : ∀ A x y, (x . (id_ A) . y) → (((x = y) ∧ (x ∈ A)) ∧ (y ∈ A)) := sorry',
'theorem prop_then_id : ∀ A, ∀ x ∈ A; (x . (id_ A) . x) := sorry',

'-- inverse of id',

'theorem inv_id : ∀ A, ((id_ A)⁻¹) = (id_ A) := sorry',

'-- composition with id',

'theorem id_rel_composition_right : ∀ A B R, binary_relation_between A B R → (R ∘ (id_ A)) = R := sorry',
'theorem id_rel_composition_left : ∀ A B  R, binary_relation_between A B R → ((id_ B) ∘ R) = R := sorry',

'-- image of a binary relation',

'noncomputable def rel_image (X R : Set) := {b ∈ rng R | ∃ a ∈ X; (a . R . b)}',
'syntax  term ".[" term "]" : term',
'macro_rules',
'  | `($R:term .[ $X:term ])  => `(rel_image $X $R)',


'-- range is image of a domain',
'theorem rng_is_rel_image : ∀ R, binary_relation R → rng R = R.[dom R] := sorry',


'-- preimage is just image of inverse',
'-- but it can be deined differently',
'theorem rel_pre_image_eq : ∀ Y R, binary_relation R → R⁻¹.[Y] = {a ∈ dom R | ∃ b ∈ Y; (a . R . b)} := sorry',


'-- R ⊆ A × B => domain is preimage of B',
'theorem dom_preimage : ∀ A B P, binary_relation_between A B P → dom P = P⁻¹.[B] := sorry',

'-- image and preimage of union of binary relations',

'theorem rel_image_union : ∀ X Y R, binary_relation R → R.[X ∪ Y] = R.[X] ∪ R.[Y] := sorry',
'theorem rel_preimage_union : ∀ X Y R , binary_relation R → R⁻¹.[X ∪ Y] = R⁻¹.[X] ∪ R⁻¹.[Y] := sorry',

'-- subset-monotic image and preimage properties',

'theorem monotonic_rel_image : ∀ X Y R, binary_relation R → X ⊆ Y → R.[X] ⊆ R.[Y] := sorry',
'theorem monotonic_rel_preimage : ∀ X Y R, binary_relation R → X ⊆ Y → R⁻¹.[X] ⊆ R⁻¹.[Y] := sorry',

'-- image and preimage of binary relations property',

'theorem rel_image_inter : ∀ X Y R, binary_relation R → R.[X ∩ Y] ⊆ (R.[X] ∩ R.[Y]) := sorry',
'theorem rel_preimage_inter : ∀ X Y R, binary_relation R → R⁻¹.[X ∩ Y] ⊆ (R⁻¹.[X] ∩ R⁻¹.[Y]) := sorry',


'-- image and preimage of composition',

'theorem rel_image_composition : ∀ P Q X, (P ∘ Q).[X] = P.[Q.[X]] := sorry',
'theorem rel_preimage_composition : ∀ P Q X, binary_relation P → binary_relation Q → (P ∘ Q)⁻¹.[X] = Q⁻¹.[P⁻¹.[X]] := sorry',
]



const sixth_requirements = [
    'theorem ordered_pair_set_prop : ∀ a b c d, (a, b) = (c, d) ↔ (a = c ∧ b = d)',
    
    'theorem ordered_pair_set_belonging: ∀ A B, ∀ a ∈ A; ∀ b ∈ B; (a, b) ∈ ℙow (ℙow (A ∪ B))',
    
    
    'theorem inter_pair_is_singl_fst : ∀ a b, ⋂ (a, b) = {a}',
    'theorem union_pair_is_all_coords : ∀ a b, ⋃ (a, b) = {a, b}',
    'theorem coordinates_snd_corr_lemma : ∀ a b, {x ∈ ⋃ (a, b) | ⋃ (a, b) ≠ ⋂ (a, b) → x ∉ ⋂ (a, b)} = {b}',
  

    'theorem coordinates_fst_coor : ∀ a b, fst_coor (a, b) = a',
    'theorem coordinates_snd_copr : ∀ a b, snd_coor (a, b) = b',
    
    'theorem cartesian_product_is_cartesian: ∀ A B pr, pr ∈ (A × B) ↔ (∃ x ∈ A; ∃ y ∈ B; pr = (x, y))',
    

    'theorem cartesian_product_pair_prop : ∀ A B a b, (a, b) ∈ (A × B) ↔ (a ∈ A ∧ b ∈ B)',

    'theorem binary_relation_elements_set: ∀ R x y, (x . R . y) → (x ∈ ⋃ (⋃ R) ∧ y ∈ ⋃ (⋃ R))',
    
    'theorem dom_rng_rel_prop: ∀ R, (binary_relation R) → (dom R ∪ rng R = ⋃ (⋃ R))',
    
    
    'theorem dom_prop : ∀ R x, x ∈ dom R ↔ ∃ y, (x . R . y)',
    'theorem rng_prop : ∀ R y, y ∈ rng R ↔ ∃ x, (x . R . y)',
    

    'theorem binary_relation_prop : ∀ R, binary_relation R → R ⊆ dom R × rng R',
    'theorem prop_then_binary_relation : ∀ A B R, R ⊆ A × B → binary_relation R ∧ dom R ⊆ A ∧ rng R ⊆ B',
    'theorem rel_dom_rng_elem : ∀ R, binary_relation R → ∀ x y, (x . R . y) → x ∈ dom R ∧ y ∈ rng R',
    
    'theorem union2_rel_is_rel : ∀ P Q, binary_relation P → binary_relation Q → binary_relation (P ∪ Q)',
    'theorem intersect2_rel_is_rel : ∀ P Q, binary_relation P → binary_relation Q → binary_relation (P ∩ Q)',
    
    'theorem comp_is_rel : ∀ A B R, binary_relation (comp A B R)',

    
    'theorem rel_subset : (∀ P Q, binary_relation P → binary_relation Q → (∀ x y, (x . P . y) → (x . Q . y)) → P ⊆ Q)',
    

    
    'theorem relation_equality : (∀ P Q, binary_relation P → binary_relation Q → ((∀ x y, (x . P . y) ↔ (x . Q . y)) → P = Q))',


    'theorem inv_is_rel : ∀ R, binary_relation R → (binary_relation (R⁻¹))',
    
    
    'theorem inv_pair_prop: ∀ R, binary_relation R → ∀ x y, (x . R . y) ↔ (y . (R⁻¹) . x):= sorry',
    'theorem inv_prop : ∀ R, binary_relation R → (R⁻¹)⁻¹ = R',
    'theorem inv_dom: ∀ R, binary_relation R → dom (R⁻¹) = rng R',
    'theorem inv_rng: ∀ R, binary_relation R → rng (R⁻¹) = dom R',

    'theorem composition_is_rel : ∀ P Q, binary_relation (P ∘ Q)',
    
    
    'theorem composition_pair_prop : ∀ P Q, ∀ x y, (x . (P ∘ Q) . y) ↔ ∃ z, (x . Q . z) ∧ (z . P . y)',
    'theorem composition_pair_assoc: ∀ P Q R x y, (x . ((P ∘ Q) ∘ R) . y) ↔ (x . (P ∘ (Q ∘ R)) . y)',
    'theorem composition_assoc : ∀ P Q R, ((P ∘ Q) ∘ R) = (P ∘ (Q ∘ R))',
    
    
    'theorem inv_composition_pair_prop : ∀ P Q, binary_relation P → binary_relation Q → (∀ x y, (x . ((P ∘ Q)⁻¹) . y) ↔ (x . ((Q⁻¹) ∘ P⁻¹) . y))',
    'theorem inv_composition_prop : ∀ P Q, binary_relation P → binary_relation Q → (P ∘ Q)⁻¹ = ((Q⁻¹) ∘ (P⁻¹))',
    

    
    'theorem inv_union_pair_prop : ∀ P Q, binary_relation P → binary_relation Q → ∀ x y, (x . ((P ∪ Q)⁻¹) . y) ↔ (x . (P⁻¹ ∪ Q⁻¹) . y)',
    'theorem inv_union_prop : ∀ P Q, binary_relation P → binary_relation Q → (P ∪ Q)⁻¹ = ((P⁻¹) ∪ Q⁻¹)',
    

    
    'theorem comp_inv_prop_pair : ∀ P A B, binary_relation_between A B P → ∀ x y, (x . (comp A B (P⁻¹)) . y) ↔ (x . ((comp B A P)⁻¹) . y)',
    'theorem comp_inv_prop : ∀ P A B, binary_relation_between A B P → comp A B (P⁻¹) = (comp B A P)⁻¹',
    
    
    'theorem union_composition_pair_prop_right : ∀ P Q R, ∀ x y, (x . ((P ∪ Q) ∘ R) . y) ↔ (x . ((P ∘ R) ∪ (Q ∘ R)) . y)',
    'theorem union_composition_prop_right : ∀ P Q R, ((P ∪ Q) ∘ R) = ((P ∘ R) ∪ (Q ∘ R)) ',
    'theorem union_composition_pair_prop_left : ∀ P Q R, ∀ x y, (x . (P ∘ (Q ∪ R)) . y) ↔ (x . ((P ∘ Q) ∪ (P ∘ R)) . y)',
    'theorem compostion_union_prop_left : ∀ P Q R, P ∘ (Q ∪ R) = (P ∘ Q) ∪ (P ∘ R)',
    
    
    'theorem monotonic_subset_composition_pair_right : ∀ P Q R, P ⊆ Q → (∀ x y, (x . (P ∘ R) . y) → (x . (Q ∘ R) . y))',
    'theorem monotonic_subset_composition_right : ∀ P Q R, P ⊆ Q → P ∘ R ⊆ Q ∘ R',
    'theorem monotonic_subset_composition_pair_left : ∀ P Q R, P ⊆ Q → (∀ x y, (x . (R ∘ P) . y) → (x . (R ∘ Q) . y))',
    'theorem monotonic_subset_composition_left : ∀ P Q R, P ⊆ Q → R ∘ P ⊆ R ∘ Q',
    
    
    'theorem intersect2_composition_prop_right: ∀ P Q R, (P ∩ Q) ∘ R ⊆ (P ∘ R) ∩ (Q ∘ R)',
    'theorem intersect2_composition_prop_left: ∀ P Q R, P ∘ (Q ∩ R) ⊆ (P ∘ Q) ∩ (P ∘ R)',
    
    'theorem id_is_rel : ∀ A, binary_relation (id_ A)',

    
    'theorem id_prop : ∀ A x y, (x . (id_ A) . y) → (((x = y) ∧ (x ∈ A)) ∧ (y ∈ A))',
    'theorem prop_then_id : ∀ A, ∀ x ∈ A; (x . (id_ A) . x)',

    
    'theorem inv_id : ∀ A, ((id_ A)⁻¹) = (id_ A)',
    
    'theorem id_rel_composition_right : ∀ A B R, binary_relation_between A B R → (R ∘ (id_ A)) = R',
    'theorem id_rel_composition_left : ∀ A B  R, binary_relation_between A B R → ((id_ B) ∘ R) = R',


    'theorem rng_is_rel_image : ∀ R, binary_relation R → rng R = R.[dom R]',

    'theorem rel_pre_image_eq : ∀ Y R, binary_relation R → R⁻¹.[Y] = {a ∈ dom R | ∃ b ∈ Y; (a . R . b)}',
    
    
    'theorem dom_preimage : ∀ A B P, binary_relation_between A B P → dom P = P⁻¹.[B]',

    
    'theorem rel_image_union : ∀ X Y R, binary_relation R → R.[X ∪ Y] = R.[X] ∪ R.[Y]',
    'theorem rel_preimage_union : ∀ X Y R , binary_relation R → R⁻¹.[X ∪ Y] = R⁻¹.[X] ∪ R⁻¹.[Y]',
    
    'theorem monotonic_rel_image : ∀ X Y R, binary_relation R → X ⊆ Y → R.[X] ⊆ R.[Y]',
    'theorem monotonic_rel_preimage : ∀ X Y R, binary_relation R → X ⊆ Y → R⁻¹.[X] ⊆ R⁻¹.[Y]',
    
    
    'theorem rel_image_inter : ∀ X Y R, binary_relation R → R.[X ∩ Y] ⊆ (R.[X] ∩ R.[Y])',
    'theorem rel_preimage_inter : ∀ X Y R, binary_relation R → R⁻¹.[X ∩ Y] ⊆ (R⁻¹.[X] ∩ R⁻¹.[Y])',
    
    'theorem rel_image_composition : ∀ P Q X, (P ∘ Q).[X] = P.[Q.[X]]',
    'theorem rel_preimage_composition : ∀ P Q X, binary_relation P → binary_relation Q → (P ∘ Q)⁻¹.[X] = Q⁻¹.[P⁻¹.[X]]',

 ]


const document6 = {
    id: 2,
    course: '/math/set',
    title: 'Binary relations',
    difficulty: 'Easy',
    video_id: 'y3svPgyGnLc',
    accepted: 0,
    submitted: 0,
    description_text:
        'This is task to prove, using <b>LEAN 4</b> language. <br> Proofs should be done, by writing constructive <b>proof terms with the help of constructors and destructors</b>. <br> In each math problem you will be given a list of permitted constructors, destructors and theorems <br> To proof each theorem, remove <b>"sorry"</b> and replace it with <b>proof term</b>. <br> You can use following constructors and destructors: <br>' +
        'In this task you allowed to use all previously discussed theorems, constructors and destructors<br>' +
        'In this problem we will ordered pairs, cartesian products, binary relations, domain, range, inverse, composition, image, preimage and will prove theorems about them',
    examples: [],
    constraints: [],
    note: ' For reference, see this documentation: <a href="https://leanprover.github.io/theorem_proving_in_lean4/title_page.html">LEAN 4 proving</a>',
    languages: [['LEAN', 'lean']],
    initial_codes: {
        lean: add_lines(sixth_problem_code)
    },
    initial_language: 'lean',
    requirements: sixth_requirements
}

const jsonString = JSON.stringify(document6, null, 2)


fs.writeFile('output6.json', jsonString, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
  });