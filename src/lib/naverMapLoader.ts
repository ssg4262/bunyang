// src/lib/naverMapLoader.ts
let cached: Promise<typeof window.naver> | null = null;

declare global {
    interface Window { naver: any }
}

export const loadNaverMap = (clientId: string) => {
    if (cached) return cached;
    cached = new Promise<typeof window.naver>((resolve, reject) => {
        if (window.naver?.maps) return resolve(window.naver);
        const script = document.createElement("script");
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}&submodules=geocoder`;
        script.async = true;
        script.onload = () => resolve(window.naver);
        script.onerror = (e) => reject(e);
        document.head.appendChild(script);
    });
    return cached;
};
