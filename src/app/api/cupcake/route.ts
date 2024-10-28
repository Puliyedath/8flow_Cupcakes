import clientPromise from '../../../lib/mongodb';

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "Hello from the Cupcake API!" });
}

type StringArray = Array<string>;

interface Cupcake {
  name: string,
  id: number,
  description: string,
  price: number,
  ingredients: StringArray
};

enum StatusCodes {
  OK = 200,
  OK_NEW_RESOURCE = 201,
  BadRequest = 400,
  Unauthorized,
  PaymentRequired,
  Forbidden,
  NotFound,
}

function validateCupcake(body): Cupcake {
  const cupCake: Cupcake = {...body}
  return cupCake 
}


export async function POST(req) {
  try {
    const body = await req.json()
    console.log("HPU: body = ", body)
    const cupcake: Cupcake = validateCupcake(body);
    // validate the details
    const client = await clientPromise;
    const db = client.db('cupcakestore'); // Replace with your DB name
    const result = await db.collection('cupcakes').insertOne(cupcake);
    return NextResponse.json({ _id: result.insertedId }, { status: StatusCodes.OK_NEW_RESOURCE });
    
  } catch(error: unknown) {
    console.log("cupcake_post", error);
    return NextResponse.json({ error: 'Failed to add a cupcake' }, { status: StatusCodes.BadRequest });
  }
  
}
