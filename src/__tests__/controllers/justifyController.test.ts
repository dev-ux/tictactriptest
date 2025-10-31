import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { app } from '../../index';

// L'application est déjà configurée dans index.ts

describe('Justify Controller', () => {
  let token: string;

  beforeAll(async () => {
    // Get a valid token first
    const res = await request(app)
      .post('/api/token')
      .send({ email: 'test@example.com' });
    token = res.body.token;
  });

  it('should justify text with valid token', async () => {
    const text = 'This is a test.';
    const res = await request(app)
      .post('/api/justify')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'text/plain')
      .send(text);
    
    expect(res.status).toBe(200);
    expect(res.text).toBeDefined();
    expect(res.text.length).toBeGreaterThan(0);
  });

  it('should return 401 without token', async () => {
    const res = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .send('Test');
    
    expect(res.status).toBe(401);
  });

  it('should return 400 for empty content', async () => {
    const res = await request(app)
      .post('/api/justify')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'text/plain')
      .send('');
    
    expect(res.status).toBe(400);
  });
});
