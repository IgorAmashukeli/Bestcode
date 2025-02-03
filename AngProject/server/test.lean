theorem neg_true : ¬ True ↔ False :=
   Iff.intro
   (fun (x : ¬ True) => (x True.intro))
   (fun (x : False) => False.elim x)


theorem neg_false : ¬ False ↔ True :=
   Iff.intro
   (fun (_ : ¬ False) => True.intro)
   (fun (_ : True) => (fun (g : False) => g))


theorem conj_true (p : Prop) : p ∧ True ↔ p :=
   Iff.intro
   (fun (x : p ∧ True) => And.left x)
   (fun (x : p) => And.intro x True.intro)


theorem conj_false (p : Prop) : p ∧ False ↔ False :=
   Iff.intro
   (fun (x : p ∧ False) => And.right x)
   (fun (x : False) => False.elim x)


theorem disj_true (p : Prop) : p ∨ True ↔ True :=
   Iff.intro
   (fun (_ : p ∨ True) => True.intro)
   (fun (x : True) => Or.inr x)


theorem disj_false (p : Prop) : p ∨ False ↔ p :=
   Iff.intro
   (fun (x : p ∨ False) => Or.elim x
                           (fun (y : p) => y)
                           (fun (y : False) => False.elim y)
   )
   (fun (x : p) => Or.inl x)



theorem impl_true (p : Prop) : p → True ↔ True :=
   Iff.intro
   (fun (_ : p → True) => True.intro)
   (fun (_ : True) => (fun (_ : p) => True.intro))



theorem true_impl (p : Prop) : True → p ↔ p :=
   Iff.intro
   (fun (x : True → p) => x True.intro)
   (fun (x : p) => (fun (_ : True) => x))



theorem impl_false (p : Prop) : p → False ↔ ¬ p :=
   Iff.intro
   (fun (x : p → False) => x)
   (fun (x : ¬ p) => x)



theorem false_impl (p : Prop) : False → p ↔ True :=
   Iff.intro
   (fun (_ : False → p) => True.intro)
   (fun (_ : True) => (fun (g : False) => False.elim g))



theorem axiomatic_rule (p : Prop) : p → p :=
   fun (x : p) => x


theorem trivial_equivalence (p : Prop) : p ↔ p :=
   Iff.intro
   (axiomatic_rule p)
   (axiomatic_rule p)


theorem conj_idemp (p : Prop) : p ↔ p ∧ p :=
   Iff.intro
   (fun (x : p) => And.intro x x)
   (fun (x : p ∧ p) => And.left x)



theorem disj_idemp (p : Prop) : p ↔ p ∨ p :=
   Iff.intro
   (fun (x : p) => Or.inl x)
   (fun (x : p ∨ p) => Or.elim x
                        (fun (g : p) => g)
                        (fun (g : p) => g)
   )


theorem absorbtion_disj (p q : Prop) : p ∨ (p ∧ q) ↔ p :=
   Iff.intro
   (
      fun (hppq) =>
         Or.elim (hppq)
         (
            axiomatic_rule p
         )
         (
            fun (hpq) => And.left hpq
         )
   )
   (
      fun (hp) =>
         Or.inl (hp)
   )


theorem absorbtion_conj (p q : Prop) : p ∧ (p ∨ q) ↔ p :=
   Iff.intro
   (
      fun (hppq) =>
         And.left hppq
   )
   (
      fun (hp) =>
         And.intro (hp) (Or.inl hp)
   )



theorem conj_comm (p q : Prop) : (p ∧ q) ↔ (q ∧ p) :=
   Iff.intro
   (fun (x : p ∧ q) => And.intro (And.right x) (And.left x))
   (fun (x : q ∧ p) => And.intro (And.right x) (And.left x))


theorem disj_comm (p q : Prop) : (p ∨ q) ↔ (q ∨ p) :=
   Iff.intro
   (fun (x : p ∨ q) => Or.elim x
                       (fun (g : p) => Or.inr g)
                       (fun (g : q) => Or.inl g)
   )
   (fun (x : q ∨ p) => Or.elim x
                       (fun (g : q) => Or.inr g)
                       (fun (g : p) => Or.inl g)
   )


