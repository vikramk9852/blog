
class FirebaseStorage {
    constructor(storage) {
        FirebaseStorage.storage = storage;
    }

    uploadBase64Image(image) {
        let date = new Date();
        date = date.getTime().toString();
        return FirebaseStorage.storage.ref().child(date).putString(image, 'data_url', { contentType: 'image/jpg' })
    }

    uploadBlobImage(image) {
        let date = new Date();
        date = date.getTime().toString();
        return FirebaseStorage.storage.ref().child(date).put(image);
    }
}

export default FirebaseStorage;