
import { DELETE } from "../src/app/api/cupcake/[id]/route";
import { Types } from 'mongoose';
import Cupcake from '@/models/Cupcake';

jest.mock('@/lib/mongoose', () => ({
  __esModule: true, // this property makes it work correctly with ES6 modules
  default: jest.fn(() => Promise.resolve({ connection: { readyState: 1 } })),
}));

// // Mock the Mongoose model method
jest.mock('@/models/Cupcake', () => ({
  __esModule: true, // required for ES6 module compatibility
  default: {
    findByIdAndDelete: jest.fn(), // mock findByIdAndDelete
    validate: jest.fn(),
    save: jest.fn()
  },
}));


describe('/cupcake/[id] DELETE API', () => {

  beforeEach(() => {
    jest.clearAllMocks(); // Clear any mocks before each test
  });

  test('delete a cupcake with an valid id', async () => {
    const cupCakeId = "67215c982f06a3cb5ca8b066";
    (Cupcake.findByIdAndDelete as jest.Mock).mockResolvedValueOnce({ _id: cupCakeId, name: 'vanilla', price: 10 });
    
    const request = new Request('http://localhost/api/cupcake/123', { method: 'DELETE' });
    const context = { params: Promise.resolve({ id: cupCakeId }) };
    const response = await DELETE(request, context);
    expect(response.status).toBe(200);
    expect(Cupcake.findByIdAndDelete).toHaveBeenCalledWith(new Types.ObjectId(cupCakeId));
    const responseBody = await response.json();
    expect(responseBody.message).toEqual(`Cupcake deleted successfully`);
  });
  
  test('delete a cupcake with an valid id', async () => {
    const cupCakeId = "67215c982f06a3cb5ca8b066";
    (Cupcake.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(undefined);
    
    const request = new Request(`http://localhost/api/v2/cupcake/${cupCakeId}`, { method: 'DELETE' });
    const context = { params: Promise.resolve({ id: cupCakeId }) };
    const response = await DELETE(request, context);
    expect(response.status).toBe(404);
    const responseBody = await response.json();
    expect(responseBody.error).toEqual(`Cupcake not found`);
  });
});
