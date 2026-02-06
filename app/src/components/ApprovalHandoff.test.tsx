import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ApprovalHandoff } from './ApprovalHandoff';

describe('ApprovalHandoff', () => {
  const defaultProps = {
    childName: 'Tommy',
    questTitle: 'Make Your Bed',
    questDescription: 'Make your bed neatly with pillows arranged',
    questIcon: '🛏️',
    questReward: 15,
    onApproveNow: vi.fn(() => true),
    onLater: vi.fn(),
  };

  it('renders child name and quest title', () => {
    render(<ApprovalHandoff {...defaultProps} />);
    
    expect(screen.getByText(/Great job, Tommy!/)).toBeInTheDocument();
    expect(screen.getByText('Make Your Bed')).toBeInTheDocument();
  });

  // F15: Task details visible
  it('shows quest description (F15)', () => {
    render(<ApprovalHandoff {...defaultProps} />);
    
    expect(screen.getByText('Make your bed neatly with pillows arranged')).toBeInTheDocument();
  });

  it('shows quest icon (F15)', () => {
    render(<ApprovalHandoff {...defaultProps} />);
    
    expect(screen.getByText('🛏️')).toBeInTheDocument();
  });

  it('shows quest reward (F15)', () => {
    render(<ApprovalHandoff {...defaultProps} />);
    
    expect(screen.getByText(/15 points/)).toBeInTheDocument();
  });

  // F15: Skip button instead of "I'll approve later"
  it('shows Skip button instead of "I\'ll approve later" (F15)', () => {
    render(<ApprovalHandoff {...defaultProps} />);
    
    expect(screen.getByText('Skip')).toBeInTheDocument();
    expect(screen.queryByText("I'll approve later")).not.toBeInTheDocument();
  });

  it('calls onLater when Skip is clicked', () => {
    render(<ApprovalHandoff {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Skip'));
    expect(defaultProps.onLater).toHaveBeenCalled();
  });

  it('shows PIN pad when Approve Now is clicked', () => {
    render(<ApprovalHandoff {...defaultProps} />);
    
    fireEvent.click(screen.getByText(/Parent: Approve Now/));
    expect(screen.getByText(/Parent Approval/)).toBeInTheDocument();
  });

  it('renders without optional props', () => {
    const minimalProps = {
      childName: 'Tommy',
      questTitle: 'Do Something',
      onApproveNow: vi.fn(() => true),
      onLater: vi.fn(),
    };
    
    render(<ApprovalHandoff {...minimalProps} />);
    expect(screen.getByText('Do Something')).toBeInTheDocument();
  });
});
