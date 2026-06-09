"use client"

import { useState, useEffect } from "react"
import { auth, db, storage } from "@/lib/firebase"
import { signOut, onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  setDoc, 
  query, 
  orderBy 
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ShoppingBag, 
  LayoutDashboard, 
  LogOut, 
  Package, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  User, 
  TrendingUp,
  Loader2,
  Calendar,
  CheckCircle,
  Truck,
  XCircle,
  Clock
} from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

const AVAILABLE_CATEGORIES = [
  "Yeni Gelenler",
  "İmannoor Şal",
  "Gucci Şal",
  "Dior Şal",
  "Coach Şal",
  "İndirimli Ürünler"
]

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders")
  const router = useRouter()

  // Orders State
  const [orders, setOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  // Products State
  const [productsList, setProductsList] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  
  // Product Edit/Add State
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [productImages, setProductImages] = useState<string[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [manualImageUrl, setManualImageUrl] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Yeni Gelenler"])
  const [productForm, setProductForm] = useState({
    id: "",
    name: "",
    price: "",
    originalPrice: "",
    image: "",
    additionalImages: "",
    colors: "",
    isNew: false,
    isBestseller: false,
    category: "Yeni Gelenler",
  })

  // Auth check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        setLoadingUser(false)
      } else {
        router.push("/admin/login")
      }
    })
    return () => unsubscribe()
  }, [router])

  // Load orders
  const loadOrders = async () => {
    setLoadingOrders(true)
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
      setOrders(data)
    } catch (e) {
      console.error("Failed to load orders:", e)
      toast.error("Siparişler yüklenirken hata oluştu.")
    } finally {
      setLoadingOrders(false)
    }
  }

  // Load products
  const loadProducts = async () => {
    setLoadingProducts(true)
    try {
      const querySnapshot = await getDocs(collection(db, "products"))
      const data = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
      setProductsList(data.sort((a, b) => Number(a.id) - Number(b.id)))
    } catch (e) {
      console.error("Failed to load products:", e)
      toast.error("Ürünler yüklenirken hata oluştu.")
    } finally {
      setLoadingProducts(false)
    }
  }

  // Load data on activeTab switch
  useEffect(() => {
    if (user) {
      if (activeTab === "orders") loadOrders()
      if (activeTab === "products") loadProducts()
    }
  }, [activeTab, user])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success("Oturum kapatıldı.")
      router.push("/admin/login")
    } catch (e) {
      toast.error("Çıkış yapılırken hata oluştu.")
    }
  }

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, "orders", orderId)
      await updateDoc(orderRef, { status: newStatus })
      toast.success(`Sipariş durumu "${newStatus}" olarak güncellendi.`)
      // Refresh local state
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }))
      }
    } catch (e) {
      toast.error("Sipariş durumu güncellenemedi.")
    }
  }

  // Product Form Changes
  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setProductForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  // Upload a single file to local server public directory
  const uploadSingleImage = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Sunucuya yükleme başarısız oldu.")
      }

      const data = await response.json()
      return data.url
    } catch (e: any) {
      console.error(`Local upload failed for file ${file.name}:`, e)
      toast.error(`"${file.name}" görseli yüklenirken hata oluştu: ${e.message || "Bilinmeyen hata"}`)
      return null
    }
  }

  // Handle instant image uploads on file input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploadingImage(true)
    const toastId = toast.loading("Görseller yükleniyor...")
    try {
      const uploadedUrls: string[] = []
      for (const file of files) {
        const url = await uploadSingleImage(file)
        if (url) uploadedUrls.push(url)
      }
      
      if (uploadedUrls.length > 0) {
        setProductImages(prev => [...prev, ...uploadedUrls])
        toast.success(`${uploadedUrls.length} yeni görsel başarıyla yüklendi.`, { id: toastId })
      } else {
        toast.error("Görsel yüklenemedi.", { id: toastId })
      }
    } catch (err) {
      toast.error("Görseller yüklenirken hata oluştu.", { id: toastId })
    } finally {
      setUploadingImage(false)
      // Reset input value to allow selecting same files again
      e.target.value = ""
    }
  }

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return
    try {
      await deleteDoc(doc(db, "products", id))
      toast.success("Ürün silindi.")
      setProductsList(prev => prev.filter(p => p.id !== id))
    } catch (e) {
      toast.error("Ürün silinemedi.")
    }
  }

  // Edit product trigger
  const startEditProduct = (prod: any) => {
    setEditingProduct(prod)
    setProductForm({
      id: prod.id,
      name: prod.name,
      price: String(prod.price),
      originalPrice: String(prod.originalPrice || ""),
      image: prod.image || "",
      additionalImages: "",
      colors: prod.colors ? prod.colors.join(", ") : "",
      isNew: !!prod.isNew,
      isBestseller: !!prod.isBestseller,
      category: prod.category || "Yeni Gelenler",
    })
    
    // Load categories
    if (prod.categories && Array.isArray(prod.categories)) {
      setSelectedCategories(prod.categories)
    } else if (prod.category) {
      setSelectedCategories([prod.category])
    } else {
      setSelectedCategories(["Yeni Gelenler"])
    }
    
    // Load images array from product
    if (prod.images && Array.isArray(prod.images)) {
      setProductImages(prod.images)
    } else if (prod.image) {
      setProductImages([prod.image])
    } else {
      setProductImages([])
    }
    
    setManualImageUrl("")
    
    // Scroll form into view in mobile
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Cancel edit
  const cancelEditProduct = () => {
    setEditingProduct(null)
    setProductImages([])
    setManualImageUrl("")
    setSelectedCategories(["Yeni Gelenler"])
    setProductForm({
      id: "",
      name: "",
      price: "",
      originalPrice: "",
      image: "",
      additionalImages: "",
      colors: "",
      isNew: false,
      isBestseller: false,
      category: "Yeni Gelenler",
    })
  }

  // Save / Add product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productForm.id || !productForm.name || !productForm.price) {
      toast.error("ID, İsim ve Fiyat alanları zorunludur.")
      return
    }

    if (selectedCategories.length === 0) {
      toast.error("Lütfen en az bir kategori seçin.")
      return
    }

    const toastId = toast.loading("Ürün kaydediliyor...")
    try {
      const finalImages = productImages.filter(Boolean)

      // If no images at all, use placeholder
      if (finalImages.length === 0) {
        finalImages.push("/images/placeholder.jpg")
      }

      // Parse colors string into array
      const colorsArray = productForm.colors
        ? productForm.colors.split(",").map(c => c.trim()).filter(c => c.startsWith("#"))
        : ["#E8DCC4"]

      const updatedProduct = {
        id: productForm.id,
        name: productForm.name,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : null,
        image: finalImages[0], // Main image
        images: finalImages, // Array of all images
        colors: colorsArray,
        isNew: productForm.isNew,
        isBestseller: productForm.isBestseller,
        category: selectedCategories[0] || "Yeni Gelenler",
        categories: selectedCategories,
      }

      await setDoc(doc(db, "products", productForm.id), updatedProduct)
      
      toast.success(editingProduct ? "Ürün güncellendi!" : "Yeni ürün eklendi!", { id: toastId })
      cancelEditProduct()
      loadProducts()
    } catch (e) {
      console.error("Product Save Error:", e)
      toast.error("Ürün kaydedilirken hata oluştu.", { id: toastId })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Ödendi</Badge>
      case "Shipped":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1"><Truck className="h-3 w-3" /> Kargolandı</Badge>
      case "Canceled":
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" /> İptal Edildi</Badge>
      case "Pending":
      default:
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1"><Clock className="h-3 w-3" /> Ödeme Bekliyor</Badge>
    }
  }

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-muted-foreground mt-4 text-sm">Yönetici paneli yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/10 text-foreground flex flex-col">
      {/* Header Bar */}
      <header className="bg-card border-b border-border py-4 sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold tracking-[0.15em]">KUISSCARF ADMIN</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout} 
              className="text-muted-foreground hover:text-destructive border-border"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Çıkış
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 container mx-auto px-4 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar - Left (3 Cols) */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-card border border-border rounded-xl p-4 space-y-2">
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "orders" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-foreground/75 hover:bg-secondary/40"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Sipariş Yönetimi
              {orders.filter(o => o.status === "Paid").length > 0 && (
                <span className="ml-auto bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                  {orders.filter(o => o.status === "Paid").length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "products" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-foreground/75 hover:bg-secondary/40"
              }`}
            >
              <Package className="h-4 w-4" />
              Ürün Yönetimi
            </button>
          </div>
        </aside>

        {/* Dynamic Panel Content - Right (9 Cols) */}
        <main className="lg:col-span-9 space-y-8">
          
          {/* TAB 1: ORDERS PANELS */}
          {activeTab === "orders" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Orders List */}
              <div className={`${selectedOrder ? "md:col-span-6" : "md:col-span-12"} space-y-4`}>
                <Card className="border-border bg-card shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-light tracking-wide">Son Siparişler</CardTitle>
                    <CardDescription>Müşterilerinizin verdiği güncel siparişlerin dökümü.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {loadingOrders ? (
                      <div className="text-center py-12">
                        <Loader2 className="h-6 w-6 text-primary animate-spin mx-auto" />
                        <p className="text-xs text-muted-foreground mt-2">Siparişler sorgulanıyor...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground text-sm">
                        Henüz sipariş bulunmuyor.
                      </div>
                    ) : (
                      <div className="divide-y divide-border/60">
                        {orders.map((order) => (
                          <div 
                            key={order.id} 
                            onClick={() => setSelectedOrder(order)}
                            className={`p-4 hover:bg-secondary/20 cursor-pointer transition-colors flex items-center justify-between ${
                              selectedOrder?.id === order.id ? "bg-secondary/35" : ""
                            }`}
                          >
                            <div className="space-y-1 min-w-0 pr-4">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm truncate">{order.shippingInfo.firstName} {order.shippingInfo.lastName}</span>
                                <span className="text-[10px] text-muted-foreground">• {new Date(order.createdAt).toLocaleDateString("tr-TR")}</span>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{order.id}</p>
                              <span className="text-xs font-semibold text-primary block">{order.total}₺</span>
                            </div>
                            
                            <div className="flex-shrink-0">
                              {getStatusBadge(order.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Order Detail View */}
              {selectedOrder && (
                <div className="md:col-span-6 space-y-4">
                  <Card className="border-border bg-card shadow-sm">
                    <CardHeader className="pb-4 border-b border-border flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-semibold">Sipariş Detayı</CardTitle>
                        <CardDescription className="text-xs truncate max-w-[200px]">{selectedOrder.id}</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>&times; Kapat</Button>
                    </CardHeader>
                    
                    <CardContent className="pt-6 space-y-6 text-sm">
                      {/* Customer & Address */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Müşteri & Kargo</h4>
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">{selectedOrder.shippingInfo.firstName} {selectedOrder.shippingInfo.lastName}</p>
                          <p className="text-xs text-muted-foreground">{selectedOrder.shippingInfo.email} | {selectedOrder.shippingInfo.phone}</p>
                          <p className="text-xs text-foreground bg-muted p-3 rounded-lg leading-relaxed mt-2 whitespace-pre-wrap">
                            {selectedOrder.shippingInfo.address} <br />
                            <strong>{selectedOrder.shippingInfo.city} / {selectedOrder.shippingInfo.postcode}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Status Management */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Sipariş Durumu</h4>
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            size="sm" 
                            variant={selectedOrder.status === "Paid" ? "default" : "outline"}
                            onClick={() => handleUpdateOrderStatus(selectedOrder.id, "Paid")}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs"
                          >
                            Ödendi Yap
                          </Button>
                          <Button 
                            size="sm" 
                            variant={selectedOrder.status === "Shipped" ? "default" : "outline"}
                            onClick={() => handleUpdateOrderStatus(selectedOrder.id, "Shipped")}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
                          >
                            Kargola
                          </Button>
                          <Button 
                            size="sm" 
                            variant={selectedOrder.status === "Canceled" ? "destructive" : "outline"}
                            onClick={() => handleUpdateOrderStatus(selectedOrder.id, "Canceled")}
                            className="text-xs"
                          >
                            İptal Et
                          </Button>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Sipariş İçeriği</h4>
                        <div className="space-y-3">
                          {selectedOrder.items.map((item: any) => (
                            <div key={item.id} className="flex gap-3 items-center">
                              <div className="relative h-12 w-10 bg-muted rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold truncate text-foreground">{item.name}</p>
                                <p className="text-[10px] text-muted-foreground">{item.price}₺ x {item.quantity}</p>
                              </div>
                              <div className="text-xs font-semibold text-foreground">{item.price * item.quantity}₺</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order total */}
                      <div className="flex justify-between items-center pt-4 border-t border-border/80 text-base">
                        <span className="font-semibold">Toplam Tahsilat</span>
                        <span className="font-bold text-lg text-primary">{selectedOrder.total}₺</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGER */}
          {activeTab === "products" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Product Form - Left/Top (5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                <Card className="border-border bg-card shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-light tracking-wide">
                      {editingProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
                    </CardTitle>
                    <CardDescription>
                      Mağazanıza şal veya eşarp modeli eklemek için formu doldurun.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveProduct} className="space-y-4 text-sm">
                      <div className="space-y-1.5">
                        <Label htmlFor="prod-id">Ürün ID/Kod (Benzersiz Sayı) *</Label>
                        <Input
                          id="prod-id"
                          name="id"
                          required
                          disabled={!!editingProduct}
                          value={productForm.id}
                          onChange={handleProductFormChange}
                          placeholder="Örn: 6"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label htmlFor="prod-name">Ürün Adı *</Label>
                        <Input
                          id="prod-name"
                          name="name"
                          required
                          value={productForm.name}
                          onChange={handleProductFormChange}
                          placeholder="Örn: Silk Kahve Şal"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="prod-price">Satış Fiyatı (₺) *</Label>
                          <Input
                            id="prod-price"
                            name="price"
                            type="number"
                            required
                            value={productForm.price}
                            onChange={handleProductFormChange}
                            placeholder="389"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="prod-orig-price">İndirimsiz Fiyat (₺)</Label>
                          <Input
                            id="prod-orig-price"
                            name="originalPrice"
                            type="number"
                            value={productForm.originalPrice}
                            onChange={handleProductFormChange}
                            placeholder="449"
                          />
                        </div>
                      </div>

                      {/* Product Image Selection & Upload */}
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label>Görsel Yükle (Bilgisayardan)</Label>
                          <label className="flex flex-col items-center justify-center border border-dashed border-border hover:bg-muted/40 cursor-pointer py-4 rounded-lg transition-colors">
                            <Upload className="h-5 w-5 text-muted-foreground mb-1 animate-pulse" />
                            <span className="text-xs text-muted-foreground font-semibold">Fotoğraf Seçin (Çoklu Seçim Desteklenir)</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              multiple
                              disabled={uploadingImage}
                              onChange={handleFileChange}
                              className="hidden" 
                            />
                          </label>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="prod-image-manual">Görsel Yolu Ekle (Manuel)</Label>
                          <div className="flex gap-2">
                            <Input
                              id="prod-image-manual"
                              value={manualImageUrl}
                              onChange={(e) => setManualImageUrl(e.target.value)}
                              placeholder="Örn: /images/product-1.png"
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                if (manualImageUrl.trim()) {
                                  setProductImages(prev => [...prev, manualImageUrl.trim()])
                                  setManualImageUrl("")
                                  toast.success("Görsel yolu listeye eklendi.")
                                } else {
                                  toast.error("Lütfen geçerli bir görsel yolu girin.")
                                }
                              }}
                            >
                              Ekle
                            </Button>
                          </div>
                        </div>

                        {/* Visual Images List with Delete & Reordering */}
                        {productImages.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block border-b pb-1.5">Görsel Sıralaması & Kapak Seçimi</Label>
                            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                              {productImages.map((img, idx) => (
                                <div 
                                  key={idx} 
                                  className={`relative border rounded-lg p-2 bg-card/60 flex flex-col items-center gap-2 transition-all ${
                                    idx === 0 ? "border-primary ring-1 ring-primary/40 bg-primary/5" : "border-border hover:bg-card"
                                  }`}
                                >
                                  {/* Badge */}
                                  <div className="absolute top-1.5 left-1.5 z-10">
                                    <Badge className={idx === 0 ? "bg-primary text-primary-foreground text-[9px] px-1.5 py-0" : "bg-secondary text-secondary-foreground text-[9px] px-1.5 py-0"}>
                                      {idx === 0 ? "1. KAPAK" : `${idx + 1}. Resim`}
                                    </Badge>
                                  </div>

                                  {/* Delete Button */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setProductImages(prev => prev.filter((_, i) => i !== idx))
                                      toast.success(`${idx + 1}. resim listeden çıkarıldı.`)
                                    }}
                                    className="absolute top-1.5 right-1.5 z-10 bg-destructive/90 hover:bg-destructive text-white h-5 w-5 rounded-full flex items-center justify-center text-xs shadow hover:scale-105 transition-all"
                                    title="Resmi Sil"
                                  >
                                    &times;
                                  </button>

                                  {/* Image Preview */}
                                  <div className="relative aspect-[3/4] w-full bg-muted rounded overflow-hidden mt-6 border border-border/40">
                                    <Image
                                      src={img}
                                      alt={`Görsel ${idx + 1}`}
                                      fill
                                      className="object-cover"
                                      unoptimized
                                    />
                                  </div>

                                  {/* Reordering Controls */}
                                  <div className="flex w-full gap-1 items-center justify-between mt-1">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="h-6 w-6"
                                      disabled={idx === 0}
                                      onClick={() => {
                                        setProductImages(prev => {
                                          const arr = [...prev]
                                          const temp = arr[idx]
                                          arr[idx] = arr[idx - 1]
                                          arr[idx - 1] = temp
                                          return arr
                                        })
                                      }}
                                    >
                                      &larr;
                                    </Button>

                                    {idx > 0 && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 text-[10px] px-1 text-primary hover:text-primary/80 font-semibold"
                                        onClick={() => {
                                          setProductImages(prev => {
                                            const arr = [...prev]
                                            const item = arr.splice(idx, 1)[0]
                                            arr.unshift(item)
                                            return arr
                                          })
                                          toast.success("Resim kapak görseli (1. Sıra) yapıldı.")
                                        }}
                                      >
                                        Kapak Yap
                                      </Button>
                                    )}

                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="h-6 w-6"
                                      disabled={idx === productImages.length - 1}
                                      onClick={() => {
                                        setProductImages(prev => {
                                          const arr = [...prev]
                                          const temp = arr[idx]
                                          arr[idx] = arr[idx + 1]
                                          arr[idx + 1] = temp
                                          return arr
                                        })
                                      }}
                                    >
                                      &rarr;
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Kategoriler * (Birden Fazla Seçilebilir)</Label>
                        <div className="grid grid-cols-2 gap-2 border border-border rounded-lg p-3 bg-card/60">
                          {AVAILABLE_CATEGORIES.map((cat) => {
                            const isChecked = selectedCategories.includes(cat);
                            return (
                              <label
                                key={cat}
                                className={`flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer transition-all duration-200 select-none ${
                                  isChecked 
                                    ? "border-primary bg-primary/5 text-primary font-medium" 
                                    : "border-border hover:bg-muted/40 text-foreground/80"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedCategories(prev => [...prev, cat])
                                    } else {
                                      setSelectedCategories(prev => prev.filter(c => c !== cat))
                                    }
                                  }}
                                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                                />
                                <span className="text-xs truncate">{cat}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="prod-colors">Renk Hex Kodları (Virgülle Ayrılmış)</Label>
                        <Input
                          id="prod-colors"
                          name="colors"
                          value={productForm.colors}
                          onChange={handleProductFormChange}
                          placeholder="#E8DCC4, #D2C2A4"
                        />
                      </div>

                      <div className="flex gap-6 py-2">
                        <label className="flex items-center gap-2 cursor-pointer font-medium">
                          <input
                            type="checkbox"
                            name="isNew"
                            checked={productForm.isNew}
                            onChange={handleProductFormChange}
                            className="rounded border-border"
                          />
                          Yeni Ürün (Yeni Badgesı)
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer font-medium">
                          <input
                            type="checkbox"
                            name="isBestseller"
                            checked={productForm.isBestseller}
                            onChange={handleProductFormChange}
                            className="rounded border-border"
                          />
                          Çok Satan
                        </label>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          type="submit"
                          disabled={uploadingImage}
                          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          KAYDET
                        </Button>
                        {editingProduct && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={cancelEditProduct}
                          >
                            İPTAL
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Products List - Right/Bottom (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                <Card className="border-border bg-card shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-light tracking-wide">Mevcut Ürünler ({productsList.length})</CardTitle>
                    <CardDescription>Mağazanızda yayınlanan tüm şal modelleri.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {loadingProducts ? (
                      <div className="text-center py-12">
                        <Loader2 className="h-6 w-6 text-primary animate-spin mx-auto" />
                        <p className="text-xs text-muted-foreground mt-2">Ürün listesi yükleniyor...</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border/60">
                        {productsList.map((prod) => (
                          <div key={prod.id} className="p-4 flex gap-4 items-center justify-between">
                            <div className="flex gap-3 items-center min-w-0">
                              <div className="relative h-14 w-11 bg-muted rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src={prod.image}
                                  alt={prod.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0 space-y-1">
                                <span className="font-semibold text-sm block truncate pr-4 text-foreground">{prod.name}</span>
                                <div className="flex flex-wrap gap-1.5 items-center">
                                  <span className="text-xs text-muted-foreground">ID: {prod.id}</span>
                                  {prod.categories && Array.isArray(prod.categories) ? (
                                    prod.categories.map((c: string) => (
                                      <span key={c} className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded font-medium">{c}</span>
                                    ))
                                  ) : (
                                    <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded font-medium">{prod.category || "Yeni Gelenler"}</span>
                                  )}
                                </div>
                                <span className="text-xs font-semibold text-primary block">{prod.price}₺</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8 text-foreground/70 hover:text-primary"
                                onClick={() => startEditProduct(prod)}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8 text-destructive hover:bg-destructive/10 border-destructive/20"
                                onClick={() => handleDeleteProduct(prod.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  )
}
