Use this extension to automatically calculate the size of Firestore documents when they are added to a specified Firestore collection.

This extension expects a database layout like the following example:

    data (collection)
    |
    --- docId (document)
        |
        --- document fields

When you create a new document, this Extension calculates the size of the document and adds a new key-value pair inside the Realtime Database in a layout that looks like this:

    data: {
      "docId": SIZE_IN_BYTES,
    }

Remember, the name of the Firestore collection, as well as the name of the node in the Firebase Realtime Database, can be configured when you install the Extension.

#### Additional setup

Before installing this extension, make sure that you've set up the following products inside your Firebase project:
  * [Cloud Firestore][1]
  * [Realtime Database][2]
  * [Cloud Functions for Firebase][3]

Be aware that during install, reconfigure, or update, the Extensions service does not validate the following at the time of parameter value entry:
  - Whether Cloud Firestore, the Realtime Database, or Cloud Functions for Firebase are set up within your Firebase project.
  - Whether the specified database paths exist within Cloud Firestore or the Realtime Database.

When triggered by an HTTP request, this Extension responds with the calculation of the size of the document.

# Billing

To install this extension, your project must be on the [Blaze (pay as you go) plan][4]. This extension uses other Firebase or Google Cloud Platform services which may have associated charges:

- Cloud Firestore
- Realtime Database
- Cloud Functions

If you choose to backfill the existing documents within a specific collection, then you'll have to pay a number of reads that is equal to the number of documents that exist within that
collection. The writes inside the Realtime Database are free of charge.

When you use this Firebase Extensions, you're only charged for the underlying resources that you use. A paid-tier billing plan is only required if the extension uses a service that requires a paid-tier plan, for example calling a Google Cloud Platform API or making outbound network requests to non-Google services. All Firebase services offer a free tier of usage. [Learn more about Firebase billing][4].

[1]: https://firebase.google.com/docs/firestore/quickstart
[2]: https://firebase.google.com/docs/database/quickstart
[3]: https://firebase.google.com/docs/functions/get-started
[4]: https://firebase.google.com/pricing
