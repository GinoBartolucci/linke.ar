'use client'
import { useState, FormEvent, use } from "react"
import { FaGoogle, FaRegCopy } from 'react-icons/fa'
import { signIn, useSession, signOut } from 'next-auth/react'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const { data: Session } = useSession()
  console.log(Session)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(false)
    setIsLoading(true)
    setShortUrl(null)
    const formData = new FormData(event.currentTarget)
    const inputURL = formData.get("inputUrl")
    if (event.currentTarget.inputUrl.value === "" || inputURL === null) {
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
        setShortUrl("linke-ar.ginobartolucci.com.ar/" + data.shortUrl)
      }
      else {
        const data = await crearUrl.json()
        setShortUrl("linke-ar.ginobartolucci.com.ar/" + data.shortUrl)
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
      setTimeout(() => setCopied(false), 4500);
    } catch (err) {
      console.error('Error al copiar el texto: ', err);
    }
  };

  return (
    <main className="flex items-center h-full flex-col justify-center">
      <div className=" drop-shadow-lg relative z-[-1] text-7xl mb-12 sm:text-9xl lg:text-[10rem] font-protestGuerrilla">
        Linke.ar
      </div>
      {Session?.user ?
        <>
          <div className="flex flex-col justify-center items-center p-3">
            <form className="flex flex-col items-center sm:flex-row m-auto " onSubmit={handleSubmit} >
              <input className={`p-3 my-2 sm:p-4 sm:mr-2 max-h-[72px] sm:text-2xl lg:text-3xl w-full sm:w-[330px] lg:w-[500px] bounce-short rounded-2xl placeholder:italic sm:placeholder:text-xl lg:placeholder:text-2xl focus:outline-none border-2  ${error ? ' shake border-red-400 placeholder:text-red-300' : 'border-transparent'}`} type="text" name="inputUrl" placeholder="Tu URL acá" />
              <button className="p-3 my-2 sm:p-4 sm:mr-2 sm:w-[170px] font-mulish font-bold text-xl drop-shadow-lg w-full sm:text-2xl lg:text-3xl hover:bg-black text-slate-300 bg-gray-900 rounded-2xl" type="submit" disabled={isLoading}>
                {isLoading ? 'Cargando' : 'Acortar'}
              </button>
            </form>
            <div className="flex pt-2 min-h-[110px] items-center">
              <div className="flex m-auto my-0">
                <input className={`transition-opacity duration-500 p-3 mr-0 my-2 sm:p-4 max-h-[72px] drop-shadow-xl sm:text-2xl lg:text-3xl w-auto sm:w-[330px] lg:w-[500px] rounded-2xl placeholder:italic placeholder:text-xl lg:placeholder:text-2xl focus:outline-none border-2 ${copied == true ? 'text-green-600 border-green-600 text-center' : 'border-transparent'}`} type="text" value={(copied == false) ? (shortUrl == null ? "" : shortUrl) : 'Copiado!'} disabled={shortUrl == null ? true : false} placeholder="Ingrese la URL arriba" />
                <button disabled={shortUrl == null ? true : false} className="flex m-auto p-2 sm:p-5 items-center rounded max-h-[72px]" onClick={handleCopy}>
                  <FaRegCopy className={`hover:text-black text-gray-600 w-7 h-7  ${copied ? 'hover:text-green-600 text-green-600 ' : ''}`} />
                </button>
              </div>
            </div>
            {shortUrl && <p className="text-sm font-semibold">*Esta es una demo. El link seria: {shortUrl?.replace("linke-ar.ginobartolucci.com.ar/", "linke.ar/")} </p>}
          </div>
          <button onClick={() => signOut()} className="justify-self-end p-3 bg-white hover:bg-gray-100 text-lg drop-shadow-lg">
            Cerrar sesión
          </button>
        </>
        :
        <button onClick={() => signIn("google")} className="flex items-center p-3 my-2 bg-white hover:bg-gray-100 text-lg drop-shadow-lg">
          <FaGoogle className="w-6 h-6 mr-2" />
          Iniciar sesión con Google
        </button>
      }
    </main>
  );
}
