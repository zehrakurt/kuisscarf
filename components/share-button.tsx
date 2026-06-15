"use client"

import { Share2 } from "lucide-react"
import { toast } from "sonner"

interface ShareButtonProps {
  title: string
  excerpt: string
}

export function ShareButton({ title, excerpt }: ShareButtonProps) {
  const handleShare = () => {
    if (typeof window === "undefined") return

    if (navigator.share) {
      navigator.share({
        title: title,
        text: excerpt,
        url: window.location.href,
      }).catch((err) => console.log("Share failed:", err))
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Bağlantı kopyalandı!", {
        description: "Blog yazısının adresi panoya kaydedildi."
      })
    }
  }

  return (
    <button
      onClick={handleShare}
      className="p-1.5 rounded-full hover:bg-secondary text-foreground/70 hover:text-primary transition-colors flex items-center justify-center border-0 cursor-pointer"
      aria-label="Paylaş"
    >
      <Share2 className="h-4 w-4" />
    </button>
  )
}
