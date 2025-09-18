"use client";

import {
  OrganizationList,
  useOrganization,
  useOrganizationList,
  useAuth,
} from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function OnboardingPage() {
  const router = useRouter();
  const search = useSearchParams();
  const auth = useAuth();

  const { isLoaded: orgLoaded, organization } = useOrganization();

  const {
    isLoaded: listLoaded,
    organizationList,
    setActive,
  } = useOrganizationList();

  const hasTriedAutoSelect = useRef(false);

  // Check if organization should be activated
  useEffect(() => {
    if (!orgLoaded || !listLoaded || !auth.isLoaded) {
      return;
    }

    // Check if we have org in session claims but not activated
    const orgFromSession = auth.sessionClaims?.o;
    
    if (orgFromSession && !auth.orgId) {
      setActive({ organization: orgFromSession.id })
        .then(() => {
          setTimeout(() => {
            if (orgFromSession.slg) {
              window.location.href = `/organization/${orgFromSession.slg}`;
            }
          }, 1000);
        })
        .catch((error) => {
          console.error("Failed to activate org from session:", error);
        });
      return;
    }

    // If we have organization but no orgId in auth, try to activate
    if (organization && !auth.orgId) {
      setActive({ organization: organization.id }).catch((error) => {
        console.error("Failed to re-activate organization:", error);
      });
    }

  }, [orgLoaded, listLoaded, auth.isLoaded, organization, auth.orgId, auth.sessionClaims, setActive]);

  // Redirect if user already has an active organization
  useEffect(() => {
    // Only auto-redirect if user just created/selected an org (has post param)
    // Otherwise, let them stay on onboarding to switch organizations
    const post = search?.get("post");
    
    if (!orgLoaded || !auth.isLoaded) {
      return;
    }

    // Only redirect if user just performed an action (created/selected)
    if ((post === "created" || post === "selected") && organization?.slug) {
      setTimeout(() => {
        window.location.href = `/organization/${organization.slug}`;
      }, 1000);
    }
  }, [orgLoaded, auth.isLoaded, organization, search]);

  // Auto-select organization after creation
  useEffect(() => {
    if (!listLoaded || !orgLoaded || !auth.isLoaded) {
      return;
    }
    
    if (hasTriedAutoSelect.current) {
      return;
    }

    const post = search?.get("post");
    const orgs = organizationList?.data ?? [];

    // Only auto-select in these specific cases:
    // 1. Just created an org (post=created) 
    // 2. Just selected an org (post=selected)
    // 3. User has NO organization and exactly one org exists
    const shouldAutoSelect = 
      post === "created" || 
      post === "selected" || 
      (!organization && !auth.orgId && orgs.length === 1);

    if (!shouldAutoSelect || orgs.length === 0) {
      return;
    }

    const targetOrg = orgs[0]?.organization;
    if (!targetOrg?.id) {
      return;
    }

    hasTriedAutoSelect.current = true;
    
    setActive({ organization: targetOrg.id })
      .then(() => {
        // Only redirect if it was due to a user action (post param)
        if (post) {
          setTimeout(() => {
            window.location.href = `/organization/${targetOrg.slug}`;
          }, 1000);
        }
      })
      .catch((error) => {
        console.error("Failed to activate org:", error);
        hasTriedAutoSelect.current = false;
      });

  }, [listLoaded, orgLoaded, auth.isLoaded, organizationList, setActive, search, organization, auth.orgId]);

  return (
    <div className="flex justify-center items-center pt-14">
      <OrganizationList
        hidePersonal
        afterCreateOrganizationUrl="/onboarding?post=created"
        afterSelectOrganizationUrl="/onboarding?post=selected"
      />
      {search?.get("post") && (
        <span className="sr-only">post={search.get("post")}</span>
      )}
    </div>
  );
}
