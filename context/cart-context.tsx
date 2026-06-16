"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  slug?: string
  variant?: string
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeFromCart: (id: string, variant?: string) => void
  updateQuantity: (id: string, quantity: number, variant?: string) => void
  clearCart: () => void
  cartCount: number
  cartTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isMounted, setIsMounted] = useState(false)

  // Load cart items from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("kuisscarf_cart")
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to parse cart items from localStorage", e)
      }
    }
    setIsMounted(true)
  }, [])

  // Save cart items to localStorage on change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("kuisscarf_cart", JSON.stringify(cartItems))
    }
  }, [cartItems, isMounted])

  const addToCart = (newItem: Omit<CartItem, "quantity">, qty = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === newItem.id && item.variant === newItem.variant
      )
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === newItem.id && item.variant === newItem.variant
            ? { ...item, quantity: item.quantity + qty }
            : item
        )
      }
      return [...prevItems, { ...newItem, quantity: qty }]
    })
  }

  const removeFromCart = (id: string, variant?: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.variant === variant))
    )
  }

  const updateQuantity = (id: string, quantity: number, variant?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, variant)
      return
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.variant === variant ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
