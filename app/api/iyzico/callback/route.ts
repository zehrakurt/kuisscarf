import { NextResponse } from "next/server"
import Iyzipay from "iyzipay"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"

// Initialize iyzipay client
const apiKey = process.env.IYZICO_API_KEY || "dummy-api-key"
const secretKey = process.env.IYZICO_SECRET_KEY || "dummy-secret-key"
const baseUrl = process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com"

const iyzipay = new Iyzipay({
  apiKey: apiKey,
  secretKey: secretKey,
  uri: baseUrl
})

// Promise wrapper for retrieving checkout form results
const retrieveIyzipayResult = (request: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutForm.retrieve(request, (err: any, result: any) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

export async function POST(req: Request) {
  let orderId = ""
  try {
    // iyzico sends the token via a URL-encoded POST body
    const formData = await req.formData()
    const token = (formData.get("token") as string) || ""

    if (!token) {
      console.error("[iyzico Callback] Missing checkout token in request body.")
      return new Response("Missing token", { status: 400 })
    }

    // 1. Retrieve checkout results from iyzico API using the token
    const result = await retrieveIyzipayResult({
      locale: "tr",
      token: token
    })

    // conversationId is set to the orderId during initialization
    orderId = result.conversationId || ""

    if (!orderId) {
      console.error("[iyzico Callback] Missing conversationId in retrieve response.")
      return new Response("Missing order ID", { status: 400 })
    }

    const isSuccess = result.paymentStatus === "SUCCESS"
    
    // 2. Update Firestore Order details
    try {
      const orderRef = doc(db, "orders", orderId)
      const orderSnap = await getDoc(orderRef)

      if (orderSnap.exists()) {
        await updateDoc(orderRef, {
          status: isSuccess ? "Paid" : "Failed",
          paymentDetails: {
            paymentId: result.paymentId,
            installment: result.installment || 1,
            cardType: result.cardType || null,
            cardAssociation: result.cardAssociation || null,
            cardFamily: result.cardFamily || null,
            updatedAt: new Date().toISOString()
          }
        })
        console.log(`[iyzico Webhook] Order ${orderId} successfully updated to status: ${isSuccess ? "Paid" : "Failed"}`)
      } else {
        console.warn(`[iyzico Webhook] Order ${orderId} does not exist in Firestore.`)
      }
    } catch (dbError) {
      console.error("[iyzico Webhook] Failed to update order in Firestore:", dbError)
    }

    // 3. Redirect user's browser back to success/failed views
    const baseUrlOrigin = new URL(req.url).origin
    if (isSuccess) {
      return NextResponse.redirect(`${baseUrlOrigin}/order/success?id=${orderId}`, 303)
    } else {
      return NextResponse.redirect(`${baseUrlOrigin}/order/failed?id=${orderId}`, 303)
    }

  } catch (error: any) {
    console.error("iyzico Webhook Callback Error:", error)
    const baseUrlOrigin = new URL(req.url).origin
    return NextResponse.redirect(`${baseUrlOrigin}/order/failed?id=${orderId || "unknown"}`, 303)
  }
}
