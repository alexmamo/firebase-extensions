# See it in action

You can test out this extension right away!

  1. Go to your [Cloud Firestore dashboard][1] in the Firebase console.
  2. Visit the Firestore collection that has the name you chose during the installation process. If it doesn't exist, don't worry, it will be created as soon as you create the first document.
  3. Create a new document, preferably with the details that are explained in the official [document size calculation][2]. Are you getting 147?

# Using the extension

We recommend adding the documents using the `add()` function, for example, `db.collection("data").add(obj)` because adding documents this way, will automatically assign unique document IDs. Learn more about reading and writing data for your platform (iOS, Android, or Web) in [Firestore documentation][3].

# Monitoring

As a best practice, you can [monitor the activity][4] of your installed extension, including checks on its health, usage, and logs.

[1]: https://console.firebase.google.com/project/${param:PROJECT_ID}/firestore/data/
[2]: https://firebase.google.com/docs/firestore/storage-size#document-size
[3]: https://firebase.google.com/docs/firestore
[4]: https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor
