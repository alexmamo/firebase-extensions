const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const {
  getDatabase,
  ServerValue,
} = require("firebase-admin/database");

const {
  getFirestore,
  Timestamp,
  GeoPoint,
  DocumentReference,
} = require("firebase-admin/firestore");

const {
  tasks,
} = require("firebase-functions/v1");

const {
  getExtensions,
} = require("firebase-admin/extensions");

const {
  getFunctions,
} = require("firebase-admin/functions");

const COLL_REF = process.env.FIRESTORE_COLLECTION_REFERENCE;
const DOC_ID = "{docId}";
const NODE_REF = process.env.REALTIME_DATABASE_NODE_REFERENCE;
const BACKFILL_EXISTING_DOCUMENTS = process.env.BACKFILL_EXISTING_DOCUMENTS;
const DOCS_PER_BACKFILL = 2;

exports.onDocumentCreate = functions.firestore
    .document(COLL_REF + DOC_ID)
    .onCreate(async (snapshot, context) => {
      const docId = context.params.docId;
      const docSize = getDocumentSize(snapshot);
      await getDatabase().ref().child(COLL_REF).child(docId).set(docSize);
    });

exports.onDocumentUpdate = functions.firestore
    .document(COLL_REF + DOC_ID)
    .onUpdate(async (snapshot, context) => {
      const docId = context.params.docId;
      const beforeDoc = snapshot.before;
      const beforeDocSize = getDocumentSize(beforeDoc);
      const afterDoc = snapshot.after;
      const afterDocSize = getDocumentSize(afterDoc);
      const difference = afterDocSize - beforeDocSize;
      if (difference != 0) {
        const increment = ServerValue.increment(difference);
        await getDatabase().ref().child(NODE_REF).child(docId).set(increment);
      }
    });

exports.onDocumentDelete = functions.firestore
    .document(COLL_REF + DOC_ID)
    .onDelete(async (_snapshot, context) => {
      const docId = context.params.docId;
      await getDatabase().ref().child(NODE_REF).child(docId).remove();
    });

exports.doBackfillExistingDocuments = tasks
    .taskQueue()
    .onDispatch(async (data) => {
      const runtime = getExtensions().runtime();

      if (!BACKFILL_EXISTING_DOCUMENTS) {
        return runtime.setProcessingState(
            "PROCESSING_COMPLETE",
            "The size of the documents inside the existing collection " +
            " weren't calculated because the parameter " +
            "<u>Backfill existing documents</u> was set to No. " +
            "If you want to calculate the size of the documents in the " +
            "existing collection, please reconfigure this instance.",
        );
      }
      const offset = data["offset"] !== undefined ? data["offset"] : 0;

      const querySnapshot = await getFirestore()
          .collection(COLL_REF)
          .limit(DOCS_PER_BACKFILL)
          .get();

      const processed = await Promise.allSettled(
          querySnapshot.docs.map(async (doc) => {
            const docId = doc.id;
            const docIdRef = getDatabase().ref().child(NODE_REF).child(docId);
            const snapshot = await docIdRef.get();
            if (!snapshot.exists()) {
              const docSize = getDocumentSize(doc);
              await docIdRef.set(docSize);
            }
          }),
      );

      if (processed.length == DOCS_PER_BACKFILL) {
        const queue = getFunctions().taskQueue(
            "backfilldata",
            process.env.EXT_INSTANCE_ID,
        );
        return await queue.enqueue({
          offset: offset + DOCS_PER_BACKFILL,
        });
      } else {
        return runtime
            .setProcessingState(
                "PROCESSING_COMPLETE",
                "Backfill complete.",
            );
      }
    });

const SLASH = "/";
const ADDITIONAL_BYTE = 1;
const DOCUMENT_NAME_ADDITIONAL_BYTES = 16;
const DOCUMENT_DATA_ADDITIONAL_BYTES = 32;
const NULL_SIZE = 1;
const NUMBER_SIZE = 8;
const BOOLEAN_SIZE = 1;
const TIMESTAMP_SIZE = 8;
const GEO_POINT_SIZE = 16;

let documentNameSize = null;
let documentDataSize = null;

/**
 * Gets the document size.
 * @param {QueryDocumentSnapshot} doc The Firestore document.
 * @return {int} The size of the document.
 */
function getDocumentSize(doc) {
  documentNameSize = getDocumentNameSize(doc);
  documentDataSize = getDocumentDataSize(doc);
  return documentNameSize + documentDataSize + DOCUMENT_DATA_ADDITIONAL_BYTES;
}

