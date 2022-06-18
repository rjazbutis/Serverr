import { Error } from 'mongoose';

type ErrorMessagesLT = {
  price: string,
  amount: string,
  title: string,
};

const productValidationErrorMessagesLT: ErrorMessagesLT = {
  price: 'Trūksta produkto kainos',
  amount: 'Trūksta produkto kiekio',
  title: 'Trūksta produkto pavadinimo',
};

const isErrorMessageLT = (property: string)
  : property is keyof ErrorMessagesLT => property in productValidationErrorMessagesLT;

export const formatProductValidationError = (validationError: Error.ValidationError) => {
  const errorArray = Object.entries(validationError.errors);
  for (let i = 0; i < errorArray.length; i += 1) {
    const [property] = errorArray[i];
    if (isErrorMessageLT(property)) {
      return productValidationErrorMessagesLT[property];
    }
  }

  return 'Trūksta duomenų';
};
