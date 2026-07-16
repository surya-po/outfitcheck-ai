// This file is intentionally left empty.
// The real Partner Login page is at /partner-login (src/app/partner-login/page.tsx)
// which sits outside the (partner) authenticated layout.
// This stub exists only to avoid a 404 if someone navigates here directly;
// the middleware will redirect /partner/* routes to /partner-login when not authenticated.
export { default } from "@/app/partner-login/page";



