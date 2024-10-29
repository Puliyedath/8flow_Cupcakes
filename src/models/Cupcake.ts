import mongoose, { Schema, Document, model, Model } from 'mongoose';

// Define the TypeScript interface for a Cupcake document
export interface ICupcake extends Document {
  name: string;
  description: string;
  price: number;
  ingredients: string[];
}

// Define the Cupcake schema with validation
const CupcakeSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 characters long"],
    maxlength: [50, "Name cannot exceed 50 characters"],
  },
  description: { type: String, required: false },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [1, "Price must be at least 1$"],
    max: [20, "Price cannot exceed 20$"],
  },
  ingredients: {
    type: [String],
    required: [true, "Ingredients are required"],
    validate: {
      validator: function(value: string[]) {
        return value.length > 0;
      },
      message: "At least one ingredient is required",
    },
  },
});

// Avoid model re-compilation in Next.js
const Cupcake: Model<ICupcake> = mongoose.models.Cupcake || model<ICupcake>("Cupcake", CupcakeSchema);

export default Cupcake;

