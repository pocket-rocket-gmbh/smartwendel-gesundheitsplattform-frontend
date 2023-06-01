export const getErrorMessage = (error: any) => {
  let result: string;

  if (error.response) {
    if (error.response.data && error.response.data.msg) {
      result = error.response.data.msg;
    } else {
      result = "Ein Fehler ist aufgetreten";
    }
  } else if (error.code) {
    result = error.code;
  } else {
    result = error.message;
  }

  return result;
};
