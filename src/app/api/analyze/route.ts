import { NextRequest, NextResponse } from "next/server";
import { performAnalysis, getResult, createStreamEncoder } from "@/lib";

export async function POST(request: NextRequest) {
  const { sendProgress, sendComplete } = createStreamEncoder();

  try {
    const formData = await request.formData();
    const url = formData.get("url") as string;
    const file = formData.get("file") as File;
    const apiKey = formData.get("apiKey") as string;

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Perform the analysis with real progress updates
          const results = await performAnalysis({
            url,
            file,
            apiKey,
            onProgress: (progress, step, stepKey) => {
              controller.enqueue(sendProgress(progress, step, stepKey));
            }
          });

          controller.enqueue(sendComplete(results));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Analysis failed" },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing result ID" }, { status: 400 });
  }

  const results = getResult(id);
  if (!results) {
    return NextResponse.json({ error: "Results not found" }, { status: 404 });
  }

  return NextResponse.json(results);
} 