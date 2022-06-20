import { useContext } from "react"
/**
 * Checks if the context is available and returns the value.
 *  @param context React context to check
 *  @returns The context value or throws an error if the context is not available.
 * */
function useContextCheck(context: React.Context<any>) {
    const ctx = useContext(context)
    if (ctx !== undefined) {
        return ctx
    } else {
        throw new Error("it no worke")
    }
}
export default useContextCheck