import { useEffect, useState } from "react";
import { authService } from "@/domains/auth/service";
import type { User } from "@/domains/users/types";

type ProfileState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

const initialState: ProfileState = {
  user: null,
  loading: false,
  error: null,
};

export const useUserProfile = () => {
  const [state, setState] = useState<ProfileState>(initialState);

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      setState({ user: null, loading: true, error: null });
      try {
        const user = await authService.getProfile();
        if (!active) return;
        setState({ user, loading: false, error: null });
      } catch (err: any) {
        if (!active) return;
        setState({
          user: null,
          loading: false,
          error: err?.message || "Unable to load profile",
        });
      }
    };

    loadProfile();
    return () => {
      active = false;
    };
  }, []);

  return state;
};
