import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];

    if (token === 'mysecrettoken') {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};
