import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import UserModel from '../models/user-model';

type DecodedInfo = { email: string, role: 'admin' | 'user', iat?: number };

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  try {
    if (authHeader === undefined) throw new Error('Reikalingas prisijungimas');

    const token = authHeader.split(' ')[1];
    if (token === undefined) throw new Error('Klaidingi vartotojo atpažinimo duomenys');

    const decodedInfo = jwt.verify(token, config.token.secret) as DecodedInfo;
    req.tokenData = {
      email: decodedInfo.email,
      role: decodedInfo.role,
      token: `Bearer ${token}`,
    };

    next();
  } catch (error) {
    res.status(401).json({
      error: error instanceof Error ? error.message : 'Klaida atpažįstant vartotoją',
    });
  }
};

export const userMiddleware: RequestHandler = async (req, res, next) => {
  if (req.tokenData === undefined) {
    res.status(401).json({
      error: 'Reikalingas Prisijungimas',
    });
    return;
  }
  const authUserDoc = await UserModel.findOne({ email: req.tokenData.email });

  if (authUserDoc === null) {
    res.status(404).json({
      error: 'Autentifikuojamas vartotojas nerastas',
    });
    return;
  }

  req.authUserDoc = authUserDoc;

  next();
};
export const adminMiddleware: RequestHandler = async (req, res, next) => {
  if (req.tokenData === undefined) {
    res.status(401).json({
      error: 'Reikalingas Prisijungimas',
    });
    return;
  }

  if (req.tokenData.role !== 'admin') {
    res.status(401).json({
      error: 'Veiksmas leidžiamas tik adminui',
    });
    return;
  }

  next();
};
