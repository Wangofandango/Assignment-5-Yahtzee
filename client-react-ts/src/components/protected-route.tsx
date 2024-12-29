import { RouteProps, useLocation, useNavigate, useParams } from "react-router";
import { useAppSelector } from "../store/hooks";
import React from "react";

export type ProtectedRouteProps = RouteProps;

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ gameId: string }>();
  const player = useAppSelector((state) => state.player.username);

  // required to be in a use effect by react router
  React.useEffect(() => {
    if (!player) {
      const isPending = location.pathname.includes("/pending/");

      const searchParams = new URLSearchParams();

      if (params.gameId) {
        if (isPending) {
          searchParams.set("pending", params.gameId);
        } else {
          searchParams.set("game", params.gameId);
        }
      }

      navigate(`/login?${searchParams.toString()}`);
    }
  }, [player]);

  return !!player ? children : null;
}
