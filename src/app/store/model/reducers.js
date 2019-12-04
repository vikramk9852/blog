import actions from "./actions";

const initState = {
	// users: [],
	sampleResponse: {}
};

export default function reducer(state = initState, action) {
	switch (action.type) {
        case actions.GET_SAMPLES:
        return {
            ...state,
            loading: true
        };
    case actions.GET_SAMPLES_SUCCESS_RESULT:
        return {
            ...state,
            loading: false,
            sampleResponse: {
                type: action.type,
                statusCode: action.saveStatusCode,
                message: action.message
            }
        };
    case actions.GET_SAMPLES_ERROR_RESULT:
        return {
            ...state,
            loading: false,
            sampleResponse: {
                type: action.type,
                statusCode: action.saveStatusCode,
                message: action.message
            }
        };
    
    case actions.RESET_SAMPLES:
        return {
            ...state,
            loading: false,
            sampleResponse: {}
        };
        
    default:
        return state;
    }
}