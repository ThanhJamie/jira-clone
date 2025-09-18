import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/organization(.*)",
  "/project(.*)",
  "/issue(.*)",
  "/sprint(.*)",
]);

export default clerkMiddleware((auth, req) => {
  const authResult = auth();
  const { userId, orgId, orgSlug, sessionClaims, organization } = authResult;
  const pathname = req.nextUrl.pathname;
  const isOnboarding = pathname.startsWith("/onboarding");
  const isOrgPage = /^\/organization\/[^/]+\/?$/.test(pathname);

  // Extract org data from session claims if not in auth context
  const orgFromClaims = sessionClaims?.o;
  const effectiveOrgId = orgId || orgFromClaims?.id;
  const effectiveOrgSlug = orgSlug || orgFromClaims?.slg;

  if (!userId && isProtectedRoute(req)) {
    return auth().redirectToSignIn({ returnBackUrl: req.url });
  }

  // Special handling for onboarding - always allow
  if (isOnboarding) {
    return NextResponse.next();
  }

  if (userId && !effectiveOrgId) {    
    if (pathname === "/" || isOrgPage) {
      return NextResponse.next();
    }
    
    if (isProtectedRoute(req)) {
      const url = req.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }
  }

  // If user has org and is on root, redirect to org (unless they want to access onboarding)
  if (userId && (effectiveOrgId || effectiveOrgSlug) && pathname === "/") {
    // Check if user wants to access onboarding or switch orgs
    const searchParams = req.nextUrl.searchParams;
    const allowRoot = searchParams.get("redirect") === "false" || searchParams.get("onboarding") === "true";
    
    if (!allowRoot) {
      const slug = effectiveOrgSlug || organization?.slug;
      if (slug) {
        return NextResponse.redirect(new URL(`/organization/${slug}`, req.url));
      }
    }
  }

  // If accessing org page but with wrong slug, redirect to correct one
  if (userId && effectiveOrgSlug && isOrgPage) {
    const currentSlug = pathname.split('/')[2];
    if (currentSlug !== effectiveOrgSlug) {
      return NextResponse.redirect(new URL(`/organization/${effectiveOrgSlug}`, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
