import { useMemo, useState, useCallback } from 'react';
import { useGetStudentsQuery, useCreateStudentMutation } from '@shared/store/slices/apiSlice';

export function useStudents() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  const query = useGetStudentsQuery({ page, limit, search });
  const [createStudent, createStatus] = useCreateStudentMutation();

  const setRowsPerPage = useCallback((rows: number) => {
    setLimit(rows);
    setPage(1);
  }, []);

  return {
    page,
    limit,
    search,
    setPage,
    setRowsPerPage,
    setSearch,
    students: (query.data as any[]) || [],
    isLoading: query.isLoading,
    refetch: query.refetch,
    createStudent,
    createStatus,
  };
}
