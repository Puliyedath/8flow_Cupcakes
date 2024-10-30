// src/app/api/cupcake/route.ts

import { NextResponse } from 'next/server';
import { Types } from 'mongoose';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongoose';
import Cupcake from '@/models/Cupcake';
import validateCupcakeData from '@/utils/model_validation';
import { ICupcake, ICupcakeId } from '@/models/Cupcake';

type CupCakeWithId = ICupcake & ICupcakeId

export async function PUT(request: Request) {
  await dbConnect();

  try {
    const data: Partial<CupCakeWithId> = (await request.json()) as Partial<CupCakeWithId>;
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
    // Distinguish validation error specifically
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = validateCupcakeData(error)
      if (errors.length !== 0) {
        return NextResponse.json({ error: 'Validation exception', details: errors }, { status: 405 });
      }
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
    await cupcake.validate();
    const savedCupcake: ICupcake = await cupcake.save();

    // Return the created cupcake
    return NextResponse.json(savedCupcake, { status: 201 });
  } catch (error) {
    console.error("Error creating cupcake:", error);
    // Distinguish validation error specifically
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = validateCupcakeData(error)
      if (errors.length !== 0) {
        return NextResponse.json({ error: 'Invalid Input', details: errors }, { status: 405 });
      }
    }

  }
  return NextResponse.json({ error: 'Error creating cupcake' }, { status: 500 });
}

// this is going to be paginated GET with the
// use of aggregation framework
type Json = boolean | number | string | null | { [key: string]: Json } | Array<Json>;
export async function GET() {
  await dbConnect(); // Connect to MongoDB

  try {
    // aggregation pipeline to reduce the calls/ cost to the DB,
    // even though the spec doesn't mandate it
    const page = 1
    const limit = 3
    const cupcakes = await Cupcake.aggregate([
      {
        $facet: {
          metadata: [{ $count: 'totalCount'}],
          data: [{ $skip: (page - 1 ) * limit  }, { $limit: limit }]
        }
      }
    ])
    const { data } = cupcakes[0] as { data: Json };
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error getting cupcake:", error);
    return NextResponse.json({ error: "Error retrieving cupcakes" }, { status: 400 });
  }
}

