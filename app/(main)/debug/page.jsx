"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import OrgSwitcher from "@/components/org-switcher";

export default function DebugPage() {
  const { isLoaded: isOrgLoaded, membership, organization } = useOrganization();
  const { isLoaded: isUserLoaded, user } = useUser();

  if (!isOrgLoaded || !isUserLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Debug Organization Status</h1>

      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">User Info:</h2>
          <p>User ID: {user?.id}</p>
          <p>Email: {user?.emailAddresses[0]?.emailAddress}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Organization Info:</h2>
          <p>Organization Loaded: {isOrgLoaded ? "Yes" : "No"}</p>
          <p>
            Organization: {organization?.name || "No organization selected"}
          </p>
          <p>Organization ID: {organization?.id || "No ID"}</p>
          <p>Membership Role: {membership?.role || "No membership"}</p>
          <p>Is Admin: {membership?.role === "org:admin" ? "Yes" : "No"}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Organization Switcher:</h2>
          <OrgSwitcher />
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Raw Data:</h2>
          <pre className="text-xs bg-gray-100 p-2 rounded">
            {JSON.stringify(
              {
                organization,
                membership,
                isOrgLoaded,
                isUserLoaded,
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
