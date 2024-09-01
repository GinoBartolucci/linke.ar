import db from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json()
    if (!data) { return new Response("No body provided", { status: 400 }) } 
    const counter = 1000000000 // se pueden generar 9.999.999.999 urls y tener un link de 6 caracteres
    const urlCreate = await db.url.create({
      data: {
        originalUrl: data.url
      }
    })
    const shortUrl = (counter + urlCreate.id).toString(36)
    const urlUpdate = await db.url.update({
      where: { id: urlCreate.id },
      data: {
        shortUrl: shortUrl
      }
    })
    return new Response(JSON.stringify(urlUpdate), {
      headers: { "Content-Type": "application/json" },
      status: 201
      }); 
  } catch (e: any) {
    return new Response(e.message, { status: 500 });
  }
}
