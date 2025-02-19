import "./Tailwind.css";

export default function Credits_Card({num,url,text})
{
    return(
            <a
              className="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
              href={url}
              target="_blank" rel="noopener noreferrer"
            >
              <h2 className="mt-4 text-xl font-bold text-black">{num}</h2>
                
              <p class="mt-1 text-sm text-black">
              {text}
              </p>
            </a>
    )
}