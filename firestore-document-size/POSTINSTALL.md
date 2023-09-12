# See it in action

You can test out this extension right away!

  1. Go to your [Cloud Firestore dashboard](https://console.firebase.google.com/project/${param:PROJECT_ID}/firestore/data/) in the Firebase console.
  2. Visit the Firestore collection that has the name you chose during the installation process.
  If it doesn't exist, don't worry, it will be created as soon as you create the first document.
  3. Create a new document, preferably with the details that are explained in official
  [document size calculation](https://firebase.google.com/docs/firestore/storage-size#document-size).

# Using the extension

We recommend adding data the documents using add(),
for example, `db.collection().add(obj)` because adding
documents this way, will automatically assig unique document
IDs. Learn more about reading and writing data for your platform
(iOS, Android, or Web) in [Firestore documentation](https://firebase.google.com/docs/firestore).

# Monitoring

As a best practice, you can [monitor the activity](https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor) of your installed extension, including checks on its health, usage, and logs.
