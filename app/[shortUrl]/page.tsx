import { redirect } from 'next/navigation'

export default async function ShortUrl({ params }: { params: { shortUrl: String } }) {
  const shortUrl = params.shortUrl;
  //const response = await fetch("http://localhost:3000/api/url/" + shortUrl, {
  const response = await fetch("https://linke-ar.vercel.app/api/url/" + shortUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
  const data = await response.json()
  console.log(data.originalUrl)
  redirect("https://" + data.originalUrl)
}