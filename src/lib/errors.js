export function parseErrorObject(err, defaultMessage = "") {
  if (typeof err === "string") return err;
  else if (typeof err === "object" && err.message) return err.message;
  else return defaultMessage;
}

export function parseApiError(err) {
  let message = "Server internal error";
  if (err.error) message = err.error;
  else if (err.response?.data?.error) message = err.response.data.error;
  // console.log(`get error message: ${message}`);
  return message;
}
