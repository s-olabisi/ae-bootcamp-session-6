/**
 * Determines whether a todo is overdue.
 *
 * A todo is overdue when its due date (calendar date only, no time-of-day)
 * is earlier than today's date and it is not marked complete.
 *
 * @param {{ dueDate: string|null, completed: number|boolean }} todo
 * @returns {boolean}
 */
export function isOverdue(todo) {
  if (!todo || !todo.dueDate || todo.completed) {
    return false;
  }

  const today = new Date();
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const [year, month, day] = todo.dueDate.split('-').map(Number);
  const dueDateOnly = new Date(year, month - 1, day);

  return dueDateOnly < todayDateOnly;
}
