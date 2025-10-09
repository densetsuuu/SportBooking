import { RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
// import { queryClient } from "~/lib/tuyau";
// import { router } from "~/lib/router";
// import { getCurrentUserQueryOptions } from "~/lib/queries/user";
// import { useAuth } from "~/hooks/use-auth";

export function App() {
  const authContext = {
    ensureData: async () => {
      try {
        return await queryClient.ensureQueryData(getCurrentUserQueryOptions);
      } catch {
        return undefined;
      }
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProviderWithContext />
    </QueryClientProvider>
  );
}

function RouterProviderWithContext() {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth, queryClient }} />;
}