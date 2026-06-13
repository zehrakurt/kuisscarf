"use client"


export function BannerSection() {
  return (
    <section className="py-12 md:py-20 w-full overflow-hidden">
      <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden flex items-center">
        {/* Background Video (Scaled to crop out the Gemini watermark in the bottom-right corner) */}
        <video
          className="absolute inset-0 w-full h-full object-cover scale-115 origin-top-left"
          playsInline
          autoPlay
          loop
          muted
        >
          <source src="/videos/video2.mp4" type="video/mp4" />
          Tarayıcınız video etiketini desteklemiyor.
        </video>
      </div>
    </section>
  )
}

