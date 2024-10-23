import { Request, Response, NextFunction } from 'express';
import {authMiddleware} from "../../../../src/infrastructure/web/middleware/authMiddleware";

const mockRequest = (headers: Record<string, string>) => {
    return {
        headers
    } as Request;
};

const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockNext = jest.fn() as NextFunction;

describe('authMiddleware', () => {
    beforeEach(() => {
        jest.clearAllMocks();  // Limpia todos los mocks
    });
    it('should call next() if the token is valid', () => {
        const req = mockRequest({ authorization: 'mysecrettoken' });
        const res = mockResponse();

        authMiddleware(req, res, mockNext);

        expect(mockNext).toHaveBeenCalled(); // Debe llamar a next()
        expect(res.status).not.toHaveBeenCalled(); // No debe haber llamado a res.status()
    });

    it('should return 401 if the token is missing', () => {
        const req = mockRequest({});
        const res = mockResponse();

        authMiddleware(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(401); // Debe devolver 401 Unauthorized
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: Invalid token' });
        expect(mockNext).not.toHaveBeenCalled(); // No debe llamar a next()
    });

    it('should return 401 if the token is invalid', () => {
        const req = mockRequest({ authorization: 'invalidtoken' });
        const res = mockResponse();

        authMiddleware(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(401); // Debe devolver 401 Unauthorized
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: Invalid token' });
        expect(mockNext).not.toHaveBeenCalled(); // No debe llamar a next()
    });
});
