import { POST } from "../src/app/api/cupcake/route";
import mongoose from 'mongoose';
import { ICupcake } from '@/models/Cupcake';

jest.mock('@/lib/mongoose', () => ({
  __esModule: true, // this property makes it work correctly with ES6 modules
  default: jest.fn(() => Promise.resolve({ connection: { readyState: 1 } })),
}));

const mockData = { name: 'vanilla', price: 10 };
const mockCupCakeModule = {
  __esModule: true,
  findByIdAndDelete: jest.fn(), // mock findByIdAndDelete
  validate: jest.fn().mockResolvedValue(true),
  save: jest.fn().mockResolvedValue(mockData),
}

jest.mock('@/models/Cupcake', () => {
  return jest.fn().mockImplementation(() => mockCupCakeModule)
});




describe('/cupcake POST API', () => {
  

  beforeEach(() => {
    jest.clearAllMocks(); // Clear any mocks before each test
  });

  test("add a cupcake with a valid name and price", async () => {
    const mockCupcakeData: Partial<ICupcake> = mockData;
    const request = {
      json: jest.fn().mockResolvedValue(mockCupcakeData),
    } as unknown as Request;
    const response = await POST(request);
    expect(response.status).toBe(201);
  });

  test("add a cupcake with empty name", async () => {
    mockCupCakeModule.save.mockImplementationOnce(() => {
      const validationError = new mongoose.Error.ValidationError();
      validationError.errors = {
        name: new mongoose.Error.ValidatorError({ message: 'name is required' }),
      };
      throw validationError;
    })
    const mockCupcakeData: Partial<ICupcake> = { price: 10 }
    const request = {
      json: jest.fn().mockResolvedValue(mockCupcakeData),
    } as unknown as Request;
    const response = await POST(request);
    expect(response.status).toBe(405);
  });

  test("adding a cupcake with empty price", async () => {
    mockCupCakeModule.save.mockImplementationOnce(() => {
      const validationError = new mongoose.Error.ValidationError();
      validationError.errors = {
        price: new mongoose.Error.ValidatorError({ message: 'Price is required' }),
      };
      throw validationError;
    })
    const mockCupcakeData: Partial<ICupcake> = { name: "test" }
    const request = {
      json: jest.fn().mockResolvedValue(mockCupcakeData),
    } as unknown as Request;
    const response = await POST(request);
    expect(response.status).toBe(405);
  });
});
