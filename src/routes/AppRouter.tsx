import {MainRouter} from "@/routes/main/MainRouter.tsx"
import {CiMainRouter} from "@/routes/ci/CiRouter.tsx";
export const AppRouter = [
    ...MainRouter,
    ...CiMainRouter
];