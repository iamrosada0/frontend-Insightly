'use client';

import { FeedbackList } from '@/components/FeedbackList';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useFeedbackList } from '@/hooks/useFeedbackList';

export default function FeedbackListPage() {
  const {
    feedbacks,
    loading,
    error,
    page,
    hasMore,
    nextPage,
    prevPage,
  } = useFeedbackList();


  if (loading && page === 1) return <LoadingSpinner />;

  return (
    <FeedbackList
      feedbacks={feedbacks}
      loading={loading && page > 1}
      error={error}
      page={page}
      hasMore={hasMore}
      onNextPage={nextPage}
      onPrevPage={prevPage}
    />
  );
}
