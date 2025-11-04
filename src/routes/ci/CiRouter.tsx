
import type {RouteObject} from "react-router-dom";
import {CiMainHome} from "@/page/ci/CiMainHome.tsx";

export const CiMainRouter : RouteObject[]  = [
    { path: "/ci", element: <CiMainHome /> },
    { path: "/bunyang/ci", element: <CiMainHome /> }
]