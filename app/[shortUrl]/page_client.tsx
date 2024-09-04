'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ShortUrl({ params }: { params: { shortUrl: String } }) {
  const [error, setError] = useState<String | null>(null)
  const router = useRouter();
  const shortUrl = params.shortUrl;

  async function redirect() {
    try {
      const response = await fetch("/api/url/" + shortUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await response.json()
      router.push(data.originalUrl);
    } catch (e: any) {
      setError('Ups. Ocurrio un erro al intentar redireccionar la URL')
      console.log(e.message);
    }
  }

  // useEffect(() => {
  //   redirect();
  // }, []);
  return (
    <div>
      <h1>Redireccionando...</h1>
      {error && <p>{error}</p>}
    </div>
  );
}