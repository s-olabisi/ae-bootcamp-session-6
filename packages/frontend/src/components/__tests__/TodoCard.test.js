import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });
});

function daysFromToday(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

describe('TodoCard Overdue badge', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // User Story 1: Spot overdue todos at a glance
  it('renders an Overdue badge for a todo with a past due date that is incomplete', () => {
    const todo = { id: 1, title: 'Overdue Todo', dueDate: daysFromToday(-1), completed: 0 };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);

    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });

  it('does not render an Overdue badge for a todo due today or in the future', () => {
    const todayTodo = { id: 1, title: 'Today Todo', dueDate: daysFromToday(0), completed: 0 };
    const { rerender } = render(<TodoCard todo={todayTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();

    const futureTodo = { id: 1, title: 'Future Todo', dueDate: daysFromToday(1), completed: 0 };
    rerender(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it('does not render an Overdue badge for a todo with no due date', () => {
    const todo = { id: 1, title: 'No Date Todo', dueDate: null, completed: 0 };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);

    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it('does not render an Overdue badge for a completed todo with a past due date', () => {
    const todo = { id: 1, title: 'Completed Todo', dueDate: daysFromToday(-1), completed: 1 };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);

    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  // User Story 2: Overdue status is accessible, not just visual
  it('exposes the Overdue status as queryable visible text', () => {
    const overdueTodo = { id: 1, title: 'Overdue Todo', dueDate: daysFromToday(-1), completed: 0 };
    const { rerender } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByText('Overdue')).toBeInTheDocument();

    const notOverdueTodo = { id: 1, title: 'Future Todo', dueDate: daysFromToday(1), completed: 0 };
    rerender(<TodoCard todo={notOverdueTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  // User Story 3: Overdue status stays current after edits
  it('removes the Overdue badge immediately when the todo is marked complete', () => {
    const overdueTodo = { id: 1, title: 'Overdue Todo', dueDate: daysFromToday(-1), completed: 0 };
    const { rerender } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByText('Overdue')).toBeInTheDocument();

    rerender(<TodoCard todo={{ ...overdueTodo, completed: 1 }} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it('removes the Overdue badge immediately when the due date is edited to a future date', () => {
    const overdueTodo = { id: 1, title: 'Overdue Todo', dueDate: daysFromToday(-1), completed: 0 };
    const { rerender } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByText('Overdue')).toBeInTheDocument();

    rerender(<TodoCard todo={{ ...overdueTodo, dueDate: daysFromToday(1) }} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it("shows the Overdue badge immediately when a non-overdue todo's due date is edited to a past date", () => {
    const futureTodo = { id: 1, title: 'Future Todo', dueDate: daysFromToday(1), completed: 0 };
    const { rerender } = render(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();

    rerender(<TodoCard todo={{ ...futureTodo, dueDate: daysFromToday(-1) }} {...mockHandlers} isLoading={false} />);
    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });
});
