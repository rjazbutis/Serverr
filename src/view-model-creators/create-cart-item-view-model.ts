import { CartItem } from '../models/user-model';

export type CartItemViewModel = {
  id: string,
  productId: string,
  amount: number,
  updatedAt: string,
};

const createCartItemViewModel = (cartItemDoc: CartItem): CartItemViewModel => ({
  id: cartItemDoc._id.toString(),
  productId: cartItemDoc.product._id.toString(),
  amount: cartItemDoc.amount,
  updatedAt: cartItemDoc.updatedAt,
});

export default createCartItemViewModel;
