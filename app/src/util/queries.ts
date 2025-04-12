import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { supabase } from '@/util/supabase';
import { computed, type Ref } from 'vue';

export enum Status {
  Pending = 'pending',
  InProgress = 'in-progress',
  Resolved = 'resolved',
  Closed = 'closed',
}

export enum Priority {
    High = 'high',
    Medium = "medium",
    Low = "low"
}

export interface Report {
  id: string;
  type: string;
  user_id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  location: string;
  coordinates: [number, number];
  date_submitted: string;
  reported_by: string;
  image_url?: string | null;
  comment_count?: number;
}

export interface Comment {
  id: string;
  report_id: string;
  user_id: string;
  user_name: string | null;
  text: string | null;
  date: string;
}

export function useReports() {
  const query = useQuery<Report[]>({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*, comments(count)')
        .order('date_submitted', { ascending: false });

      if (error) throw error;

      return data.map((report: Report & { comments: { count: number }[] }) => ({
        ...report,
        comment_count: report.comments[0]?.count ?? 0,
      }));
    },
  });

  const reports = computed(() => query.data.value ?? []);

  return { ...query, reports };
}

export function useReport(reportId: Ref<string | undefined>) {
  const query = useQuery<Report>({
    queryKey: ['report', reportId],
    queryFn: async () => {
      if (!reportId.value) throw new Error('Report ID is required');
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId.value)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: computed(() => !!reportId.value),
  });

  const report = computed(() => query.data.value ?? null);

  return { ...query, report };
}

export function useCreateReport() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (report: Omit<Report, 'id' | 'date_submitted'>) => {
      const { data, error } = await supabase.from('reports').insert([{ ...report }]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

  return mutation;
}

export function useComments(reportId: Ref<string | undefined>) {
  const query = useQuery({
    queryKey: ['comments', reportId],
    queryFn: async () => {
      if (!reportId.value) throw new Error('Report ID is required');
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('report_id', reportId.value)
        .order('date', { ascending: true });
      if (error) throw error;
      return data as Comment[];
    },
    enabled: computed(() => !!reportId.value),
  });

  const comments = computed(() => query.data.value ?? []);

  return { ...query, comments };
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (comment: Omit<Comment, 'id' | 'date'>) => {
      const { data, error } = await supabase.from('comments').insert([{ ...comment }]);

      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.report_id] });
    },
  });

  return mutation;
}
