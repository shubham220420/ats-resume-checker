const request = require('supertest');
const app = require('../index');

describe('ATS Resume Checker API', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/upload/supported-formats', () => {
    it('should return supported file formats', async () => {
      const response = await request(app).get('/api/upload/supported-formats');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('supportedFormats');
      expect(Array.isArray(response.body.supportedFormats)).toBe(true);
    });
  });

  describe('POST /api/analyze', () => {
    it('should require resume text and job description', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate minimum text length', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({
          resumeText: 'short',
          jobDescription: 'also short'
        });
      
      expect(response.status).toBe(400);
    });
  });
}); 