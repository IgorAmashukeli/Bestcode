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


const second_doc = {
    "id": 2,
    "course": "/math/logic",
    "title": "Quantifiers validities",
    "difficulty": "Easy",
    "video_id": "y3svPgyGnLc",
    "accepted": 0,
    "submitted": 0,
    "description_text": "This is task to prove, using <b>LEAN 4</b> language. <br> Proofs should be done, by writing constructive <b>proof terms with the help of propositional constructors and destructors</b>. <br> In each math problem you will be given a list of permitted constructors, destructors and theorems. <br> To proof each theorem, remove <b>\"sorry\"</b> and replace it with <b>proof term</b>. <br> <br> You can use following constructors and destructors <br><br><i>Constructor and destructor for universal quantifier:</i><br><i>Constructor: </i> <b> fun (x : α) => u </b> creates <b> ∀ x : α, u</b> proposition from <b>α</b> and <b>u</b> proposition, where u can depend on x</br><i>Destructor: </i> <b> (h : ∀ x : α, u) (x₀ : α) </b> creates <b>u[x₀/x]</b> (u, where all free x variables are replaced with x₀) proposition from <b>∀ x : α, u</b> proposition and <b>x₀ : α</b> term <br><br><i>Constructor and destructor for existential quantifier:</i><br><i>Constructor: </i> <b> Exists.intro (x₀ : α) P </b> creates <b>∃ x : α, P</b> proposition from <b>x₀ : α </b> term and  <b> P </b  proposition, where P can depend on x₀<br><i>Destructor: </i> <b> Exists.elim (h : ∃ x : α, P) (g : ∀ x : α, P → q) </b> creates <b>q</b> proposition from <b>∃ x : α, P </b> proposition and <b>∀ x : α, P → q</b> proposition<br>If you know that Inhabited α, you can also use Inhabited.default : α constructorYou can also use all the constructors and destructors for the propositional theorems and use previously proved theorems",
    "examples": [],
    "constraints": [],
    "note": "Note that you can only use <b>ByContradiction</b> for the theorems, defined after <i>open Classical</i>. <br> <br> For reference, see this documentation: <a href=\"https://leanprover.github.io/theorem_proving_in_lean4/title_page.html\">LEAN 4 proving</a>",
    "languages": [
      [
        "LEAN",
        "lean"
      ]
    ],
    "initial_codes": {
      "lean": "--your proof starts here\n\ntheorem uni (α : Type) : ∀ _ : α, True := sorry\n\ntheorem exi_uni_then_uni (α : Type) (P : α → Prop) : (∃ _ : α, ∀ x : α, P x) → (∀ x : α, P x) := sorry\n\ntheorem exi_exi_then_exi (α : Type) (P : α → Prop) : (∃ _ : α, ∃ x : α, P x) → (∃ x : α, P x) := sorry\n\ntheorem uni_uni_then_uni (α : Type) (P : α → Prop) : (∀ _ : α, ∀ x : α, P x) → (∀ x : α, P x) := sorry\n\ntheorem change_variable_uni (α : Type) (P: α → Prop) : (∀ x : α, P x) ↔ (∀ y : α, P y) := sorry\n\ntheorem change_variable_exi (α : Type) (P: α → Prop) : (∃ x : α, P x) ↔ (∃ y : α, P y) := sorry\n\ntheorem uni_congr (α : Type) (P Q : α → Prop) : (∀ x : α, (P x ↔ Q x)) → ((∀ x : α, P x) ↔ (∀ x : α, Q x)) := sorry\n\ntheorem exi_congr (α : Type) (P Q : α → Prop) : (∀ x : α, (P x ↔ Q x)) → ((∃ x : α, P x) ↔ (∃ x: α, Q x)) := sorry\n\ntheorem uni_comm (α : Type) (P : α →  β → Prop) : (∀ x : α, ∀ y : β, P x y) ↔ (∀ y : β, ∀ x : α, P x y) := sorry\n\ntheorem exi_comm (α : Type) (P : α → β → Prop) : (∃ x : α, ∃ y : β, P x y) ↔ (∃ y : β, ∃ x : α, P x y) := sorry\n\ntheorem exi_uni_then_uni_exi (α : Type) (P : α → β → Prop) : (∃ x : α, ∀ y : β, P x y) → (∀ y : β, ∃ x : α, P x y) := sorry\n\ntheorem uni_conj (α : Type) (P Q: α → Prop) : (∀ x: α, P x ∧ Q x) ↔ (∀ x : α, P x) ∧ (∀ x : α, Q x) := sorry\n\ntheorem exi_disj (α : Type) (P Q : α → Prop) : (∃ x : α, P x ∨ Q x) ↔ (∃ x : α, P x) ∨ (∃ x: α, Q x) := sorry\n\ntheorem morgan_uni (α : Type) (P : α → Prop) : (∀ x : α, ¬ P x) ↔ (¬ ∃ x : α, P x) := sorry\n\ntheorem morgan_exi_mp (α : Type) (P : α → Prop) : (∃ x : α, ¬ P x) →  (¬ ∀ x : α, P x) := sorry\n\ntheorem brackets_exi_conj (α : Type) (P : Prop) (Q : α → Prop) : (∃ x : α, P ∧ Q x) ↔ (P ∧ ∃ x : α, Q x) := sorry\n\ntheorem brackets_uni_conj_mpr (α : Type) (P : Prop) (Q : α → Prop) : (P ∧ ∀ x : α, Q x) → (∀ x : α, P ∧ Q x) := sorry\n\ntheorem brackets_exi_disj_mp (α : Type) (P : Prop) (Q : α → Prop) : (∃ x : α, P ∨ Q x) → (P ∨ ∃ x : α, Q x) := sorry\n\ntheorem brackets_uni_disj_mpr (α : Type) (P : Prop) (Q : α → Prop) : (P ∨ ∀ x : α, Q x) → (∀ x : α, P ∨ Q x) := sorry\n\ntheorem brackets_left_uni_impl (α : Type) (P : Prop) (Q : α → Prop) : (P → ∀ x : α, Q x) ↔ (∀ x : α, (P → Q x)) := sorry\n\ntheorem brackets_left_exi_impl_mpr (α : Type) (P : Prop) (Q : α → Prop) : (∃ x : α, (P → Q x)) → (P → ∃ x : α, Q x) := sorry\n\ntheorem brackets_right_uni_impl_mpr (α : Type) (P : α → Prop) (Q : Prop) : (∃ x : α, (P x → Q)) → ((∀ x : α, P x) → Q) := sorry\n\ntheorem brackets_right_exi_impl (α : Type) (P : α → Prop) (Q : Prop) : ((∃ x : α, P x) → Q) ↔ (∀ x : α, (P x → Q)) := sorry\n\ntheorem inh_exi (α : Type) [Inhabited α] : ∃ _ : α, True := sorry\n\ntheorem inh_uni_exi_then_exi [Inhabited α] (P : α → Prop) : (∀ _ : α, ∃ x : α, P x) → (∃ x : α, P x) := sorry\n\ntheorem inh_uni_then_exi (α : Type) [Inhabited α] (P : α → Prop) : (∀ x : α, P x) → (∃ x : α, P x) := sorry\n\ntheorem inh_brackets_uni_conj (α : Type) [Inhabited α] (P : Prop) (Q : α → Prop) : (∀ x : α, P ∧ Q x) ↔ (P ∧ ∀ x : α, Q x) := sorry\n\ntheorem inh_brackets_exi_disj (α : Type) [Inhabited α] (P : Prop) (Q : α → Prop) : (∃ x : α, P ∨ Q x) ↔ (P ∨ ∃ x : α, Q x) := sorry\n\nopen Classical\n\ntheorem brackets_uni_disj (α : Type) (P : Prop) (Q : α → Prop) : (∀ x : α, P ∨ Q x) ↔ (P ∨ ∀ x : α, Q x) := sorry\n\ntheorem morgan_exi (α : Type) (P : α → Prop) : (∃ x : α, ¬ P x) ↔ (¬ ∀ x : α, P x) := sorry\n\ntheorem inh_brackets_left_exi_impl (α : Type) [Inhabited α] (P : Prop) (Q : α → Prop) : (P → ∃ x : α, Q x) ↔ (∃ x : α, (P → Q x)) := sorry\n\ntheorem inh_brackets_right_uni_impl (α : Type) [Inhabited α] (P: α → Prop)  (Q : Prop) :  ((∀ x : α, P x) → Q) ↔ (∃ x : α, (P x → Q)) := sorry\n\ntheorem drinker_paradox (pub_visitor : Type) (is_drinking : pub_visitor → Prop) [Inhabited pub_visitor] : (∃ someone : pub_visitor, (is_drinking someone  → ∀ person : pub_visitor, is_drinking person)) := sorry"
    },
    "initial_language": "lean",
    "requirements": [
      "theorem uni (α : Type) : ∀ _ : α, True",
      "theorem exi_uni_then_uni (α : Type) (P : α → Prop) : (∃ _ : α, ∀ x : α, P x) → (∀ x : α, P x)",
      "theorem exi_exi_then_exi (α : Type) (P : α → Prop) : (∃ _ : α, ∃ x : α, P x) → (∃ x : α, P x)",
      "theorem uni_uni_then_uni (α : Type) (P : α → Prop) : (∀ _ : α, ∀ x : α, P x) → (∀ x : α, P x)",
      "theorem change_variable_uni (α : Type) (P: α → Prop) : (∀ x : α, P x) ↔ (∀ y : α, P y)",
      "theorem change_variable_exi (α : Type) (P: α → Prop) : (∃ x : α, P x) ↔ (∃ y : α, P y)",
      "theorem uni_congr (α : Type) (P Q : α → Prop) : (∀ x : α, (P x ↔ Q x)) → ((∀ x : α, P x) ↔ (∀ x : α, Q x))",
      "theorem exi_congr (α : Type) (P Q : α → Prop) : (∀ x : α, (P x ↔ Q x)) → ((∃ x : α, P x) ↔ (∃ x: α, Q x))",
      "theorem uni_comm (α : Type) (P : α →  β → Prop) : (∀ x : α, ∀ y : β, P x y) ↔ (∀ y : β, ∀ x : α, P x y)",
      "theorem exi_comm (α : Type) (P : α → β → Prop) : (∃ x : α, ∃ y : β, P x y) ↔ (∃ y : β, ∃ x : α, P x y)",
      "theorem exi_uni_then_uni_exi (α : Type) (P : α → β → Prop) : (∃ x : α, ∀ y : β, P x y) → (∀ y : β, ∃ x : α, P x y)",
      "theorem uni_conj (α : Type) (P Q: α → Prop) : (∀ x: α, P x ∧ Q x) ↔ (∀ x : α, P x) ∧ (∀ x : α, Q x)",
      "theorem exi_disj (α : Type) (P Q : α → Prop) : (∃ x : α, P x ∨ Q x) ↔ (∃ x : α, P x) ∨ (∃ x: α, Q x)",
      "theorem morgan_uni (α : Type) (P : α → Prop) : (∀ x : α, ¬ P x) ↔ (¬ ∃ x : α, P x)",
      "theorem morgan_exi_mp (α : Type) (P : α → Prop) : (∃ x : α, ¬ P x) →  (¬ ∀ x : α, P x)",
      "theorem brackets_exi_conj (α : Type) (P : Prop) (Q : α → Prop) : (∃ x : α, P ∧ Q x) ↔ (P ∧ ∃ x : α, Q x)",
      "theorem brackets_uni_conj_mpr (α : Type) (P : Prop) (Q : α → Prop) : (P ∧ ∀ x : α, Q x) → (∀ x : α, P ∧ Q x)",
      "theorem brackets_exi_disj_mp (α : Type) (P : Prop) (Q : α → Prop) : (∃ x : α, P ∨ Q x) → (P ∨ ∃ x : α, Q x)",
      "theorem brackets_uni_disj_mpr (α : Type) (P : Prop) (Q : α → Prop) : (P ∨ ∀ x : α, Q x) → (∀ x : α, P ∨ Q x)",
      "theorem brackets_left_uni_impl (α : Type) (P : Prop) (Q : α → Prop) : (P → ∀ x : α, Q x) ↔ (∀ x : α, (P → Q x))",
      "theorem brackets_left_exi_impl_mpr (α : Type) (P : Prop) (Q : α → Prop) : (∃ x : α, (P → Q x)) → (P → ∃ x : α, Q x)",
      "theorem brackets_right_uni_impl_mpr (α : Type) (P : α → Prop) (Q : Prop) : (∃ x : α, (P x → Q)) → ((∀ x : α, P x) → Q)",
      "theorem brackets_right_exi_impl (α : Type) (P : α → Prop) (Q : Prop) : ((∃ x : α, P x) → Q) ↔ (∀ x : α, (P x → Q))",
      "theorem inh_exi (α : Type) [Inhabited α] : ∃ _ : α, True",
      "theorem inh_uni_exi_then_exi (α : Type) [Inhabited α] (P : α → Prop) : (∀ _ : α, ∃ x : α, P x) → (∃ x : α, P x)",
      "theorem inh_uni_then_exi (α : Type) [Inhabited α] (P : α → Prop) : (∀ x : α, P x) → (∃ x : α, P x)",
      "theorem inh_brackets_uni_conj (α : Type) [Inhabited α] (P : Prop) (Q : α → Prop) : (∀ x : α, P ∧ Q x) ↔ (P ∧ ∀ x : α, Q x)",
      "theorem inh_brackets_exi_disj (α : Type) [Inhabited α] (P : Prop) (Q : α → Prop) : (∃ x : α, P ∨ Q x) ↔ (P ∨ ∃ x : α, Q x)",
      "theorem brackets_uni_disj (α : Type) (P : Prop) (Q : α → Prop) : (∀ x : α, P ∨ Q x) ↔ (P ∨ ∀ x : α, Q x)",
      "theorem morgan_exi (α : Type) (P : α → Prop) : (∃ x : α, ¬ P x) ↔ (¬ ∀ x : α, P x)",
      "theorem inh_brackets_left_exi_impl (α : Type) [Inhabited α] (P : Prop) (Q : α → Prop) : (P → ∃ x : α, Q x) ↔ (∃ x : α, (P → Q x))",
      "theorem inh_brackets_right_uni_impl (α : Type) [Inhabited α] (P: α → Prop)  (Q : Prop) :  ((∀ x : α, P x) → Q) ↔ (∃ x : α, (P x → Q))",
      "theorem drinker_paradox (pub_visitor : Type) (is_drinking : pub_visitor → Prop) [Inhabited pub_visitor] : (∃ someone : pub_visitor, (is_drinking someone  → ∀ person : pub_visitor, is_drinking person))"
    ]
  }





update_problem_to_database({ title: "Quantifiers validities" }, second_doc)