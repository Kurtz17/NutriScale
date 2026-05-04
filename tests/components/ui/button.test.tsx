import { Button } from '@/components/ui/button';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('Button Component', () => {
  it('should render correctly with text', () => {
    const { container } = render(<Button>Click Me</Button>);
    const button = container.firstChild as HTMLButtonElement;

    expect(button).toBeTruthy();
    expect(button.textContent).toBe('Click Me');
  });

  it('should trigger onClick when clicked', () => {
    const handleClick = vi.fn();
    const { container } = render(<Button onClick={handleClick}>Click</Button>);
    const button = container.firstChild as HTMLButtonElement;

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should have disabled attribute when disabled is true', () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const button = container.firstChild as HTMLButtonElement;

    expect(button.disabled).toBe(true);
  });

  it('should apply correct variant classes', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    const button = container.firstChild as HTMLButtonElement;

    expect(button.className).toContain('bg-destructive/10');
  });
});
