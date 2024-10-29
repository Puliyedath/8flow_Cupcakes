// src/app/api/cupcake/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Cupcake from '@/models/Cupcake';
import { ICupcake } from '@/models/Cupcake';

export async function POST(request: Request) {
  await dbConnect(); // Connect to MongoDB

  try {
    const data = await request.json(); // Parse request body
    const { name, description, price, ingredients }: { 
      name: string; 
      description: string; 
      price: number; 
      ingredients: string[]; 
    } = data;

    if (!name || !description || !price || !Array.isArray(ingredients)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    const cupcake = new Cupcake({ name, description, price, ingredients });
    try {
      await cupcake.validate();
    }
    catch(error) {
      const typedError = error as Error;
      console.error("Error creating cupcake:", error);
      return NextResponse.json({ error: `${typedError.message}` }, { status: 405 });
    }
    
    const savedCupcake: ICupcake = await cupcake.save();

    // Return the created cupcake
    return NextResponse.json(savedCupcake, { status: 201 });
  } catch (error) {
    console.error("Error creating cupcake:", error);
    return NextResponse.json({ error: 'Error creating cupcake' }, { status: 500 });
  }
}
