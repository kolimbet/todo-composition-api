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

function checkImageSize(image, maxSizeKB = 1024) {
  const maxSizeB = maxSizeKB * 1024;
  const result = {
    $valid: false,
    message: `The file size should not exceed ${maxSizeKB} kB`,
  };

  if (image.size <= maxSizeB) result.$valid = true;

  return result;
}

function checkImageType(image) {
  const acceptableTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    // "image/gif",
  ];
  const result = {
    $valid: false,
    message: "Acceptable image types: jpeg, png, webp",
  };

  if (acceptableTypes.includes(image.type)) result.$valid = true;

  return result;
}

export const validateImageToAvatar = (value) => {
  let result = {
    $valid: false,
    message: "",
  };

  // console.log("validateImageToAvatar", value);
  if (value === undefined || value === "" || !value) {
    result.message = "The file is not selected";
    return result;
  }

  const sizeCheck = checkImageSize(value);
  if (!sizeCheck.$valid) return sizeCheck;

  const typeCheck = checkImageType(value);
  if (!typeCheck.$valid) return typeCheck;

  result.$valid = true;
  return result;
};
