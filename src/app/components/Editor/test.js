// let str = `<p><img src="blob:http://localhost:3000/55904086-254f-4917-9022-aa14b7bde03e"></p><p><br></p><p><img src="blob:http://localhost:3000/6921b6d5-8340-4b37-838f-bfe0cd9589de"></p><p><br></p><p><img src="blob:http://localhost:3000/54f4b926-5519-417d-9d89-feb2549ad245"> </p>`
// let urls = [], rex = /<img[^>]+src="?([^"\s]+)"?\s*\/>/g;

var m,
    urls = [],
    str = '<img src="http://site.org/one.jpg />\n <img src="http://site.org/two.jpg />',
    rex = /<img[^>]+src="?([^"\s]+)"?\s*\/>/g;

while (m = rex.exec(str)) {
    urls.push(m[1]);
}

console.log(urls); 