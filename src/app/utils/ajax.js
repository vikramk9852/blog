let headers = {
	'Content-Type': 'application/json'
};

export async function get(url, payload) {
	
	return new Promise(function (resolve, reject) {
		try {
			if (null === url || undefined === url || '' === url) {
				reject('URL not present.');
			} else {
				
				if(payload && payload.data && payload.data.headers ){
					Object.keys(payload.data.headers).forEach(key=>{
						// debugger;
						headers[key] = payload.data.headers[key];
					})
				}
				const options = {
					method: 'GET',
					headers: headers
				};
				fetch(url, options)
					.then(res => res.json())
					.then(res => {
						resolve(res);
					})
					.catch(error => reject(error));
			}
		} catch (error) {
			// _validateError(error, resolve, reject);
		}
	});
}

export async function post(url, payload) {
	return new Promise(function (resolve, reject) {
		try {
			if (null === url || undefined === url || '' === url) {
				reject('URL not present.');
			} else {
				const options = {
					method: 'POST',
					headers: headers,
					body: JSON.stringify(payload.data)
				};
				fetch(url, options)
					.then(res => res.json())
					.then(res => {
						resolve(res);
					})
					.catch(error => reject(error));
			}
		} catch (error) {
			// _validateError(error, resolve, reject);
		}
	});
}

export function parsePayload(payload) {
	let parsedResponse = {};

	const { data, status } = payload;
	if (status && status.status == 200) {
		parsedResponse.statusCode = 0;
		parsedResponse.successMessage = status.message;
		parsedResponse.response = data ? data : [];
	} else {
		parsedResponse.statusCode = 1;
		parsedResponse.errMessage = status.message;
		parsedResponse.response = null;
	}

	return parsedResponse;
}