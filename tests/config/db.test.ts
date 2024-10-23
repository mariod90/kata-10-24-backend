import sqlite3 from 'sqlite3';
import {connectToDatabase} from "../../src/config/db";

jest.mock('sqlite3', () => {
    const mockRun = jest.fn();
    const mockDatabase = jest.fn(() => ({
        run: mockRun,
        serialize: jest.fn((callback: (this: any) => void) => callback()),
    }));

    return {
        Database: mockDatabase,
    };
});

describe('connectToDatabase', () => {
    let mockDatabase: any;

    beforeEach(() => {
        mockDatabase = sqlite3.Database as jest.MockedClass<typeof sqlite3.Database>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should create a new database connection', () => {
        const db = connectToDatabase();

        expect(db.run).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS tasks'));
    });

    test('should create the tasks table if it does not exist', () => {
        const db = connectToDatabase();

        expect(db.run).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS tasks'));
    });
});
