import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  // 做同步處理，例如建立 user、回傳成功訊息等
  return NextResponse.json(body);
}