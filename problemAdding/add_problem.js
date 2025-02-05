import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import fs from 'fs';
import { assert } from 'console';
import { uri } from './../uri.js';


async function connect(client) {
    try {
        await client.connect();
        console.log("Connected to Mongo DB");
    } catch (err) {
        console.error("Error connecting to Mongo DB:", err);
    }
}


async function disconnect(client) {
    try {
        await client.close();
        console.log("Disconnected from Mongo DB");
    } catch (err) {
        console.error("Error disconnecting to Mongo DB:", err);
        process.exit(1);
    }
}


async function getDatabase(client, databaseName) {
    try {
        const database = await client.db(databaseName);
        return database;
    } catch (err) {
        console.error("Error creating/finding database:", err);
    }
}


async function getCollection(db, collectionName) {
    try {
        const collection = await db.collection(collectionName);
        return collection;
    } catch (err) {
        console.error("Error creating/finding collection:", err);
    }
}


async function getAllDocuments(collection) {
    try {
        const documents = await collection.find({}).toArray();
        return documents;
    } catch(err) {
        console.error("Error retrieving all documents from collection", err);
    }
}


async function insertDocument(collection, document) {
    try {
        const response = await collection.insertOne(document);
        return response.insertedId.toHexString();
    } catch (err) {
        console.error("Error inserting the document into the collection", err);
    }
}

async function getDocumentByKey(collection, key) {
    try {
        const document = await collection.findOne({ _id: ObjectId.createFromHexString(key) });
        if (!document) {
            console.log("No document with this key");
            return {};
        }
        return document;
    } catch (err) {
        console.error("Error retrieving the document by key", err);
    }
}

async function getDocumentbyQuery(collection, query) {
    try {
        const document = await collection.findOne(query);
        if (!document) {
            console.log("No document with this query");
            return {};
        }
        return document;
    } catch (err) {
        console.error("Error retrieving the document by the query", err);
    }
}

async function getDocumentsByQuery(collection, query) {
    try {
        const documents = await collection.find(query).toArray();
        return documents;
    } catch (err) {
        console.error("Error retrieving the documents by the query", err);
    }
}

async function updateDocumentByKey(collection, key, set_document, unset_document) {
    try {
        const _ = await collection.updateOne({ _id: ObjectId.createFromHexString(key) },
         {$set : set_document, $unset : unset_document})
    } catch (err) {
        console.error("Error updating the document by key", err);
    }
}

async function updateDocumentByQuery(collection, query, set_document, unset_document) {
    try {
        const _ = await collection.updateOne(query, {$set : set_document, $unset : unset_document});
    } catch (err) {
        console.error("Error updating the document by the query", err);
    }
}

async function updateDocumentsByQuery(collection, query, set_document, unset_document) {
    try {
        const _ = await collection.updateMany(query, {$set : set_document, $unset : unset_document});
    } catch (err) {
        console.error("Error updating the documents by the query", err);
    }
}



async function deleteDocumentByKey(collection, key) {
    try {
        const _ = await collection.deleteOne({ _id: ObjectId.createFromHexString(key) });
    } catch (err) {
        console.error("Error deleting the document by key", err);
    }
}


async function deleteDocumentByQuery(collection, query) {
    try {
        const _ = await collection.deleteOne(query);
    } catch (err) {
        console.error("Error deleting the document by the query", err);
    }
}


async function deleteDocumentsByQuery(collection, query) {
    try {
        const _ = await collection.deleteMany(query);
    } catch (err) {
        console.error("Error deleting the documents by the query", err);
    }
}


async function updateKeysProblems(db, newProblem) {
    try {
        const collection = await getCollection(db, "ProblemKeys")

        let docs = await getAllDocuments(collection);

        if (docs.length === 0) {
            // If the collection is empty, create a new document
            doc = { keys: [newProblem] };
            await collection.insertOne(doc);  // Insert a new document with the keys array containing newProblem
            console.log('New document created with new problem key');
        } else {

            const doc = docs[0];

            const key = doc._id.toHexString();

            let content = doc;

            let keys_arr = content["keys"];

            keys_arr.push(newProblem);

            content = {"keys" : keys_arr};

            await updateDocumentByKey(collection, key, content, {})

            console.log('Problems are updated')
        }

    } catch (err) {
        console.error(err);
        return null;
    }
}


