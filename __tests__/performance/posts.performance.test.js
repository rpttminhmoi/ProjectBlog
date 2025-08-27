const request = require('supertest');
const app = require('../../app');
const db = require('../../db');

describe('Performance', () => {
  beforeEach(() => {
    db.any.mockResolvedValue([{ id: 1, title: 'Test Post' }]);
    db.one.mockResolvedValue({ count: 1 });
  });

  it('should handle multiple requests efficiently', async () => {
    const requests = Array(10).fill().map(() =>
      request(app).get('/api/v1/posts?page=1&limit=5')
    );
    
    const start = Date.now();
    await Promise.all(requests);
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(2000);
  });
});