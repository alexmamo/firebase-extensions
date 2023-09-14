# Firestore Document Size

**Author**: Alex Mamo (**[github.com/alexmamo][1]**)

**Description**: Calculates the size of a Firestore document whenever a new document is created or updated in a specific collection.

**Details**: Use this extension to calculate the size of a document in a Firestore collection of your choice so you can always stay below the maximum 1,048,576 bytes limitation.

Why write the size of the documents in the Realtime Database? It's because:
* The write operation is free of charge.
* The read operation is very cheap, as we only read a number that can have a maximum of 9 digits.

Additionally, this extension can be set to backfill existing documents in a specified collection to calculate the size of all documents.

## 🧩 Installation

To install the Extension, please follow the steps that are presented on the [Install a Firebase Extension][2] page. In short, do one of the following:

- **To install the Extension from the Firebase Console**, please click the button below:

  [![install-extension][3]][4]

- **Install from the Firebase CLI**, please run the following command:

  ```
  firebase ext:install alexmamo/firestore-document-size --project=YOUR_PROJECT_ID
  ```

## 🛠️ Configuration Parameters

| Name                           | Description                                                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Firestore collection path      | A path that points to a Firestore collection that contains documents you want to get the size of.                        |
| Realtime Database path         | The path of a node in the Realtime Database where you want to save the document sizes.                                   |
| Backfill existing documents    | If you enable this option, the extension will calculate the size of all documents that exist in the selected collection. |
| Cloud Functions location       | The location where you want to deploy the functions created for this extension.                                          |

[1]: https://github.com/alexmamo
[2]: https://firebase.google.com/docs/extensions/install-extensions
[3]: https://i.ibb.co/XWtkZTV/intall-firebase-extension-button.png
[4]: https://console.firebase.google.com/project/_/extensions/install?ref=alexmamo/firestore-document-size
