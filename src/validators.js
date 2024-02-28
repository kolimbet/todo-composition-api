import { helpers } from "@vuelidate/validators";
import api from "./api";

export const notSameAs = (param) =>
  helpers.withParams({ type: "notSameAs", value: param }, (value) => {
    // console.log("validator notSameAs", value, param);
    if (value !== param) return true;
    else return false;
  });

export const validatingCurrentPassword = (value) => {
  let result = {
    $valid: false,
    message: "The current password is entered incorrectly",
    extraParams: {},
  };

  return new Promise((resolve, reject) => {
    // canceling the check if one of the previous ones is not passed
    if (!value.length) {
      result.message = "Value is required";
      reject(result);
    } else {
      api
        .checkUserPassword(value)
        .then((data) => {
          result.$valid = data;
          resolve(result);
        })
        .catch((err) => {
          console.log(`set checkCurrentPassword error message: ${err}`);
          result.message = err;
          reject(result);
        });
    }
  });
};
