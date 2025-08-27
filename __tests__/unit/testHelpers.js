const mockRequest = (body = {}, params = {}, query = {}, user = {}) => ({
  body,
  params,
  query,
  user: { id: 1, username: 'testuser', ...user }
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

module.exports = { mockRequest, mockResponse };