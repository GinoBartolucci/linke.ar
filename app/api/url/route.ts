import db from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const data = await req.json()
    if (!data) { return new Response("No body provided", { status: 400 }) } 
    const counter = 1000000000 // se pueden generar 9.999.999.999 urls y tener un link de 6 caracteres
    const urlCreate = await db.urls.create({
      data: {
        originalUrl: data.url
      }
    })
    const shortUrl = (counter + urlCreate.id).toString(36)
    const urlUpdate = await db.urls.update({
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
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {   
        return new Response("La URL ya existe", { status: 409 })
      }
    }
    return new Response(e.message, { status: 500 });
  }
}

export async function GET(req: Request, res: Response) {
  const originalUrl = decodeURIComponent(req.url.split("?")[1].split("=")[1])
  console.log(originalUrl)
    try {
      const urlFind = await db.urls.findFirst({
        where: {
          originalUrl: originalUrl
        }
      })
      if (!urlFind) {
        return new Response ("Not found", { status: 404 })
      }
      else {
        return new Response(JSON.stringify(urlFind), {
          headers: { "Content-Type": "application/json" },
          status: 200
        });
      }
    } catch (e: any) {
      return new Response(e.message, { status: 500 });
    }
}
