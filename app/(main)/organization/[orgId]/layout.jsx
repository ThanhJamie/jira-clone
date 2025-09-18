"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useOrganizationList, useAuth } from "@clerk/nextjs";

export default function OrgActivatorLayout({ children }) {
  const { orgId } = useParams();
  const { isLoaded, organizationList, setActive } = useOrganizationList();
  const auth = useAuth();
  const tried = useRef(false);

  useEffect(() => {
    if (!isLoaded || !auth.isLoaded || tried.current) return;

    const orgs = organizationList?.data ?? [];
    
    // Try to find org by slug first
    const matchBySlug = orgs.find((o) => o.organization.slug === orgId)?.organization;
    
    // If no match by slug, try by ID (in case orgId is actual ID)
    const matchById = orgs.find((o) => o.organization.id === orgId)?.organization;
    
    const match = matchBySlug || matchById;
    
    if (!match) {
      // Check if we have org in session claims
      const orgFromSession = auth.sessionClaims?.o;
      if (orgFromSession && (orgFromSession.slg === orgId || orgFromSession.id === orgId)) {
        tried.current = true;
        setActive({ organization: orgFromSession.id }).catch(console.error);
        return;
      }
      return;
    }

    // If we found a match but it's not active, activate it
    if (!auth.orgId || auth.orgId !== match.id) {
      tried.current = true;
      setActive({ organization: match.id }).catch(console.error);
    }

  }, [isLoaded, auth.isLoaded, auth.orgId, auth.sessionClaims, orgId, organizationList, setActive]);

  return <>{children}</>;
}
