import { Badge } from '@/components/ui/badge';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Badge Component', () => {
  it('should render correctly with default variant', () => {
    const { container } = render(<Badge>Test Badge</Badge>);
    const badge = container.firstChild as HTMLElement;

    expect(badge).toBeTruthy();
    expect(badge.textContent).toBe('Test Badge');
    // Check if it has default class mapping (e.g. bg-primary)
    expect(badge.className).toContain('bg-primary');
  });

  it('should apply secondary variant class when passed as prop', () => {
    const { container } = render(<Badge variant="secondary">Secondary</Badge>);
    const badge = container.firstChild as HTMLElement;

    expect(badge.className).toContain('bg-secondary');
  });

  it('should allow custom className overrides', () => {
    const { container } = render(
      <Badge className="custom-class">Custom</Badge>,
    );
    const badge = container.firstChild as HTMLElement;

    expect(badge.className).toContain('custom-class');
  });
});
