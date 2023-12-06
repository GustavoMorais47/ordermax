import { useAuth } from "../../contexts/auth";
import AppRoutes from "../../routes/app.routes";

export default function Auth() {
  const { usuario } = useAuth();
  return !usuario || usuario.role == "cl" ? (
    <AppRoutes.ClienteRoutes />
  ) : usuario.role === "ct" ? (
    <AppRoutes.ConsultorRoutes />
  ) : (
    <AppRoutes.MecanicoRoutes />
  );
}