theorem impl_comm (p q : Prop) : (p ↔ q) ↔ (q ↔ p) :=
   Iff.intro
   (fun (x : p ↔ q) => Iff.intro (Iff.mpr x) (Iff.mp x))
   (fun (x : q ↔ p) => Iff.intro (Iff.mpr x) (Iff.mp x))



theorem conj_assoc (p q r : Prop) : (p ∧ q) ∧ r ↔ p ∧ (q ∧ r) :=
   Iff.intro
   (fun (x : (p ∧ q) ∧ r) =>
      And.intro
      (And.left (And.left x))
      (And.intro
         (And.right (And.left x))
         (And.right x)
      )
   )

   (fun (x : p ∧ (q ∧ r)) =>
      And.intro
      (And.intro
      (And.left x)
      (And.left (And.right x))
      )
      (And.right (And.right x))
   )




theorem disj_assoc (p q r : Prop) : (p ∨ q) ∨ r ↔ p ∨ (q ∨ r) :=
   Iff.intro
   (fun (x : (p ∨ q) ∨ r) => Or.elim x
                             (fun (g : (p ∨ q)) => Or.elim g
                                                   (fun (h : p) => Or.inl h)

                                                   (fun (h : q) =>
                                                      Or.inr (Or.inl h)
                                                   )
                             )
                             (fun (g : r) =>
                                 Or.inr (Or.inr g)
                             )
   )
   (fun (x : p ∨ (q ∨ r)) => Or.elim x
                             (fun (g : p) => (Or.inl) (Or.inl g))

                             (fun (g : (q ∨ r)) => Or.elim g
                                                   (fun (h : q) =>
                                                      (Or.inl) (Or.inr h))

                                                   (fun (h : r) =>
                                                      Or.inr h
                                                   )
                             )
   )



theorem conj_disj_distrib (p q r : Prop) : p ∧ (q ∨ r) ↔ (p ∧ q) ∨ (p ∧ r) :=
   Iff.intro
   (fun (x : p ∧ (q ∨ r)) => Or.elim (And.right x)
                             (fun (h : q) => Or.inl (And.intro (And.left x) h))
                             (fun (h : r) => Or.inr (And.intro (And.left x) h))

   )
   (fun (x : (p ∧ q) ∨ (p ∧ r)) => Or.elim x
                                    (fun (h : p ∧ q) => And.intro (And.left h) (Or.inl (And.right h)))
                                    (fun (h : p ∧ r) => And.intro (And.left h) (Or.inr (And.right h)))
   )



theorem disj_conj_distrib (p q r : Prop) : p ∨ (q ∧ r) ↔ (p ∨ q) ∧ (p ∨ r) :=
   Iff.intro
   (fun (x : p ∨ (q ∧ r)) => Or.elim x
                             (fun (h : p) => And.intro
                                             (Or.inl h)
                                             (Or.inl h))
                             (fun (h : q ∧ r) => And.intro
                                                (Or.inr (And.left h))
                                                (Or.inr (And.right h)))
   )
   (fun (x : (p ∨ q) ∧ (p ∨ r)) => Or.elim (And.left x)
                                   (fun (h : p) => (Or.inl : p → p ∨ (q ∧ r)) h)
                                   (fun (h : q) => Or.elim (And.right x)
                                                   (fun (g : p) => Or.inl g)
                                                   (fun (g : r) => Or.inr
                                                                   (And.intro h g))
                                   )

   )




theorem morgan_disj (p q : Prop) :  ¬(p ∨ q) ↔ ¬p ∧ ¬q :=
   Iff.intro
   (fun (x : ¬(p ∨ q)) => And.intro (fun (h : p) => x (Or.inl h))
                                    (fun (h : q) => x (Or.inr h))
   )
   (fun (x : ¬p ∧ ¬q) => (fun (h : p ∨ q) => Or.elim h
                                             (fun (g : p) => (And.left x) g)
                                             (fun (g : q) => (And.right x) g)
   ))


