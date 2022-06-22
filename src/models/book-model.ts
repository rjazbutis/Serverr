import {
  Schema,
  Model,
  model,
} from 'mongoose';

type Book = {
  googleId: string,
  title: string,
  authors: [string],
  link: string,
  image: string,
  description: string,
};

const bookSchema = new Schema<Book, Model<Book>>({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  authors: {
    type: [String],
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const BookModel = model('Book', bookSchema);

export default BookModel;
