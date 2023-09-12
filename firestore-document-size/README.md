# Firestore Document Size

**Author**: Alex Mamo (**[github.com/alexmamo](https://github.com/alexmamo)**)

**Description**: Calculates the size of a Firestore document whenever a new document is created or updated in a specific collection.

**Details**: Use this extension to calculate the size of a document in a Firestore collection of your choice so you can always stay below the maximum 1,048,576 bytes limitation.

Why write the size of the documents in the Realtime Database? It's because:
* The write operation is free of charge.
* The read operation is very cheap, as we only read a number that can have a maximum of 9 digits.

Additionally, this extension can be set to backfill existing documents in a specified collection to calculate the size of all documents.

## 🧩 Installation

To install the Extension, please follow the steps that are presented on the [Install a Firebase Extension](https://firebase.google.com/docs/extensions/install-extensions) page. In short, do one of the following:

- **To install the Extension from the Firebase Console:**, please click the button below:

  [![install-extension](https://i.ibb.co/XWtkZTV/intall-firebase-extension-button.png)](https://console.firebase.google.com/project/_/extensions/install?ref=alex-mamo/firestore-document-size)

  
