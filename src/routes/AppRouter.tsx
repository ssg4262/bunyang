import {MainRouter} from "@/routes/main/MainRouter.tsx"
import {CiMainRouter} from "@/routes/ci/CiRouter.tsx";
import {PrMainRouter} from "@/routes/pr/PrRouter.tsx";
export const AppRouter = [
    ...MainRouter,
    ...CiMainRouter,
    ...PrMainRouter

];