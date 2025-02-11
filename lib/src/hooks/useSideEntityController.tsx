import { AuthController, SideEntityController } from "../types";
import { useFireCMSContext } from "./useFireCMSContext";

/**
 * Hook to retrieve the side entity controller.
 *
 * Consider that in order to use this hook you need to have a parent
 * `FireCMS`
 *
 * @see AuthController
 * @category Hooks and utilities
 */
export function useSideEntityController(): SideEntityController {
    const context = useFireCMSContext();
    return context.sideEntityController;
}
