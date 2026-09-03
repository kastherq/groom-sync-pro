import { createFileRoute } from "@tanstack/react-router";
import { LoginView } from "@/components/gs/login-view";

export const Route = createFileRoute("/login/$salon")({
  component: SalonLogin,
});

function SalonLogin() {
  const { salon } = Route.useParams();
  return <LoginView salon={salon} />;
}
