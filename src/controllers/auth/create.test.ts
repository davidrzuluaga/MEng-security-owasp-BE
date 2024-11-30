import request from 'supertest';
import express from 'express';
import { createUser } from './create';
import User from '../../db/models/user.model';
import SecurityManager from '../../modules/security';

const app = express();
app.use(express.json());
app.post('/create', createUser);

jest.mock('../../db/models/user.model');
jest.mock('../../modules/security');

describe('POST /create', () => {
    it('should return 400 if required fields are missing', async () => {
        const response = await request(app).post('/create').send({
            email: 'test@example.com',
            password: 'password123',
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Please pass email, name, role, password, and client_id.');
    });

    it('should return 201 and create a user if all fields are provided', async () => {
        const mockUser = {
            id: 1,
            email: 'test@example.com',
            name: 'Test User',
            role: 'user',
            client_id: 'client123',
            deleted: false,
        };

        (SecurityManager.encryptPassword as jest.Mock).mockResolvedValue('hashedPassword');
        (User.create as jest.Mock).mockResolvedValue(mockUser);

        const response = await request(app).post('/create').send({
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
            role: 'user',
            client_id: 'client123',
        });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.user).toEqual({
            id: mockUser.id,
            email: mockUser.email,
            name: mockUser.name,
            role: mockUser.role,
        });
    });

    it('should return 500 if there is a server error', async () => {
        (SecurityManager.encryptPassword as jest.Mock).mockRejectedValue(new Error('Encryption error'));

        const response = await request(app).post('/create').send({
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
            role: 'user',
            client_id: 'client123',
        });

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Server error. Please try again.');
    });
});