import imageCompression from 'browser-image-compression';

class Utils {

    static getFromLocalStorage(id) {
        return localStorage.getItem(id);
    }

    static getMonth(month) {
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months[month];
    }

    static getDateString(dateString) {
        let dateObj = new Date(dateString);
        let date = dateObj.getDate();
        let month = Utils.getMonth(dateObj.getMonth());
        let year = dateObj.getFullYear();
        return `${month} ${date}, ${year}`;
    }

    static replaceOccurences(text, toReplace, toReplaceWith) {
        text = text.trim();
        return text.split(toReplace).join(toReplaceWith);
    }

    static urlToBlobImage(url) {
        let proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        return fetch(proxyUrl + url).then(res => {
            return res.blob()
        })
    }

    static getBase64Image(imgUrl, compress, callback) {
        return Utils.urlToBlobImage(imgUrl).then(blob => {
            let promise;
            if (compress) {
                promise = imageCompression(blob, {
                    maxSizeMB: 1.5,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true
                })
            }
            else {
                promise = Promise.resolve(blob);
            }
            promise.then(res => {

                var fr = new FileReader()
                fr.onload = () => {
                    var b64 = fr.result;
                    callback(b64);
                }
                fr.readAsDataURL(res)
            })
        })
    }
}

export default Utils;