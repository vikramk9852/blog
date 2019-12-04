
class FirebaseDB {

  constructor(database) {
    FirebaseDB.database = database;
  }

  // *** Databse API ***
  write(path, data) {
    let ref = FirebaseDB.database.ref(path);
    return ref.set(data);
  }

  push(path, data) {
    let ref = FirebaseDB.database.ref(path);
    let newRef = ref.push();
    data.id = newRef.key;
    return newRef.set(data);
  }

  put(path, data) {
    let ref = FirebaseDB.database.ref(path);
    return ref.set(data);
  }

  getDataBypath(path) {
    let ref = FirebaseDB.database.ref(path);
    return ref.once('value');
  }

  moveData(oldPath, newPath) {
    let oldRef = FirebaseDB.database.ref(oldPath);
    let newRef = FirebaseDB.database.ref(newPath);
    return oldRef.once('value').then(snap => {
      return newRef.set(snap.val());
    }).then(() => {
      return oldRef.set(null);
    })
  }

  updateBypath(path, data) {
    let ref = FirebaseDB.database.ref(path);
    return ref.update(data);
  }

  deleteBypath(path) {
    let ref = FirebaseDB.database.ref(path);
    return ref.remove();
  }
}

export default FirebaseDB;