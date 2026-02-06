import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import LoginForm from "./login-form"

export default async function LoginPage() {
  const cookieStore = await cookies()
  const hasSession = cookieStore.get("kol_session")?.value

  if (hasSession) redirect("/dashboard")
  return <LoginForm />
}