async function updateUserProblems(db, newProblem) {
    try {

        const collection = await getCollection(db, "Users");

        let docs = await getAllDocuments(collection);

        for (let doc of docs) {
            
            let content = doc['content'];
            let key = doc._id.toHexString();

            content['problems'][newProblem] = {'status' : 'Not solved', 'last solutions' : []};
            
            await updateDocumentByKey(collection, key, content, {});

            console.log('User ' + key + ' is updated')

        }

        console.log('Users are updated')
        

    } catch (err) {
        console.error(err);
        return null;
    }
}

async function add_problem (db, content) {
    try {
        const collection = await getCollection(db, "Problems");
        const key = await insertDocument(collection, content);
        console.log('Document was added');
        await updateUserProblems(db, key);
        await updateKeysProblems(db, key);
    } catch (err) {
        console.error(err);
        return null;
    }
}




async function add_problem_to_database(content) {
    try {
        await connect(client);
        const db = await getDatabase(client, "BestCode");
        await add_problem(db, content);
    } catch (err) {
        console.error(err);
    } finally {
        await disconnect(client);
    }
}


async function update_problem_to_database(query, content) {
    try {
        await connect(client);
        const db = await getDatabase(client, "BestCode");
        const collection = await getCollection(db, "Problems");
        await updateDocumentByQuery(collection, query, content, {});
    } catch (err) {
        console.error(err);
    } finally {
        await disconnect(client);
    }
}

async function list_collection(collection_name) {
    try {
        await connect(client);
        const db = await getDatabase(client, "BestCode");
        const collection = await getCollection(db, collection_name);
        const documents = await getAllDocuments(collection);
        console.log(documents);
    } catch (err) {
        console.error(err);
    } finally {
        await disconnect(client);
    }
}

function get_document(file, callback) {
    fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading JSON file:', err);
                callback(err, null);
            }
            
            try {
                const jsonData = JSON.parse(data);
                callback(null, jsonData);
            } catch (error) {
                console.error('Error parsing JSON file:', error);
                callback(err, null);
            }
        }
    )
}



// later I will uncomment this, where I add elements to database

/*

const database_name = "BestCode";
const collection_name = ["Users", "Problems", "ProblemKeys"];

get_document("output6.json", (error, document1) => {
    if (error) {
        console.error('Error:', error);
        return;
    }
    if (document1) {
        update_problem_to_database({title: "Binary relations"}, document1)
    }
    
});
*/




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


