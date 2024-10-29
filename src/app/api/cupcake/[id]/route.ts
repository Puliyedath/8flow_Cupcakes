// src/app/api/cupcake/[id]/route.ts

import { Types } from 'mongoose';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose'; // Import your database connection helper
import Cupcake from '@/models/Cupcake'; // Import your Mongoose model

type ParamType = { id: string };
export async function DELETE(request: Request, context: { params: Promise<ParamType> }) {
  await dbConnect();
  try {
    const { id }  = await context.params;
    const cupCakeId = new Types.ObjectId(id);
    const deletedCupcake = await Cupcake.findByIdAndDelete(cupCakeId);

    if (!deletedCupcake) {
      return NextResponse.json({ error: "Cupake not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Cupcake deleted successfully", cupcake: deletedCupcake }, { status: 200 });
  } catch (error) {
    console.error("Error deleting cupcake:", error);
    return NextResponse.json({ error: "Invalid ID supplied" }, { status: 400 });
  }
}
