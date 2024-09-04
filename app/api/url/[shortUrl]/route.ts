import db from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { shortUrl: string } }) {
  if (req.method === "GET") {
    const shortUrl = params.shortUrl
    try {
      const id = parseInt(shortUrl as string, 36) - 1000000000
      const url = await db.urls.findUnique({
        where: {
          id: id
        }
      })
      if (!url) {
        return new Response ("Not found", { status: 404 })
      }
      else {
        return new Response(JSON.stringify(url), {
          headers: { "Content-Type": "application/json" },
          status: 200
        });
      }
    } catch (e: any) {
      return new Response(e.message, { status: 500 });
    }
  }
}