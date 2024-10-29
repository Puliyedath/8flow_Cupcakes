import mongoose from 'mongoose';

type MongooseValidationError = mongoose.Error.ValidationError
export default function validateCupcakeData(error: MongooseValidationError):  Array<string> | [] {
  return Object.values(error.errors).map((err) => {
    if (err instanceof mongoose.Error.ValidatorError) {
      return err.message;
    }
    return 'Unknown validation error';
  });
}
