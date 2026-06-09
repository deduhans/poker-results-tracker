import dotenv from 'dotenv';

dotenv.config();

export const env = {
    apiUrl: `http://${process.env.NEST_HOST || '127.0.0.1'}:${process.env.NEST_PORT || '3000'}`,
};