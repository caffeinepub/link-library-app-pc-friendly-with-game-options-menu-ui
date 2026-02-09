import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Link } from '../backend';

export interface LinkWithId extends Link {
  id: string;
}

export function useGetAllLinks() {
  const { actor, isFetching } = useActor();

  return useQuery<Link[]>({
    queryKey: ['links'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLinks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, link }: { id: string; link: Link }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addLink(id, link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
  });
}

export function useUpdateLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, link }: { id: string; link: Link }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateLink(id, link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
  });
}

export function useDeleteLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteLink(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
  });
}
