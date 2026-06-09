"use client"

import Link from "next/link"

export function ProductVideoBanner() {
  return (
    <section className="relative w-full overflow-hidden">
      <Link 
        href="https://www.imannoor.com/naia-bej-jakar-sal" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="block w-full overflow-hidden"
      >
        <video
          className="w-full h-auto block scale-[1.08] origin-top"
          width="100%"
          height="100%"
          playsInline
          autoPlay
          loop
          muted
        >
          <source src="/videos/video.mp4" type="video/mp4" />
          Tarayıcınız video etiketini desteklemiyor.
        </video>
      </Link>
    </section>
  )
}
