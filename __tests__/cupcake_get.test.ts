import { GET } from "../src/app/api/cupcake/route";

jest.mock('@/lib/mongoose', () => ({
  __esModule: true, // this property makes it work correctly with ES6 modules
  default: jest.fn(() => Promise.resolve({ connection: { readyState: 1 } })),
}));

jest.mock('@/models/Cupcake', () => ({
  __esModule: true, // required for ES6 module compatibility
  default: {
    aggregate:jest.fn().mockResolvedValue([
      {
        data: [
          {
            "name": "test",
            "price": 10,
            _id: 123
          }
        ]
      }
    ])
  },
}));

describe('/cupcake GET API', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any mocks before each test
  });

  test("returns a list of cupcakes", async () => {
    const response = await GET();
    const responseBody = await response.json()
    expect(responseBody).toEqual([
      {
        "name": "test",
        "price": 10,
        _id: 123
      }
    ])
    expect(response.status).toBe(200);
  });

});
