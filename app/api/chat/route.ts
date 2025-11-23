import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, systemPrompt } = body as {
      message: string;
      systemPrompt?: string;
    };

    if (!message) {
      return NextResponse.json(
        { error: "Missing message" },
        { status: 400 }
      );
    }

    // Appel à l’API OpenAI (Responses API en streaming désactivé pour faire simple)
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5.1-mini", // modèle pas cher
        input: message,
        system: systemPrompt || "Tu es une IA de compagnie bienveillante.",
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenAI error:", err);
      return NextResponse.json(
        { error: "OpenAI API error" },
        { status: 500 }
      );
    }

    const data = await response.json();

    // La réponse textuelle est dans data.output[0].content[0].text (Responses API)
    const text =
      data?.output?.[0]?.content?.[0]?.text ?? "Je ne sais pas.";

    return NextResponse.json({ reply: text });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
