import { RequestHandler } from 'express';
import { CartItemPopulatedDocument, CartItemProps } from '../models/user-model';
import createCartItemPopulatedViewModel, { CartItemPopulatedViewModel } from '../view-model-creators/create-cart-item-populated-view-model';
import createCartItemViewModel, { CartItemViewModel } from '../view-model-creators/create-cart-item-view-model';

type CartItemResponse = { cartItem: CartItemViewModel } | ErrorResponseBody;

export const getCart: RequestHandler<
  unknown,
  { cartItems: CartItemPopulatedViewModel[] } | ErrorResponseBody
> = async (req, res) => {
  const { authUserDoc } = req;

  try {
    if (authUserDoc === undefined) {
      throw new Error('Reikalingas prisijungimas');
    }

    const authUserPopulatedDoc = await authUserDoc
      .populate<{ cartItems: CartItemPopulatedDocument[] }>('cartItems.product');

    res.status(200).send({
      cartItems: authUserPopulatedDoc.cartItems.map(createCartItemPopulatedViewModel),
    });
  } catch (error) {
    res.status(400).send({
      error: error instanceof Error ? error.message : 'Klaida siunčiant krepšelį',
    });
  }
};

export const addItem: RequestHandler<
  unknown,
  CartItemResponse,
  CartItemProps
> = async (req, res) => {
  const { productId, ...cartItemProps } = req.body;
  const { authUserDoc } = req;

  try {
    if (authUserDoc === undefined) {
      throw new Error('Reikalingas prisijungimas');
    }

    const productExistsInCart = authUserDoc.cartItems.some(
      (cartItem) => cartItem.product.equals(productId),
    );

    if (productExistsInCart) {
      throw new Error('Toks daiktas jau yra krepšelyje');
    }
    authUserDoc.cartItems.push({
      product: productId,
      ...cartItemProps,
    });
    await authUserDoc.save();

    const cartItem = authUserDoc.cartItems[authUserDoc.cartItems.length - 1];

    res.status(200).json({
      cartItem: createCartItemViewModel(cartItem),
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Neteisingi pridedamo produkto duomenys',
    });
  }
};

export const updateItem: RequestHandler<
  { itemId: string },
  CartItemResponse,
  Partial<CartItemProps>
> = async (req, res) => {
  const { itemId } = req.params;
  const { authUserDoc } = req;
  const { amount } = req.body;

  try {
    if (authUserDoc === undefined) {
      throw new Error('Reikalingas prisijungimas');
    }

    const cartItemRef = authUserDoc.cartItems.find(
      (cartItem) => cartItem._id.equals(itemId),
    );

    if (cartItemRef === undefined) {
      throw new Error(`Nerastas krepšelio daiktas su tokiu id: '${itemId}'`);
    }

    if (amount) {
      cartItemRef.amount = amount;
      await authUserDoc.save();
    }

    res.status(200).send({
      cartItem: createCartItemViewModel(cartItemRef),
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Neteisingi atnaujinamo produkto duomenys',
    });
  }
};

export const deleteItem: RequestHandler<
  { itemId: string },
  CartItemResponse
> = async (req, res) => {
  const { itemId } = req.params;
  const { authUserDoc } = req;
  try {
    if (authUserDoc === undefined) {
      throw new Error('Reikalingas prisijungimas');
    }

    const deletedItemDocIndex = authUserDoc.cartItems.findIndex(
      (cartItem) => cartItem._id.equals(itemId),
    );
    if (deletedItemDocIndex === -1) {
      throw new Error('Nerastas pirkinių krepšelio daiktas');
    }

    const deletedItemDoc = authUserDoc.cartItems[deletedItemDocIndex];
    authUserDoc.cartItems.splice(deletedItemDocIndex, 1);

    await authUserDoc.save();

    res.status(200).json({ cartItem: createCartItemViewModel(deletedItemDoc) });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Neteisingi trinamo produkto duomenys',
    });
  }
};
