import { useState } from 'react'
import { toast } from 'sonner'

// We use TArgs (arguments) and TRes (response) as generic placeholders.
// TArgs extends any[] allows the callback to take zero, one, or multiple arguments.
function useFetch<TArgs extends any[], TRes>(cb: (...args: TArgs) => Promise<TRes>) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    
    // Initialize as undefined instead of {} so TypeScript knows the data might not be there yet.
    const [data, setData] = useState<TRes | null>(null)

    // fetchData now accepts whatever arguments the callback requires
    async function fetchData(...args: TArgs) {
        try {
            setLoading(true)
            setError("")
            
            // Pass the arguments directly to the callback
            const res = await cb(...args)
            console.log("Fetch response: ", res)
            setData(res)
            
            // Returning the response is a best practice so the calling component 
            // can use the result immediately without waiting for state to update.
            return res 
        } catch (error) {
            console.log("Error in custom hook: ", error)
            if (error instanceof Error) {
                setError(error.message)
                toast.error(error.message)
            } else {
                setError("An unknown error occurred")
                toast.error("An unknown error occurred")
            }
        } finally {
            setLoading(false)
        }
    }  

    return { loading, error, data,setData, fetchData }
}

export default useFetch