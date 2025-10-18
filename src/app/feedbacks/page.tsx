'use client';

import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import { Feedback, ApiError } from '@/types';
import { FeedbackList } from '@/components/FeedbackList';
import { getToken, clearToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function FeedbackListPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[] | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [page, setPage] = useState(1);
   const [hasMore, setHasMore] = useState(true);
   const router = useRouter();
 
   const fetchFeedbacks = useCallback(async () => {
     setLoading(true);
     setError(null);
     try {
       const token = getToken();
       console.log('Token de autenticação:', token);
       if (!token) {
         router.push('/auth/login');
         return;
       }
       const data = await apiFetch<Feedback[]>(`/feedback?page=${page}&limit=10`, {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       });
       setFeedbacks(data ?? []);
       setHasMore((data?.length ?? 0) === 10);
     } catch (err: unknown) {
       const apiError = err as ApiError;
       if (apiError.status === 401) {
         clearToken();
         router.push('/auth/login');
       } else {
         setError(apiError.message || 'Erro ao carregar feedbacks');
       }
     } finally {
       setLoading(false);
     }
   }, [page, router]);
 
   useEffect(() => {
     fetchFeedbacks();
   }, [fetchFeedbacks]);
 
   const handleNextPage = () => {
     if (hasMore) setPage((prev) => prev + 1);
   };
 
   const handlePrevPage = () => {
     if (page > 1) setPage((prev) => prev - 1);
   };
 
   return (
 
     <FeedbackList
       feedbacks={feedbacks}
       loading={loading}
       error={error}
       page={page}
       hasMore={hasMore}
       onNextPage={handleNextPage}
       onPrevPage={handlePrevPage}
     />
    
   );
}