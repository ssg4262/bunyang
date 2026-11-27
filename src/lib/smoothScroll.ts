// src/lib/smoothScroll.ts
// 섹션으로 부드럽게 이동.
// - 브라우저 기본 smooth 스크롤은 도중에 이미지가 늦게 펼쳐지면 끊기거나 엉뚱한 곳에 멈춤
// - 그래서 직접 프레임마다 움직이고, 매 프레임 목적지를 다시 계산해서
//   이미지 때문에 위치가 밀려도 끊김 없이 정확히 도착하게 함
// - 사용자가 직접 스크롤/터치하면 즉시 멈춤

let cancelCurrent: (() => void) | null = null

export function scrollToElement(el: HTMLElement | null, offset = 76, duration = 900) {
    if (!el) return
    cancelCurrent?.()

    const target = () => Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset)

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
        window.scrollTo(0, target())
        return
    }

    const start = window.scrollY
    const t0 = performance.now()
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
    let raf = 0
    let done = false

    const stop = () => {
        if (done) return
        done = true
        cancelAnimationFrame(raf)
        window.removeEventListener("wheel", stop)
        window.removeEventListener("touchstart", stop)
        window.removeEventListener("keydown", stop)
        if (cancelCurrent === stop) cancelCurrent = null
    }
    cancelCurrent = stop
    window.addEventListener("wheel", stop, { passive: true })
    window.addEventListener("touchstart", stop, { passive: true })
    window.addEventListener("keydown", stop)

    const step = (now: number) => {
        if (done) return
        const t = Math.min(1, (now - t0) / duration)
        const y = start + (target() - start) * ease(t)
        window.scrollTo(0, y)
        if (t < 1) {
            raf = requestAnimationFrame(step)
        } else {
            // 도착 직후 늦게 펼쳐진 이미지 때문에 어긋났으면 마지막으로 한 번 더 맞춤
            window.setTimeout(() => {
                if (!done) window.scrollTo(0, target())
                stop()
            }, 250)
        }
    }
    raf = requestAnimationFrame(step)
}
