import {RouterProvider} from "@tanstack/react-router";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "~/lib/tuyau";
import {useAuth} from "~/hooks/use-auth";
import {router} from "~/lib/router";

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProviderWithContext/>
        </QueryClientProvider>
    );
}

function RouterProviderWithContext() {
    const auth = useAuth();

    return <RouterProvider router={router} context={{auth, queryClient}}/>;
}