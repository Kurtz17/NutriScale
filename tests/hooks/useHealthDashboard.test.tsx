import { useHealthDashboard } from '@/hooks/useHealthDashboard';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const fetchMock = vi.fn();

describe('useHealthDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });

  it('should load dashboard stats, meals, and AI narrative', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          stats: [{ title: 'BMI', value: '22.0' }],
          meals: [{ time: '07:00', type: 'Breakfast', items: [] }],
          narasiAI: 'Pertahankan pola makan seimbang.',
        }),
    });

    const { result } = renderHook(() => useHealthDashboard());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith('/api/health-dashboard');
    expect(result.current.stats).toEqual([{ title: 'BMI', value: '22.0' }]);
    expect(result.current.meals).toHaveLength(1);
    expect(result.current.narasiAI).toBe('Pertahankan pola makan seimbang.');
  });

  it('should stop loading and keep empty state when the request fails', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    fetchMock.mockRejectedValue(new Error('network down'));

    const { result } = renderHook(() => useHealthDashboard());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.stats).toEqual([]);
    expect(result.current.meals).toEqual([]);
    expect(result.current.narasiAI).toBe('');
    expect(consoleError).toHaveBeenCalledWith(
      'Failed to fetch dashboard data',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });
});
