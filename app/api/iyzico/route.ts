import { NextResponse } from "next/server"
import Iyzipay from "iyzipay"
import { db } from "@/lib/firebase"
import { collection, doc, setDoc } from "firebase/firestore"

// Initialize iyzipay client
const apiKey = process.env.IYZICO_API_KEY || "dummy-api-key"
const secretKey = process.env.IYZICO_SECRET_KEY || "dummy-secret-key"
const baseUrl = process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com"

const iyzipay = new Iyzipay({
  apiKey: apiKey,
  secretKey: secretKey,
  uri: baseUrl
})

// Promise wrapper for iyzipay checkout form create
const createIyzipayCheckout = (request: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutForm.create(request, (err: any, result: any) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

export async function POST(req: Request) {
  try {
    const { shippingInfo, items, total } = await req.json()

    // 1. Verify iyzico configuration is present
    if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY) {
      console.warn("iyzico API Key veya Secret Key eksik. Test modunda dummy-key'ler kullanılıyor.")
    }

    const orderId = `KUIS-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`

    // Detect domain dynamically from headers
    const host = req.headers.get("host") || "kuisscarf.com"
    const protocol = host.includes("localhost") ? "http" : "https"
    const callbackUrl = `${protocol}://${host}/api/iyzico/callback`

    // Extract client IP address
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1"

    // Format billing and shipping contact name
    const contactName = `${shippingInfo.firstName} ${shippingInfo.lastName}`
    const totalValStr = String(total)

    // 2. Save Draft Order to Firestore under "Pending" state
    try {
      const orderRef = doc(collection(db, "orders"), orderId)
      await setDoc(orderRef, {
        orderId,
        items,
        total,
        shippingInfo,
        status: "Pending", // Pending payment verification
        createdAt: new Date().toISOString(),
        paymentDetails: null
      })
    } catch (dbError) {
      console.error("Firestore Order Save Failed (Continuing to iyzico):", dbError)
    }

    // 3. Prepare iyzico checkout form request payload
    const basketItems = items.map((item: any, index: number) => ({
      id: item.id || `ITEM-${index}`,
      name: item.name,
      category: "Scarf",
      itemType: "PHYSICAL",
      price: String(item.price * item.quantity)
    }))

    const requestPayload = {
      locale: "tr",
      conversationId: orderId,
      price: totalValStr,
      paidPrice: totalValStr,
      currency: "TRY",
      basketId: orderId,
      paymentGroup: "PRODUCT",
      callbackUrl: callbackUrl,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: `BUYER-${Date.now()}`,
        name: shippingInfo.firstName,
        surname: shippingInfo.lastName,
        gsmNumber: shippingInfo.phone,
        email: shippingInfo.email,
        identityNumber: "11111111111", // Default TC number for billing compliance
        lastLoginDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        registrationDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        registrationAddress: shippingInfo.address,
        ip: clientIp,
        city: shippingInfo.city,
        country: "Turkey",
        zipCode: shippingInfo.postcode || "34000"
      },
      shippingAddress: {
        contactName: contactName,
        city: shippingInfo.city,
        country: "Turkey",
        address: shippingInfo.address,
        zipCode: shippingInfo.postcode || "34000"
      },
      billingAddress: {
        contactName: contactName,
        city: shippingInfo.city,
        country: "Turkey",
        address: shippingInfo.address,
        zipCode: shippingInfo.postcode || "34000"
      },
      basketItems: basketItems
    }

    // 4. Initialize iyzico checkout session
    const result = await createIyzipayCheckout(requestPayload)

    if (result.status === "success" && result.paymentPageUrl) {
      return NextResponse.json({ paymentPageUrl: result.paymentPageUrl })
    } else {
      console.error("iyzico Checkout initialization failed:", result)
      return NextResponse.json(
        { error: result.errorMessage || "iyzico ödeme oturumu başlatılamadı." },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error("iyzico Redirect Route Error:", error)
    return NextResponse.json(
      { error: error?.message || "Bir iç hata oluştu." },
      { status: 500 }
    )
  }
}
