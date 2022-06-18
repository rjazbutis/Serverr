import {
  Schema,
  Model,
  Types,
  Document,
  model,
} from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { ProductDocument } from './product-model';

export type CartItem = {
  _id: Types.ObjectId,
  product: Types.ObjectId,
  amount: number
  createdAt: string,
  updatedAt: string,
};

export type CartItemProps = Omit<CartItem, '_id' | 'product' | 'createdAt' | 'updatedAt'> & {
  productId: string
};

export type CartItemDocument = Types.Subdocument<Types.ObjectId> & CartItem;

export type CartItemPopulatedDocument = Omit<CartItemDocument, 'product'> & {
  product: ProductDocument
};

const cartItemSchema = new Schema<CartItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

export type User = {
  email: string,
  password: string,
  role: 'user' | 'admin',
  cartItems: CartItem[],
  name?: string,
  surname?: string,
  img?: string,
  createdAt: string,
  updatedAt: string,
};

export type UserProps = Omit<User, 'createdAt' | 'updatedAt' | 'role' | 'cartItems'>;

type UserDocumentProps = {
  cartItems: Types.DocumentArray<CartItem>;
};

type UserModelType = Model<User, unknown, UserDocumentProps>;

export type UserDocument = Document<Types.ObjectId, unknown, User> & User & {
  _id: Types.ObjectId;
} & UserDocumentProps;

const userSchema = new Schema<User, UserModelType>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  surname: String,
  img: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  cartItems: {
    type: [cartItemSchema],
    default: [],
  },
}, {
  timestamps: true,
});

userSchema.plugin(uniqueValidator);

const UserModel = model<User, UserModelType>('User', userSchema);

export default UserModel;
