# See it in action

You can test out this extension right away!

  1. Go to your [Cloud Firestore dashboard][1] in the Firebase Console.
  2. Visit the Firestore collection that has the name you chose during the installation process. If it doesn't exist, don't worry, it will be created as soon as you create the first document.
  3. Create a new document, and wait until its size is written in the Realtime Database.

# Using the extension

If you add the documents programatically, then we recommend you adding them using the `add()` function, for example, `db.collection("data").add(obj)` because adding documents this way, will automatically assign unique document IDs. Learn more about reading and writing data for your platform (iOS, Android, or Web) in [Firestore documentation][2].

# Monitoring

As a best practice, you can [monitor the activity][3] of your installed extension, including checks on its health, usage, and logs.

[1]: https://console.firebase.google.com/project/${param:PROJECT_ID}/firestore/data/
[2]: https://firebase.google.com/docs/firestore
[3]: https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor
