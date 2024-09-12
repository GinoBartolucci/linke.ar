'use client'
import Image from "next/image"
import { encode } from "punycode"
import { useState, FormEvent } from "react"
import { FaRegCopy } from 'react-icons/fa'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocolo opcional
    '((([a-zA-Z0-9$-_@.&+!*"(),]|[0-9a-zA-Z])+)' + // dominio
    ')?(\\.[a-zA-Z]{2,})+' + // dominio de nivel superior
    '(\\/([a-zA-Z0-9$-_@.&+!*"(),]|[0-9a-zA-Z])+)*$' // ruta opcional
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(false)
    setIsLoading(true)
    setShortUrl(null)
    const formData = new FormData(event.currentTarget)
    const inputURL = formData.get("inputUrl")
    if (event.currentTarget.inputUrl.value === "" || inputURL === null || urlPattern.test(inputURL.toString())) {
      setError(true)
      setTimeout(() => setError(false), 500)
      setIsLoading(false)
      return
    }
    try {
      const urlComoParametro = inputURL?.toString().replace(/^https?:\/\//, "").replace(/\/$/, "")
      console.log("front" + urlComoParametro)
      const crearUrl = await fetch("/api/url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: urlComoParametro
        })
      })
      if (crearUrl.status === 409) {
        console.log(urlComoParametro)
        const encontrarUrl = await fetch("/api/url?originalUrl=" + encodeURIComponent(urlComoParametro), {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        })
        const data = await encontrarUrl.json()
        setShortUrl("linke-ar.vercel.app/" + data.shortUrl)
      }
      else {
        const data = await crearUrl.json()
        setShortUrl("linke-ar.vercel.app/" + data.shortUrl)
      }
    }
    catch (e: any) {
      setError(true)
      setTimeout(() => setError(false), 500)
      console.log(e.message);
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl as string);
      setCopied(true);
      setTimeout(() => setCopied(false), 4500); // Reinicia el estado de "copiado" después de 2 segundos
    } catch (err) {
      console.error('Error al copiar el texto: ', err);
    }
  };

  return (
    <main className="flex items-center h-svh flex-col justify-center">
      <div className=" drop-shadow-lg relative z-[-1] text-7xl mb-12 sm:text-9xl lg:text-[10rem] font-protestGuerrilla">
        Linke.ar
      </div>
      <div className="flex flex-col items-center w-full p-3">
        <form className="flex flex-col items-center sm:flex-row m-auto " onSubmit={handleSubmit}>
          <input className={`p-3 my-2 sm:p-4 sm:mr-2 max-h-[72px] sm:text-2xl lg:text-3xl w-auto sm:w-[330px] lg:w-[500px] bounce-short rounded-2xl placeholder:italic sm:placeholder:text-xl lg:placeholder:text-2xl focus:outline-none ${error ? ' shake border-2 border-red-400 placeholder:text-red-300' : 'border-gray-300'}`} type="text" name="inputUrl" placeholder="Tu URL acá" />
          <button className="p-3 my-2 sm:p-4 sm:mr-2 sm:w-[170px] font-mulish font-bold text-xl drop-shadow-lg  sm:text-2xl lg:text-3xl hover:bg-black text-slate-300 bg-gray-900 rounded-2xl" type="submit" disabled={isLoading}>
            {isLoading ? 'Cargando' : 'Acortar'}
          </button>
        </form>
        <div className="flex p-2 min-h-[110px] items-center">
          <div className="flex m-auto">
            <input className={`transition-opacity duration-500 p-3 mr-0 my-2 sm:p-4 max-h-[72px] drop-shadow-xl sm:text-2xl lg:text-3xl w-auto sm:w-[330px] lg:w-[500px] rounded-2xl placeholder:italic placeholder:text-xl lg:placeholder:text-2xl focus:outline-none ${copied == true ? 'text-green-600 border-2 border-green-600 text-center' : ''}`} type="text" value={(copied == false) ? (shortUrl == null ? "" : shortUrl) : 'Copiado!'} disabled={shortUrl == null ? true : false} placeholder="Ingrese la URL arriba" />
            <button disabled={shortUrl == null ? true : false} className="flex m-auto p-2 sm:p-5 items-center rounded max-h-[72px]" onClick={handleCopy}>
              <FaRegCopy className={`hover:text-black text-gray-600 w-7 h-7  ${copied ? 'hover:text-green-600 text-green-600 ' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
