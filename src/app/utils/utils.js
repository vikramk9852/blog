
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

    static urlToBlobImage(url) {
        let proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        return fetch(proxyUrl + url).then(res => {
            console.log(res);
            return res.blob()
        })
    }
}

export default Utils;