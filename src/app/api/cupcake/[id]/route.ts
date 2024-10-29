// src/app/api/cupcake/[id]/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose'; // Import your database connection helper
import Cupcake from '@/models/Cupcake'; // Import your Mongoose model

export async function DELETE(request: Request, { params }) {
  await dbConnect();
  const { id }: { id: string }  = await params;
  try {
    const deletedCupcake = await Cupcake.findByIdAndDelete(id);

    if (!deletedCupcake) {
      return NextResponse.json({ error: "Cupake not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Cupcake deleted successfully", cupcake: deletedCupcake }, { status: 200 });
  } catch (error) {
    console.error("Error deleting cupcake:", error);
    return NextResponse.json({ error: "Invalid ID supplied" }, { status: 400 });
  }
}