theorem morgan_conj_mpr (p q : Prop) : ¬p ∨ ¬q → ¬(p ∧ q) :=
   fun (x : ¬p ∨ ¬q) => (fun (g : p ∧ q) => Or.elim x
                                             (fun (h : ¬ p) => h (And.left g))
                                             (fun (h : ¬ q) => h (And.right g))
   )


theorem impl_def_mpr (p q : Prop) : (¬p ∨ q) → (p → q) :=
   fun (x : (¬p ∨ q)) => (fun (g : p) => Or.elim x
                                         (fun (h : ¬p) => False.elim (h g))
                                         (fun (h : q) => h)
   )


theorem neg_to_impl (p q : Prop) : ¬p → (p → q) :=
   fun (x : ¬p) => (fun (g : p) => False.elim (x g))


theorem neg_imp_def_mpr (p q : Prop) : p ∧ ¬q → ¬(p → q) :=
   fun (x : p ∧ ¬q) => (fun (g : p → q) => (And.right x) (g (And.left x)))



theorem contraposition_mp (p q : Prop) : (p → q) → (¬q → ¬p) :=
   fun (x : p → q) => (fun (g : ¬q) => (fun (h : p) => g (x h)))



theorem exportation_law (p q r : Prop) : (p → (q → r)) ↔ (p ∧ q → r) :=
   Iff.intro
   (fun (h : (p → (q → r))) => fun (g : p ∧ q) => h (And.left g) (And.right g))
   (fun (h : (p ∧ q → r)) => fun (x : p) => (fun (y : q) => h (And.intro x y)))



theorem cases_impl_left (p q r : Prop) : ((p ∨ q) → r) ↔ (p → r) ∧ (q → r) :=
   Iff.intro
   (fun (h : (p ∨ q) → r) => And.intro
                           (fun (g : p) => h (Or.inl g))
                           (fun (g : q) => h (Or.inr g))
   )
   (fun (h : (p → r) ∧ (q → r)) => (fun (g : (p ∨ q)) => Or.elim g
                                                         (fun (x : p) => (And.left h) x)
                                                         (fun (x : q) => (And.right h) x)
                                   )
   )


theorem syllogism (p q r : Prop) : (p → q) → (q → r) → (p → r) :=
   fun (h : p → q) => (fun (g : q → r) => (fun (s : p) => g (h s)))


theorem neg_congr (p q : Prop) : (p ↔ q) → (¬p ↔ ¬q) :=
   fun (h : p ↔ q) =>
      Iff.intro
      (fun (g : ¬p) => fun (s : q) => g (Iff.mpr h s))
      (fun (g : ¬q) => fun (s : p) => g (Iff.mp h s))


theorem disj_congr (p q r : Prop) : (p ↔ q) → ((p ∨ r) ↔ (q ∨ r)) :=
   fun (h : (p ↔ q)) => Iff.intro
                        (fun (s : p ∨ r) => Or.elim s
                                            (fun (g : p) => Or.inl (Iff.mp h g))
                                            (fun (g : r) => Or.inr g)
                        )
                        (fun (s : q ∨ r) => Or.elim s
                                            (fun (g : q) => Or.inl (Iff.mpr h g))
                                            (fun (g : r) => Or.inr g)

                        )


theorem conj_congr (p q r : Prop) : (p ↔ q) → ((p ∧ r) ↔ (q ∧ r)) :=
   fun (h : p ↔ q) => Iff.intro
                      (fun (g : p ∧ r) => And.intro (Iff.mp h (And.left g)) (And.right g))
                      (fun (g : q ∧ r) => And.intro (Iff.mpr h (And.left g)) (And.right g))



theorem impl_congr_right (p q r : Prop) : (p ↔ q) → ((p → r) ↔ (q → r)) :=
   fun (h : p ↔ q) => Iff.intro
                     (fun (g : p → r) => syllogism q p r (Iff.mpr h) g)
                     (fun (g : q → r) => syllogism p q r (Iff.mp h) g)


theorem impl_congr_left (p q r : Prop) : (p ↔ q) → ((r → p) ↔ (r → q)) :=
   fun (h : p ↔ q) => Iff.intro
                     (fun (g : r → p) => syllogism r p q g (Iff.mp h))
                     (fun (g : r → q) => syllogism r q p g (Iff.mpr h))


