import { isOverdue } from '../overdue';

function daysFromToday(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

describe('isOverdue', () => {
  it('returns true for a past due date and incomplete todo', () => {
    expect(isOverdue({ dueDate: daysFromToday(-1), completed: 0 })).toBe(true);
  });

  it('returns false for a due date of today and incomplete todo', () => {
    expect(isOverdue({ dueDate: daysFromToday(0), completed: 0 })).toBe(false);
  });

  it('returns false for a future due date and incomplete todo', () => {
    expect(isOverdue({ dueDate: daysFromToday(1), completed: 0 })).toBe(false);
  });

  it('returns false when there is no due date', () => {
    expect(isOverdue({ dueDate: null, completed: 0 })).toBe(false);
  });

  it('returns false for a past due date that is completed', () => {
    expect(isOverdue({ dueDate: daysFromToday(-1), completed: 1 })).toBe(false);
  });
});
