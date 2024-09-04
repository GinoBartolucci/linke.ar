'use client'
import Image from "next/image";
import Head from "next/head";
import { useState, FormEvent } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<String | null>(null)
  const [shortUrl, setShortUrl] = useState<String | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null)
    setIsLoading(true)
    setShortUrl(null)
    const formData = new FormData(event.currentTarget)
    const inputURL = formData.get("inputUrl")
    if (event.currentTarget.inputUrl.value === "" || inputURL === null) {
      setError('Debe ingresar una URL')
      setIsLoading(false)
      return
    }
    try {
      const crearUrl = await fetch("/api/url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: inputURL?.toString()
        })
      })
      if (crearUrl.status === 409) {
        const encontrarUrl = await fetch("/api/url?originalUrl=" + inputURL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        })
        const data = await encontrarUrl.json()
        setShortUrl("https://linke-ar.vercel.app/" + data.shortUrl)
      }
      else {
        const data = await crearUrl.json()
        setShortUrl("https://linke-ar.vercel.app/" + data.shortUrl)
      }
    }
    catch (e: any) {
      setError('Ups. Ocurrio un erro al intentar acortar la URL')
      console.log(e.message);
    }
    finally {
      setIsLoading(false)
    }
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
      </div>
      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
      <div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <form className="" onSubmit={handleSubmit}>
          <input type="text" name="inputUrl" placeholder="URL" />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Acortar'}
          </button>
        </form>
        {shortUrl === null ? null : <div>{shortUrl}</div>}

      </div>
      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Docs{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Find in-depth information about Next.js features and API.
          </p>
        </a>
      </div>
    </main>
  );
}
