import { redirect } from 'next/navigation'

export default async function ShortUrl({ params }: { params: { shortUrl: String } }) {
  const shortUrl = params.shortUrl;
  //const response = await fetch("http://localhost:3000/api/url/" + shortUrl, {
  try {

    const response = await fetch("https://linke-ar.ginobartolucci.com.ar/api/url/" + shortUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    const data = await response.json()
    console.log(data.originalUrl)
    redirect("https://" + data.originalUrl)
  }
  catch (e: any) {
    console.log(e.message)
  }
}