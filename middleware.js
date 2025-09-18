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
  const a = auth();
  const path = req.nextUrl.pathname;
  const isOnboarding = path.startsWith("/onboarding");
  const isOrgPage = /^\/organization\/[^/]+\/?$/.test(path);

  // Chưa đăng nhập nhưng vào route cần bảo vệ -> Sign in
  if (!a.userId && isProtectedRoute(req)) {
    return auth().redirectToSignIn({ returnBackUrl: req.url });
  }

  // Đã đăng nhập nhưng CHƯA có active org:
  // - Cho phép ở "/" (home), "/onboarding" và "/organization/:slug" (để user tự chọn)
  if (a.userId && !a.orgId) {
    if (path === "/" || isOnboarding || isOrgPage) {
      return NextResponse.next();
    }
    // Các route bảo vệ khác -> đưa về onboarding để chọn org
    const url = req.nextUrl.clone();
    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  // Mặc định cho qua
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
