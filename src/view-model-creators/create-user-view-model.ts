import { User, UserDocument } from '../models/user-model';
import createCartItemViewModel, { CartItemViewModel } from './create-cart-item-view-model';
import config from '../config';

export type UserViewModel = Omit<User, 'password' | 'cartItems' | 'createdAt' | 'updatedAt'> & {
  id: string,
  cartItems: CartItemViewModel[],
};

const createUserViewModel = (userDoc: UserDocument): UserViewModel => ({
  id: userDoc._id.toString(),
  email: userDoc.email,
  role: userDoc.role,
  cartItems: userDoc.cartItems.map(createCartItemViewModel),
  name: userDoc.name,
  surname: userDoc.surname,
  img: userDoc.img && `${config.server.domain}/${userDoc.img}`.replaceAll('\\', '/'),
});

export default createUserViewModel;
