import { NextRequest } from "next/server";

type Context = {
  params: Promise<{ filename: string }>;
};

export async function GET(
  req: NextRequest,
  context: Context
): Promise<Response> {
  const { filename } = await context.params;

  const imageUrl = `https://api.escuelajs.co/api/v1/files/${filename}`;

  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return new Response("Imagem não encontrada", { status: 404 });
    }

    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Erro ao buscar imagem do proxy:", error);
    return new Response("Erro ao buscar imagem", { status: 500 });
  }
}
