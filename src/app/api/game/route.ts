import { NextResponse } from "next/server";

export function GET(): NextResponse {
  return NextResponse.json(
    {
      message: "Hello from game apis ",
    },
    { status: 200 }
  );
}
