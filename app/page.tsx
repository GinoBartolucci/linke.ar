'use client'
import Image from "next/image"
import { useState, FormEvent } from "react"
import { FaRegCopy } from 'react-icons/fa'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<String | null>(null)
  const [shortUrl, setShortUrl] = useState<String | null>(null)
  const [copied, setCopied] = useState(false)

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl as string);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reinicia el estado de "copiado" después de 2 segundos
    } catch (err) {
      console.error('Error al copiar el texto: ', err);
    }
  };

  return (
    <main className="flex items-center h-full flex-col justify-evenly">
      <div className="relative z-[-1] text-7xl sm:text-9xl lg:text-[10rem] font-protestGuerrilla">
        Linke.ar
      </div>
      <div className="">
        <form className="flex flex-wrap " onSubmit={handleSubmit}>
          <input className="p-3 my-2 sm:p-4 sm:mr-2 sm:text-2xl lg:text-3xl w-auto sm:w-[330px] lg:w-[500px] bounce-short rounded-2xl placeholder:italic sm:placeholder:text-xl lg:placeholder:text-2xl focus:outline-none " type="text" name="inputUrl" placeholder="Ingrese la URL a acortar" />
          <button className="p-3 my-2 sm:p-4 sm:mr-2 sm:w-[170px] font-mulish text-lg sm:text-2xl lg:text-3xl hover:bg-black text-slate-300 bg-gray-900 rounded-2xl" type="submit" disabled={isLoading}>
            {isLoading ? 'Cargando' : 'Acortar'}
          </button>
        </form>
        <div className=" flex p-2 min-h-[50px] aling-center">
          <div className="text-red-500 text-xl sm:text-3xl">{error}</div>
          {shortUrl === null ? null :
            <div className="flex items-center  space-x-2">
              <p className="sm:text-2xl lg:text-3xl">{shortUrl}</p>
              <button className="flex items-center bg-gray-200 p-2 rounded hover:bg-gray-300" onClick={handleCopy}>
                <FaRegCopy className="hover:text-black text-gray-600 w-7 h-7" />
                {copied && <span className="text-green-600 ml-2">¡Copiado!</span>}
              </button>
            </div>
          }
        </div>
      </div>
    </main>
  );
}
