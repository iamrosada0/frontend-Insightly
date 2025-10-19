import { apiFetch } from "@/lib/api";
import { getToken, clearToken } from "@/lib/auth";
import { UserProfileResponse, Feedback, ApiError } from "@/types";
import { useRouter } from "next/router";
import { useState, useCallback, useEffect } from "react";

export function useProfileData(page: number) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchProfileAndFeedbacks = useCallback(async () => {
    const token = getToken();

    if (!token) {
      router.push("/auth/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [profileData, feedbackData] = await Promise.all([
        apiFetch<UserProfileResponse>("/users/me/profile", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        apiFetch<Feedback[]>(`/feedback?page=${page}&limit=10`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setProfile(profileData);
      setFeedbacks(feedbackData ?? []);
      setHasMore((feedbackData?.length ?? 0) === 10);
    } catch (err: unknown) {
      const apiError = err as ApiError;

      if (apiError.status === 401) {
        clearToken();
        router.push("/auth/login");
      } else {
        setError(apiError.message || "Erro ao carregar dados do perfil.");
      }
    } finally {
      setLoading(false);
    }
  }, [page, router]);

  useEffect(() => {
    fetchProfileAndFeedbacks();
  }, [fetchProfileAndFeedbacks]);

  return { profile, feedbacks, loading, error, hasMore };
}