// src/app/api/cupcake/route.ts

import { NextResponse } from 'next/server';
import { Types } from 'mongoose';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongoose';
import Cupcake from '@/models/Cupcake';
import { ICupcake, ICupcakeId } from '@/models/Cupcake';

type CupCakeWithId = ICupcake & ICupcakeId

export async function PUT(request: Request) {
  await dbConnect();


  const data: Partial<CupCakeWithId> = (await request.json()) as Partial<CupCakeWithId>;
  if (!data.name || !data.description || !data.price || !Array.isArray(data.ingredients)) {
    return NextResponse.json({ error: 'Invalid cupcake data' }, { status: 400 });
  }

  try {
    if (!data.id) {
      return NextResponse.json({ error: 'Invalid ID supplied' }, { status: 400 });
    }

    const id = new Types.ObjectId(data.id as string);


    // Check if the cupcake exists before updating
    const existingCupcake = await Cupcake.findById(id);
    if (!existingCupcake) {
      return NextResponse.json({ error: 'Cupcake not found' }, { status: 404 });
    }

    const updatedCupcake = await Cupcake.findByIdAndUpdate(id, data, {
      new: true,           // Return the updated document
      runValidators: true, // Enforce schema validation
      context: 'query',    // Required for certain validators
    });

    return NextResponse.json({ message: 'Cupcake updated', cupcake: updatedCupcake }, { status: 200 });
  }
  catch (error) {
    console.error("Error handling cupcake:", error);
    // const typedError = error as Error

    // Distinguish validation error specifically
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map((err) => {
        if (err instanceof mongoose.Error.ValidatorError) {
          return err.message;
        }
        return 'Unknown validation error';
      });
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 405 });
    }

    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/*
  *****
 */
    
export async function POST(request: Request) {
  await dbConnect(); // Connect to MongoDB

  try {
    const cupCakeData: Partial<ICupcake> = (await request.json()) as Partial<ICupcake>;
    const cupcake = new Cupcake(cupCakeData);
    try {
      await cupcake.validate();
    }
    catch (error) {
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
