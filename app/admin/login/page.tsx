"use client"

import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/api"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LockKeyhole, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (token) {
      apiFetch("/auth/me")
        .then((user) => {
          if (user && user.role === "ADMIN") {
            router.push("/admin")
          } else {
            localStorage.removeItem("adminToken")
            setCheckingAuth(false)
          }
        })
        .catch(() => {
          localStorage.removeItem("adminToken")
          setCheckingAuth(false)
        })
    } else {
      setCheckingAuth(false)
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error("Lütfen e-posta ve şifrenizi girin.")
      return
    }

    setLoading(true)
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
      if (data.user && data.user.role === "ADMIN") {
        localStorage.setItem("adminToken", data.access_token)
        toast.success("Giriş başarılı! Yönlendiriliyorsunuz...")
        router.push("/admin")
      } else {
        toast.error("Bu panele yetkiniz bulunmamaktadır.")
        setLoading(false)
      }
    } catch (error: any) {
      console.error("Login Error:", error)
      toast.error(error.message || "Giriş başarısız. Bilgilerinizi kontrol edin.")
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-muted-foreground mt-4 text-sm">Oturum durumu kontrol ediliyor...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-border bg-card shadow-sm">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <LockKeyhole className="h-6 w-6 stroke-[1.5]" />
          </div>
          <CardTitle className="text-2xl font-light tracking-wide">Yönetici Girişi</CardTitle>
          <CardDescription>
            Kuisscarf yönetim paneline erişmek için bilgilerinizi girin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-5 mt-2 font-medium tracking-wide"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Giriş Yapılıyor...
                </>
              ) : (
                "GİRİŞ YAP"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
