
import type {RouteObject} from "react-router-dom";
import {PrMainHome} from "@/page/premium/PrMainHome.tsx";

export const PrMainRouter : RouteObject[]  = [
    { path: "/pr", element: <PrMainHome /> },
    { path: "/bunyang/pr", element: <PrMainHome /> }
]