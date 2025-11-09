import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import KpiCard from '../components/dashboard/KpiCard';

describe('KpiCard', () => {
  test('renders with correct data', () => {
    render(
      <KpiCard
        label="Total Schools"
        value={1542}
        change={2.4}
        trend="positive"
        isLoading={false}
      />
    );

    expect(screen.getByText('Total Schools')).toBeInTheDocument();
    expect(screen.getByText('1,542')).toBeInTheDocument();
    expect(screen.getByText('↗ 2.4%')).toBeInTheDocument();
  });

  test('shows skeleton when loading', () => {
    const { container } = render(<KpiCard isLoading={true} />);
    
    // Should show loading skeleton - check for pulse animation
    const skeletonElements = container.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  test('shows correct colors for trends', () => {
    const { rerender } = render(
      <KpiCard label="Test" value={100} change={5} trend="positive" />
    );
    
    const positiveElement = screen.getByText('↗ 5%');
    expect(positiveElement.className).toContain('text-green-600');

    rerender(<KpiCard label="Test" value={100} change={-3} trend="negative" />);
    const negativeElement = screen.getByText('↘ 3%');
    expect(negativeElement.className).toContain('text-red-600');
  });
});