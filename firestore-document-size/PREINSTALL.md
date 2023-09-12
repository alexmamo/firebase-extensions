Use this extension to automatically calculate the size of Firestore documents
when they added to a specified Firestore collection path.

This extension expects a database layout like the following example:

    data (collection)
    |
    --- docId (document)
        |
        --- document fields

When you create new document, this extension calculates the size and adds a new
record inside the Realtime Database in a layout that look like this:

    data: {
      "docId": SIZE_IN_BYTES,
    }

Remember, the name of the collection, as well as the name of the node in the
Realtime Database can be configured when you install the extension.

#### Additional setup

Before installing this extension, make sure that you've set up in your Firebase project:
  * [Cloud Firestore](https://firebase.google.com/docs/firestore/quickstart)
  * [Realtime Database](https://firebase.google.com/docs/database/quickstart).
  * [Cloud Functions for Firebase](https://firebase.google.com/docs/functions/get-started)

Be aware that during install, reconfigure, or update, the Extensions service does not
validate the following at the time of parameter value entry:
  * Whether Firestore, the Realtime Database, or Cloud Functions for Firebase are set up
  within your Firebase project.
  * Whether the specified database paths exists within Firestore or the Realtime Database.

When triggered by an HTTP request, this extension responds with the calculation of the size
of the document.

# Billing

To install this extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing).
This extension uses other Firebase or Google Cloud Platform services which may have associated charges:

- Cloud Firestore
- Realtime Database
- Cloud Functions

If you choose to backfill the existing documents within a specific collection, you'll have
to pay a number of writes that is equal to the number of documents that exist within that
collection.

When you use this Firebase Extensions, you're only charged for the underlying resources that you use.
A paid-tier billing plan is only required if the extension uses a service that requires a paid-tier plan,
for example calling to a Google Cloud Platform API or making outbound network requests to non-Google services.
All Firebase services offer a free tier of usage. [Learn more about Firebase billing.](https://firebase.google.com/pricing)
