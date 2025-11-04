// src/hooks/useScrollToHash.ts
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/** 해시(#overview 등)를 보고 해당 id 요소로 스무스 스크롤합니다. */
export function useScrollToHash(offsetPx = 0) {
    const { hash } = useLocation()

    useEffect(() => {
        if (!hash) return
        const id = hash.slice(1)
        const el = document.getElementById(id)
        if (!el) return
        const top = el.getBoundingClientRect().top + window.scrollY - offsetPx - 12
        window.scrollTo({ top, behavior: "smooth" })
    }, [hash, offsetPx])
}
