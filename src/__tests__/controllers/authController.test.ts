import request from 'supertest';
import { app } from '../../index';

describe('Auth Controller', () => {
  it('should generate a token for valid email', async () => {
    const res = await request(app)
      .post('/api/token')
      .send({ email: 'test@example.com' });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should return 400 for invalid email', async () => {
    const res = await request(app)
      .post('/api/token')
      .send({ email: 'invalid-email' });
    
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 for missing email', async () => {
    const res = await request(app)
      .post('/api/token')
      .send({});
    
    expect(res.status).toBe(400);
  });
});
