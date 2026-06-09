"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface FavoriteItem {
  id: string
  name: string
  price: number
  image: string
}

interface FavoritesContextType {
  favorites: FavoriteItem[]
  toggleFavorite: (item: FavoriteItem) => void
  isFavorited: (id: string) => boolean
  removeFromFavorites: (id: string) => void
  clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [isMounted, setIsMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("kuisscarf_favorites")
    if (saved) {
      try {
        setFavorites(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse favorites from localStorage", e)
      }
    }
    setIsMounted(true)
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("kuisscarf_favorites", JSON.stringify(favorites))
    }
  }, [favorites, isMounted])

  const toggleFavorite = (item: FavoriteItem) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === item.id)
      if (exists) {
        return prev.filter((fav) => fav.id !== item.id)
      }
      return [...prev, item]
    })
  }

  const isFavorited = (id: string) => {
    return favorites.some((fav) => fav.id === id)
  }

  const removeFromFavorites = (id: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id))
  }

  const clearFavorites = () => {
    setFavorites([])
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorited,
        removeFromFavorites,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
