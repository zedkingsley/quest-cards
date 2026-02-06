import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChallengeDetail } from './ChallengeDetail';
import { Challenge } from '@/lib/types';

const mockChallenge: Challenge = {
  slug: 'make-bed',
  title: 'Make Your Bed',
  description: 'Make your bed neatly',
  icon: '🛏️',
  difficulty: 'easy',
  reward: 15,
  time_estimate: '5 min',
};

describe('ChallengeDetail', () => {
  const defaultProps = {
    challenge: mockChallenge,
    packName: 'Quick Wins',
    packIcon: '⚡',
  };

  it('renders challenge details', () => {
    render(<ChallengeDetail {...defaultProps} />);
    
    expect(screen.getByText('Make Your Bed')).toBeInTheDocument();
    expect(screen.getByText('Make your bed neatly')).toBeInTheDocument();
    expect(screen.getByText('🛏️')).toBeInTheDocument();
    expect(screen.getByText(/15 points/)).toBeInTheDocument();
  });

  // F13: "Pass" instead of "Give Up"
  it('shows "Pass" button when active (F13)', () => {
    const onAbandon = vi.fn();
    render(
      <ChallengeDetail 
        {...defaultProps} 
        isActive={true}
        onAbandon={onAbandon}
        onMarkDone={vi.fn()}
      />
    );
    
    expect(screen.getByText('Pass')).toBeInTheDocument();
    expect(screen.queryByText('Give Up')).not.toBeInTheDocument();
  });

  it('calls onAbandon when Pass is clicked', () => {
    const onAbandon = vi.fn();
    render(
      <ChallengeDetail 
        {...defaultProps} 
        isActive={true}
        onAbandon={onAbandon}
        onMarkDone={vi.fn()}
      />
    );
    
    fireEvent.click(screen.getByText('Pass'));
    expect(onAbandon).toHaveBeenCalled();
  });

  // F14: Undo submission
  it('shows Undo button for non-parents in pending review (F14)', () => {
    const onUndoSubmit = vi.fn();
    render(
      <ChallengeDetail 
        {...defaultProps} 
        isPendingReview={true}
        isParent={false}
        onUndoSubmit={onUndoSubmit}
      />
    );
    
    expect(screen.getByText(/Undo/)).toBeInTheDocument();
  });

  it('calls onUndoSubmit when Undo is clicked', () => {
    const onUndoSubmit = vi.fn();
    render(
      <ChallengeDetail 
        {...defaultProps} 
        isPendingReview={true}
        isParent={false}
        onUndoSubmit={onUndoSubmit}
      />
    );
    
    fireEvent.click(screen.getByText(/Undo/));
    expect(onUndoSubmit).toHaveBeenCalled();
  });

  it('does NOT show Undo button for parents', () => {
    render(
      <ChallengeDetail 
        {...defaultProps} 
        isPendingReview={true}
        isParent={true}
        onApprove={vi.fn()}
        onUndoSubmit={vi.fn()}
      />
    );
    
    expect(screen.queryByText(/Undo/)).not.toBeInTheDocument();
  });

  // F16: Approve with PIN button
  it('shows "Approve with PIN" for parents viewing pending quest (F16)', () => {
    const onApprove = vi.fn();
    render(
      <ChallengeDetail 
        {...defaultProps} 
        isPendingReview={true}
        isParent={true}
        onApprove={onApprove}
      />
    );
    
    expect(screen.getByText(/Approve with PIN/)).toBeInTheDocument();
  });

  it('shows "I Did It!" button when active', () => {
    render(
      <ChallengeDetail 
        {...defaultProps} 
        isActive={true}
        onMarkDone={vi.fn()}
      />
    );
    
    expect(screen.getByText(/I Did It!/)).toBeInTheDocument();
  });

  it('shows Start Quest button when available', () => {
    render(
      <ChallengeDetail 
        {...defaultProps} 
        isParent={false}
        onStartForSelf={vi.fn()}
      />
    );
    
    expect(screen.getByText(/Start This Quest!/)).toBeInTheDocument();
  });

  it('shows Add to Queue when has active quest', () => {
    render(
      <ChallengeDetail 
        {...defaultProps} 
        isParent={false}
        hasActiveQuest={true}
        onStartForSelf={vi.fn()}
      />
    );
    
    expect(screen.getByText(/Add to Queue/)).toBeInTheDocument();
  });

  it('shows completed state', () => {
    render(
      <ChallengeDetail 
        {...defaultProps} 
        isCompleted={true}
      />
    );
    
    expect(screen.getByText(/Quest Completed!/)).toBeInTheDocument();
  });
});
