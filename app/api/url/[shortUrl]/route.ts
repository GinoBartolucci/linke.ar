import db from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { shortUrl: string } }) {
  if (req.method === "GET") {
    const shortUrl = params.shortUrl
    try {
      const id = parseInt(shortUrl as string, 36) - 10000000000
      console.log(shortUrl)
      console.log(parseInt(shortUrl as string, 36))
      console.log(id)
      const url = await db.url.findUnique({
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