const actions = {

    // sample action 

   GET_SAMPLES: "GET_SAMPLES",
   GET_SAMPLES_SUCCESS_RESULT: "GET_SAMPLES_SUCCESS_RESULT",
   GET_SAMPLES_ERROR_RESULT: "GET_SAMPLES_ERROR_RESULT",

   getSample: (data) => ({
      type: actions.GET_SAMPLES,
      payload: { data }
   }),
   getSampleSuccess: (saveStatusCode, result) => ({
      type: actions.GET_SAMPLES_SUCCESS_RESULT,
      saveStatusCode,
      result
   }),
   getSampleError: (saveStatusCode, message) => ({
      type: actions.GET_SAMPLES_ERROR_RESULT,
      saveStatusCode,
      message
   }),

   RESET_SAMPLES: "RESET_SAMPLES",

   resetSamples: () => ({
      type: actions.RESET_SAMPLES,
   }),

}
export default actions;