theorem iff_congr_ (p q r : Prop) : (p ↔ q) → ((p ↔ r) ↔ (q ↔ r)) :=
   fun (h : (p ↔ q)) => Iff.intro
                        (fun (g : p ↔ r) => Iff.intro
                                            (syllogism q p r (Iff.mpr h) (Iff.mp g))
                                            (syllogism r p q (Iff.mpr g) (Iff.mp h))
                        )
                        (fun (g : q ↔ r) => Iff.intro
                                            (syllogism p q r (Iff.mp h) (Iff.mp g))
                                            (syllogism r q p (Iff.mpr g) (Iff.mpr h))
                        )


theorem iff_conj_intro(p q r : Prop) : (p ↔ q) → (p ↔ r) → (p ↔ (q ∧ r)) :=
   fun (h : p ↔ q) => fun (g : p ↔ r) => Iff.intro
                                       (fun (s : p) => And.intro (Iff.mp h s) (Iff.mp g s))
                                       (fun (s : q ∧ r) => (Iff.mpr h) (And.left s))


theorem iff_transitivity (p q r : Prop) : (p ↔ q) → (q ↔ r) → (p ↔ r) :=
   fun (h : p ↔ q) => fun (g : q ↔ r) => Iff.intro
                                        (syllogism p q r (Iff.mp h) (Iff.mp g))
                                        (syllogism r q p (Iff.mpr g) (Iff.mpr h))


theorem no_contradiction (p : Prop) : ¬ (p ∧ ¬ p) :=
   fun (h : p ∧ ¬ p) => (And.right h) (And.left h)


theorem double_negation_mp (p : Prop) : p → ¬¬ p :=
   fun (h : p) => (fun (g : ¬ p) => g h)


theorem not_equiv_then_not_p (p : Prop) : (p ↔ ¬p) → ¬p :=
   fun (h : p ↔ ¬p) => (fun (g : p) => (Iff.mp h g) g)


theorem negation_not_equiv (p : Prop) : ¬(p ↔ ¬p) :=
   fun (h : p ↔ ¬ p) => (not_equiv_then_not_p p h) (Iff.mpr h (not_equiv_then_not_p p h))



theorem double_negation (p : Prop) : p ↔ ¬¬p :=
   Iff.intro
   (double_negation_mp p)
   Classical.byContradiction


theorem tnd (p : Prop) : p ∨ ¬ p :=
   Classical.byContradiction (
      fun (h : ¬ (p ∨ ¬ p)) =>
        (And.right ((Iff.mp (morgan_disj p ¬ p)) h))
        (And.left ((Iff.mp (morgan_disj p ¬ p)) h))
   )

theorem cases_analysis (p q : Prop) : (p → q) → (¬p → q) → q :=
   Or.elim (tnd p)

theorem cases_impl_right (p q r : Prop) : (p → q ∨ r) → ((p → q) ∨ (p → r)) :=
   fun (h : (p → q ∨ r)) =>
      Or.elim (tnd p)
      (fun (g : p) => Or.elim (h g)
                      (fun (s : q) => Or.inl (fun (_ : p) => s))
                      (fun (s : r) => Or.inr (fun (_ : p) => s))
      )
      (fun (g : ¬p) => Or.inl (neg_to_impl p q g))


theorem Morgan_disj (p q : Prop) : ¬ (p ∧ q) ↔ ¬p ∨ ¬q :=
   Iff.intro
   (
      fun (h : ¬ (p ∧ q)) => cases_analysis p (¬p ∨ ¬q)
                             (
                              fun (g : p) =>
                                 cases_analysis q (¬p ∨ ¬q)
                                 (fun (s : q) => False.elim (h (And.intro g s)))
                                 Or.inr
                             )
                             Or.inl
   )
   (morgan_conj_mpr p q)


theorem imp_def (p q : Prop) : (p → q) ↔ (¬p ∨ q) :=
   Iff.intro
   (fun (h : p → q) => Or.elim (tnd p)
                       (fun (s : p) => Or.inr (h s))
                       Or.inl
   )
   (impl_def_mpr p q)


