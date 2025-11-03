
import type {RouteObject} from "react-router-dom";
import {MainHome} from "@/page/main/MainHome.tsx";

export const MainRouter : RouteObject[]  = [
    { path: "/", element: <MainHome /> },
    { path: "/bunyang", element: <MainHome /> }
]