const first_doc = {
    "id": 0,
    "course": "/math/logic",
    "title": "Propositional tautologies",
    "difficulty": "Easy",
    "video_id": "y3svPgyGnLc",
    "accepted": 0,
    "submitted": 0,
    "description_text": "This is task to prove, using <b>LEAN 4</b> language. <br> Proofs should be done, by writing constructive <b>proof terms with the help of propositional constructors and destructors or tactics</b>. <br> As this is the first proving task, the ONLY allowed terms and constructions are the ones, that are used in natural deduction. They can be found here: <a href=\"https://github.com/IgorAmashukeli/MathLean/blob/main/0_Logic/0_DeductionRules/Rules.lean\">Natural deduction rules</a>",
    "examples": [],
    "constraints": [],
    "note": "Note that you can only use <b>ByContradiction</b> and <b>by_contradiction</b> tactic for the theorems, defined after <i>open Classical</i>.  <br> <br> For reference, see this documentation: <a href=\"https://leanprover.github.io/theorem_proving_in_lean4/title_page.html\">LEAN 4 proving</a>",
    "languages": [
      [
        "LEAN",
        "lean"
      ]
    ],
    "initial_codes": {
      "lean": "--your proof goes here\n\ntheorem neg_true : ¬ True ↔ False := sorry\n\ntheorem neg_false : ¬ False ↔ True := sorry\n\ntheorem conj_true (p : Prop) : p ∧ True ↔ p := sorry\n\ntheorem conj_false (p : Prop) : p ∧ False ↔ False := sorry\n\ntheorem disj_true (p : Prop) : p ∨ True ↔ True := sorry\n\ntheorem disj_false (p : Prop) : p ∨ False ↔ p := sorry\n\ntheorem impl_true (p : Prop) : p → True ↔ True := sorry\n\ntheorem true_impl (p : Prop) : True → p ↔ p := sorry\n\ntheorem impl_false (p : Prop) : p → False ↔ ¬ p := sorry\n\ntheorem false_impl (p : Prop) : False → p ↔ True := sorry\n\ntheorem axiomatic_rule (p : Prop) : p → p := sorry\n\ntheorem trivial_equivalence (p : Prop) : p ↔ p := sorry\n\ntheorem conj_idemp (p : Prop) : p ↔ p ∧ p := sorry\n\ntheorem disj_idemp (p : Prop) : p ↔ p ∨ p := sorry\n\ntheorem conj_comm (p q : Prop) : (p ∧ q) ↔ (q ∧ p) := sorry\n\ntheorem disj_comm (p q : Prop) : (p ∨ q) ↔ (q ∨ p) := sorry\n\ntheorem impl_comm (p q : Prop) : (p ↔ q) ↔ (q ↔ p) := sorry\n\ntheorem conj_assoc (p q r : Prop) : (p ∧ q) ∧ r ↔ p ∧ (q ∧ r) := sorry\n\ntheorem disj_assoc (p q r : Prop) : (p ∨ q) ∨ r ↔ p ∨ (q ∨ r) := sorry\n\ntheorem conj_disj_distrib (p q r : Prop) : p ∧ (q ∨ r) ↔ (p ∧ q) ∨ (p ∧ r) := sorry\n\ntheorem disj_conj_distrib (p q r : Prop) : p ∨ (q ∧ r) ↔ (p ∨ q) ∧ (p ∨ r) := sorry\n\ntheorem morgan_disj (p q : Prop) :  ¬(p ∨ q) ↔ ¬p ∧ ¬q := sorry\n\ntheorem morgan_conj_mpr (p q : Prop) : ¬p ∨ ¬q → ¬(p ∧ q) := sorry\n\ntheorem impl_def_mpr (p q : Prop) : (¬p ∨ q) → (p → q) := sorry\n\ntheorem neg_imp_def_mpr (p q : Prop) : p ∧ ¬q → ¬(p → q) := sorry\n\ntheorem neg_to_impl (p q : Prop) : ¬p → (p → q) := sorry\n\ntheorem contraposition_mp (p q : Prop) : (p → q) → (¬q → ¬p) := sorry\n\ntheorem exportation_law (p q r : Prop) : (p → (q → r)) ↔ (p ∧ q → r) := sorry\n\ntheorem cases_impl_left (p q r : Prop) : ((p ∨ q) → r) ↔ (p → r) ∧ (q → r) := sorry\n\ntheorem syllogism (p q r : Prop) : (p → q) → (q → r) → (p → r) := sorry\n\ntheorem neg_congr (p q : Prop) : (p ↔ q) → (¬p ↔ ¬q) := sorry\n\ntheorem disj_congr (p q r : Prop) : (p ↔ q) → ((p ∨ r) ↔ (q ∨ r)) := sorry\n\ntheorem conj_congr (p q r : Prop) : (p ↔ q) → ((p ∧ r) ↔ (q ∧ r)) := sorry\n\ntheorem impl_congr_right (p q r : Prop) : (p ↔ q) → ((p → r) ↔ (q → r)) := sorry\n\ntheorem impl_congr_left (p q r : Prop) : (p ↔ q) → ((r → p) ↔ (r → q)) := sorry\n\ntheorem iff_congr_ (p q r : Prop) : (p ↔ q) → ((p ↔ r) ↔ (q ↔ r)) := sorry\n\ntheorem iff_conj_intro(p q r : Prop) : (p ↔ q) → (p ↔ r) → (p ↔ (q ∧ r)) := sorry\n\ntheorem iff_transitivity (p q r : Prop) : (p ↔ q) → (q ↔ r) → (p ↔ r) := sorry\n\ntheorem no_contradiction (p : Prop) : ¬ (p ∧ ¬ p) := sorry\n\ntheorem double_negation_mp (p : Prop) : p → ¬¬ p := sorry\n\ntheorem negation_not_equiv (p : Prop) : ¬(p ↔ ¬p) := sorry\n\nopen Classical\n\ntheorem double_negation (p : Prop) : p ↔ ¬¬p := sorry\n\ntheorem tnd (p : Prop) : p ∨ ¬ p := sorry\n\ntheorem cases_analysis (p q : Prop) : (p → q) → (¬p → q) → q := sorry\n\ntheorem cases_impl_right (p q r : Prop) : (p → q ∨ r) → ((p → q) ∨ (p → r)) := sorry\n\ntheorem Morgan_disj (p q : Prop) : ¬ (p ∧ q) ↔ ¬p ∨ ¬q := sorry\n\ntheorem neg_imp_def (p q : Prop) : ¬ (p → q) ↔ p ∧ ¬ q := sorry\n\ntheorem imp_def (p q : Prop) : (p → q) ↔ (¬p ∨ q) := sorry\n\ntheorem contraposition (p q : Prop) : (p → q) ↔ (¬q → ¬p) := sorry\n\ntheorem peirce (p q : Prop) : (((p → q) → p) → p) := sorry\n\ndef xor_pr (p q : Prop) : Prop := (p ∧ ¬q) ∨ (¬p ∧ q)\n\nmacro l:term:10 \" ⊕ \" r:term:11 : term => `(xor_pr $l $r)\n\ntheorem xor_equiv_def (p q : Prop) : (p ⊕ q) ↔ ((p ∨ q) ∧ (¬ (p ∧ q))) :=  sorry\n\ntheorem xor_equal (p : Prop): ¬ (p ⊕ p) := sorry\n\ntheorem xor_neg (p : Prop) : (p ⊕ ¬ p) := sorry\n\ntheorem xor_comm  (p q : Prop) : (p ⊕ q) ↔ (q ⊕ p) := sorry\n\ntheorem xor_assoc (p q r : Prop) : ((p ⊕ q) ⊕ r) ↔ (p ⊕ (q ⊕ r)) := sorry"
    },
    "initial_language": "lean",
    "requirements": [
      "theorem neg_true : ¬ True ↔ False",
      "theorem neg_false : ¬ False ↔ True",
      "theorem conj_true (p : Prop) : p ∧ True ↔ p",
      "theorem conj_false (p : Prop) : p ∧ False ↔ False",
      "theorem disj_true (p : Prop) : p ∨ True ↔ True",
      "theorem disj_false (p : Prop) : p ∨ False ↔ p",
      "theorem impl_true (p : Prop) : p → True ↔ True",
      "theorem true_impl (p : Prop) : True → p ↔ p",
      "theorem impl_false (p : Prop) : p → False ↔ ¬ p",
      "theorem false_impl (p : Prop) : False → p ↔ True",
      "theorem axiomatic_rule (p : Prop) : p → p",
      "theorem trivial_equivalence (p : Prop) : p ↔ p",
      "theorem conj_idemp (p : Prop) : p ↔ p ∧ p",
      "theorem disj_idemp (p : Prop) : p ↔ p ∨ p",
      "theorem conj_comm (p q : Prop) : (p ∧ q) ↔ (q ∧ p)",
      "theorem disj_comm (p q : Prop) : (p ∨ q) ↔ (q ∨ p)",
      "theorem impl_comm (p q : Prop) : (p ↔ q) ↔ (q ↔ p)",
      "theorem conj_assoc (p q r : Prop) : (p ∧ q) ∧ r ↔ p ∧ (q ∧ r)",
      "theorem disj_assoc (p q r : Prop) : (p ∨ q) ∨ r ↔ p ∨ (q ∨ r)",
      "theorem conj_disj_distrib (p q r : Prop) : p ∧ (q ∨ r) ↔ (p ∧ q) ∨ (p ∧ r)",
      "theorem disj_conj_distrib (p q r : Prop) : p ∨ (q ∧ r) ↔ (p ∨ q) ∧ (p ∨ r)",
      "theorem morgan_disj (p q : Prop) :  ¬(p ∨ q) ↔ ¬p ∧ ¬q",
      "theorem morgan_conj_mpr (p q : Prop) : ¬p ∨ ¬q → ¬(p ∧ q)",
      "theorem impl_def_mpr (p q : Prop) : (¬p ∨ q) → (p → q)",
      "theorem neg_imp_def_mpr (p q : Prop) : p ∧ ¬q → ¬(p → q)",
      "theorem neg_to_impl (p q : Prop) : ¬p → (p → q)",
      "theorem contraposition_mp (p q : Prop) : (p → q) → (¬q → ¬p)",
      "theorem exportation_law (p q r : Prop) : (p → (q → r)) ↔ (p ∧ q → r)",
      "theorem cases_impl_left (p q r : Prop) : ((p ∨ q) → r) ↔ (p → r) ∧ (q → r)",
      "theorem syllogism (p q r : Prop) : (p → q) → (q → r) → (p → r)",
      "theorem neg_congr (p q : Prop) : (p ↔ q) → (¬p ↔ ¬q)",
      "theorem disj_congr (p q r : Prop) : (p ↔ q) → ((p ∨ r) ↔ (q ∨ r))",
      "theorem conj_congr (p q r : Prop) : (p ↔ q) → ((p ∧ r) ↔ (q ∧ r))",
      "theorem impl_congr_right (p q r : Prop) : (p ↔ q) → ((p → r) ↔ (q → r))",
      "theorem impl_congr_left (p q r : Prop) : (p ↔ q) → ((r → p) ↔ (r → q))",
      "theorem iff_congr_ (p q r : Prop) : (p ↔ q) → ((p ↔ r) ↔ (q ↔ r))",
      "theorem iff_conj_intro(p q r : Prop) : (p ↔ q) → (p ↔ r) → (p ↔ (q ∧ r))",
      "theorem iff_transitivity (p q r : Prop) : (p ↔ q) → (q ↔ r) → (p ↔ r)",
      "theorem no_contradiction (p : Prop) : ¬ (p ∧ ¬ p)",
      "theorem negation_not_equiv (p : Prop) : ¬(p ↔ ¬p)",
      "theorem double_negation_mp (p : Prop) : p → ¬¬ p",
      "theorem tnd (p : Prop) : p ∨ ¬ p",
      "theorem double_negation (p : Prop) : p ↔ ¬¬p",
      "theorem cases_analysis (p q : Prop) : (p → q) → (¬p → q) → q",
      "theorem cases_impl_right (p q r : Prop) : (p → q ∨ r) → ((p → q) ∨ (p → r))",
      "theorem Morgan_disj (p q : Prop) : ¬ (p ∧ q) ↔ ¬p ∨ ¬q",
      "theorem neg_imp_def (p q : Prop) : ¬ (p → q) ↔ p ∧ ¬ q",
      "theorem imp_def (p q : Prop) : (p → q) ↔ (¬p ∨ q)",
      "theorem contraposition (p q : Prop) : (p → q) ↔ (¬q → ¬p)",
      "theorem peirce (p q : Prop) : (((p → q) → p) → p)",
      "theorem xor_equiv_def (p q : Prop) : (p ⊕ q) ↔ ((p ∨ q) ∧ (¬ (p ∧ q)))",
      "theorem xor_equal (p : Prop): ¬ (p ⊕ p)",
      "theorem xor_neg (p : Prop) : (p ⊕ ¬ p)",
      "theorem xor_comm (p q : Prop) : (p ⊕ q) ↔ (q ⊕ p)",
      "theorem xor_assoc (p q r : Prop) : ((p ⊕ q) ⊕ r) ↔ (p ⊕ (q ⊕ r))"
    ]
  }



  async function condis(client) {
    try {
        await connect(client)
        console.log("Connected to Mongo DB");
    } catch (err) {
        console.error("Error connecting to Mongo DB:", err);
    } finally {
        await disconnect(client)
    }
}


//update_problem_to_database({ title: "Propositional tautologies" }, first_doc)