/**
 * Gets the document name size.
 * @param {QueryDocumentSnapshot} document The Firestore document.
 * @return {int} The size of the document name.
 */
function getDocumentNameSize(document) {
  const documentPath = document.ref.path;
  let documentNameSize = 0;
  const names = documentPath.split(SLASH);
  for (const name of names) {
    documentNameSize += name.length + ADDITIONAL_BYTE;
  }
  return documentNameSize + DOCUMENT_NAME_ADDITIONAL_BYTES;
}

/**
 * Gets the document data size.
 * @param {QueryDocumentSnapshot} document The Firestore document.
 * @return {int} The size of the document data.
 */
function getDocumentDataSize(document) {
  const data = document.data();
  let dataSize = 0;
  for (const [key, value] of Object.entries(data)) {
    const entrySize = getEntrySize(key, value);
    dataSize += entrySize;
  }
  return dataSize;
}

/**
 * Gets the entry size.
 * @param {string} key The key of the entry.
 * @param {any} value The value of the entry.
 * @return {int} The size of the entry.
 */
function getEntrySize(key, value) {
  const entryKeySize = getEntryKeySize(key);
  const entryValueSize = getEntryValueSize(value);
  return entryKeySize + entryValueSize;
}

/**
 * Gets the entry key size.
 * @param {string} key The key of the entry.
 * @return {int} The size of the key.
 */
function getEntryKeySize(key) {
  return key.length + ADDITIONAL_BYTE;
}

/**
 * Gets the value size.
 * @param {any} obj The value of the value.
 * @return {int} The size of the value.
 */
function getEntryValueSize(obj) {
  if (obj === null || obj === undefined) {
    return NULL_SIZE;
  }

  let propertyValueSize = 0;
  if (typeof obj === "string") {
    propertyValueSize = obj.length + ADDITIONAL_BYTE;
  } else if (typeof obj === "number" && Number.isFinite(obj)) {
    propertyValueSize = NUMBER_SIZE;
  } else if (typeof obj === "boolean") {
    propertyValueSize = BOOLEAN_SIZE;
  } else if (typeof obj === "object") {
    if (Array.isArray(obj)) {
      propertyValueSize = getArrayValue(obj);
    } else if (obj instanceof Timestamp) {
      propertyValueSize = TIMESTAMP_SIZE;
    } else if (obj instanceof GeoPoint) {
      propertyValueSize = GEO_POINT_SIZE;
    } else if (obj instanceof DocumentReference) {
      propertyValueSize = getDocumentNameSize(obj);
    } else if (!Array.isArray(obj)) {
      propertyValueSize = getMapContentSize(obj);
    }
  }
  return propertyValueSize;
}

/**
 * Gets the array size.
 * @param {any} array The value of the array.
 * @return {int} The size of the array.
 */
function getArrayValue(array) {
  let arrayValueSize = 0;
  for (const obj of array) {
    if (obj === null || obj === undefined) {
      arrayValueSize += NULL_SIZE;
    } else if (typeof obj === "string") {
      arrayValueSize += obj.length + ADDITIONAL_BYTE;
    } else if (typeof obj === "number" && Number.isFinite(obj)) {
      arrayValueSize += NUMBER_SIZE;
    } else if (typeof obj === "boolean") {
      arrayValueSize += BOOLEAN_SIZE;
    } else if (typeof obj === "object") {
      if (obj instanceof Timestamp) {
        arrayValueSize += TIMESTAMP_SIZE;
      } else if (obj instanceof GeoPoint) {
        arrayValueSize += GEO_POINT_SIZE;
      } else if (obj instanceof DocumentReference) {
        arrayValueSize += getDocumentNameSize(obj);
      } else if (!Array.isArray(obj)) {
        arrayValueSize += getMapContentSize(obj);
      }
    }
  }
  return arrayValueSize;
}

/**
 * Gets the map content size.
 * @param {any} mapContent The value of the map content.
 * @return {int} The size of the map content.
 */
function getMapContentSize(mapContent) {
  let mapContentSize = 0;
  for (const [key, value] of Object.entries(mapContent)) {
    const entrySize = getEntrySize(key, value);
    mapContentSize += entrySize;
  }
  return documentNameSize + mapContentSize + DOCUMENT_DATA_ADDITIONAL_BYTES;
}
