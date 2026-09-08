"use client";

import { useEffect } from "react";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { settleAccountOnDevice } from "@/lib/verification/device-storage";

export function AccountStorageGuard() {
  const { user, loading } = useAuth();
  const userId = user?.id ?? null;
  useEffect(() => {
    if (loading) return;
    settleAccountOnDevice(userId);
  }, [loading, userId]);
  return null;
}