theorem neg_imp_def (p q : Prop) : ¬ (p → q) ↔ p ∧ ¬ q :=
   Iff.intro
   (fun (h : ¬ (p → q)) =>
      Or.elim (tnd p)
      (fun (s : p) =>
         Or.elim (tnd q)
         (fun (t : q) => False.elim (h (fun (_ : p) => t)))
         (fun (t : ¬q) => And.intro s t)

      )
      (fun (s : ¬ p) => False.elim (h (neg_to_impl p q s)))
   )
   (neg_imp_def_mpr p q)




theorem contraposition (p q : Prop) : (p → q) ↔ (¬q → ¬p) :=
   Iff.intro
   (contraposition_mp p q)
   (fun (h : ¬q → ¬ p) => (fun (s : p) => Or.elim (tnd q)
                                          (axiomatic_rule q)
                                          (fun (r : ¬q) => False.elim (h r s))

                          )
   )


theorem peirce (p q : Prop) : (((p → q) → p) → p) :=
   fun (h : (p → q) → p) =>
      Or.elim (tnd p)
      (axiomatic_rule p)
      (fun (s : ¬p) => h (neg_to_impl p q s))



-- 27) Xor definition
def xor_pr (p q : Prop) : Prop := (p ∧ ¬q) ∨ (¬p ∧ q)
macro l:term:10 " ⊕ " r:term:11 : term => `(xor_pr $l $r)

-- 28) Xor properties
theorem xor_equiv_def (p q : Prop) : (p ⊕ q) ↔ ((p ∨ q) ∧ (¬ (p ∧ q))) :=
   Iff.intro
   (
      fun (hpq : (p ⊕ q)) =>
         Or.elim hpq
         (
            fun (hpnq : p ∧ ¬q) =>
               And.intro (Or.inl (And.left hpnq)) (
                  fun (hpandq : (p ∧ q)) =>
                     And.right hpnq (And.right hpandq)
               )
         )
         (
            fun (hnpq : ¬p ∧ q) =>
               And.intro (Or.inr (And.right hnpq)) (
                  fun (hpandq : (p ∧ q)) =>
                     And.left hnpq (And.left hpandq)
               )
         )
   )
   (
      fun (hpq : (p ∨ q) ∧ (¬ (p ∧ q))) =>
         Or.elim (And.left hpq)
         (
            fun (hp : p) =>
               Or.inl (
                  And.intro hp (
                     fun (hq : q) =>
                        And.right hpq (And.intro hp hq)
                  )
               )
         )
         (
            fun (hq : q) =>
               Or.inr (
                  And.intro (
                     fun (hp : p) =>
                        And.right hpq (
                           And.intro hp hq
                        )
                  ) (hq)
               )
         )

   )


theorem xor_equal (p : Prop): ¬ (p ⊕ p) :=
   fun (hpp : (p ⊕ p)) =>
      Or.elim hpp
      (
         fun (hpnp : p ∧ ¬ p) =>
            And.right hpnp (And.left hpnp)
      )
      (
         fun (hnpp : ¬p ∧ p) =>
            And.left hnpp (And.right hnpp)
      )

theorem xor_neg (p : Prop) : (p ⊕ ¬ p) :=
   Or.elim (tnd p)
   (
      fun (hp : p) =>
         Or.inl (And.intro (hp) (double_negation_mp p hp))
   )
   (
      fun (hnp : ¬p) =>
         Or.inr (And.intro hnp hnp)
   )

theorem xor_comm (p q : Prop) : (p ⊕ q) ↔ (q ⊕ p) :=
   let first := fun (x : Prop) => fun (y : Prop) => fun (hxy : (x ⊕ y)) =>
         Or.elim hxy
         (
            fun (hxny : x ∧ ¬y) =>
               Or.inr (Iff.mp (conj_comm x (¬ y)) hxny)
         )
         (
            fun (hnxy : ¬x ∧ y) =>
               Or.inl (Iff.mp (conj_comm (¬x) y) hnxy)
         )
   Iff.intro
   (
      first p q
   )
   (
      first q p
   )

theorem xor_assoc (p q r : Prop) : ((p ⊕ q) ⊕ r) ↔ (p ⊕ (q ⊕ r)) :=
   let first : ∀ p q r : Prop, ((p ⊕ q) ⊕ r)  → (p ⊕ (q ⊕ r)) := fun (p) => fun (q) => fun (r) => (
      fun (hpqr : ((p ⊕ q) ⊕ r)) =>
         Or.elim hpqr
         (
            fun (hpqar : (p ⊕ q) ∧ ¬r) =>
               Or.elim (And.left hpqar)
               (
                  fun (hpnq : p ∧ ¬q) =>
                     Or.inl (And.intro (And.left hpnq) (
                        fun (hqr : q ⊕ r) =>
                           Or.elim (And.left (Iff.mp (xor_equiv_def q r) hqr))
                           (
                              fun (hq : q) =>
                                 And.right hpnq hq
                           )
                           (
                              fun (hr : r) =>
                                 And.right hpqar hr
                           )
                     ))
               )
               (
                  fun (hnpq : ¬p ∧ q) =>
                     Or.inr (
                        And.intro (And.left hnpq) (
                           Or.inl (And.intro (And.right hnpq) (And.right hpqar))
                        )
                     )
               )
         )
         (
            fun (hnpqr : ¬(p ⊕ q) ∧ r) =>
               Or.elim (tnd q)
               (
                  fun (hq : q) =>
                     Or.inl (
                        And.intro (
                           Classical.byContradiction (
                              fun (hnp : ¬ p) =>
                                 And.left hnpqr (
                                    Or.inr (And.intro hnp hq)
                                 )
                           )
                        ) (
                           fun (hqr : q ⊕ r) =>
                              And.right (Iff.mp (xor_equiv_def q r) hqr) (And.intro (hq) (And.right hnpqr))
                        )
                     )
               )
               (
                  fun (hnq : ¬ q) =>
                     Or.inr (
                        And.intro (
                           fun (hp : p) =>
                              (And.left hnpqr) (
                                 Or.inl (And.intro hp hnq)
                              )
                        ) (
                           Or.inr (And.intro hnq (And.right hnpqr))
                        )
                     )
               )
         )
   )
   Iff.intro
   (first p q r)
   (
      fun (hpqr : (p ⊕ (q ⊕ r))) =>
         let u := Iff.mp (xor_comm p (q ⊕ r)) hpqr
         let v : (q ⊕ (r ⊕ p)) := first q r p u
         let s := Iff.mp (xor_comm q (r ⊕ p)) v
         let t := first r p q s
         Iff.mp (xor_comm r (p ⊕ q)) t
   )




theorem xor_introl (p q : Prop) : (p ∧ ¬q) → (p ⊕ q) :=
   Or.inl


theorem xor_intror (p q : Prop) : (¬p ∧ q) → (p ⊕ q) :=
   Or.inr

theorem xor_intro (p q : Prop) : (p ∨ q) → (¬ (p ∧ q)) → (p ⊕ q) :=
   fun (hpq : p ∨ q) =>
      fun (hnpq : (¬ (p ∧ q))) =>
         Iff.mpr (xor_equiv_def p q) (And.intro hpq hnpq)


theorem xor_left (p q : Prop) : (p ⊕ q) → (p ∨ q) :=
   fun (hpq : p ⊕ q) =>
      And.left (Iff.mp (xor_equiv_def p q) hpq)

theorem xor_right (p q : Prop) : (p ⊕ q) → (¬ (p ∧ q)) :=
   fun (hpq : p ⊕ q) =>
      And.right (Iff.mp (xor_equiv_def p q) hpq)

theorem xor_elim (p q r : Prop) : (p ⊕ q) → ((p ∧ ¬q) → r) → ((¬p ∧ q) → r) → r :=
   fun (hpq : p ⊕ q) =>
      fun (hpnqr : ((p ∧ ¬q) → r)) =>
         fun (hnpqr : ((¬p ∧ q) → r)) =>
            Or.elim hpq
            (hpnqr)
            (hnpqr)