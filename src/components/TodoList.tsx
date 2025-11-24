'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import { apiGetTodos, apiCreateTodo, apiUpdateTodo, apiDeleteTodo, apiClearCompleted, ApiTodo } from '@/lib/api';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  category?: string;
  priority: 'high' | 'medium' | 'low';
  description?: string;
}

export default function TodoList() {
  const { user, token } = useAuth();
  const { t } = usePreferences();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDueDate, setSelectedDueDate] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // New states for enhanced features
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [description, setDescription] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'deadline'>('date');
  
  // Notification state
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'warning') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const CATEGORIES = ['Sekolah', 'Kerja', 'Pribadi', 'Lainnya'];
  
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'Sekolah': t('todo.categorySchool'),
      'Kerja': t('todo.categoryWork'),
      'Pribadi': t('todo.categoryPersonal'),
      'Lainnya': t('todo.categoryOther'),
    };
    return labels[category] || category;
  };
  const PRIORITIES = [
    { value: 'high', labelKey: 'todo.priorityHigh', color: 'bg-red-100 text-red-700 border-red-300' },
    { value: 'medium', labelKey: 'todo.priorityMedium', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    { value: 'low', labelKey: 'todo.priorityLow', color: 'bg-green-100 text-green-700 border-green-300' },
  ];

  // Load from backend
  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const data: ApiTodo[] = await apiGetTodos(token);
        const mapped: Todo[] = data.map(t => ({
          id: t.id,
          text: t.text,
          completed: t.completed,
          createdAt: new Date(t.created_at),
          dueDate: t.due_date ? new Date(t.due_date) : undefined,
          category: t.category || undefined,
          priority: (t.priority as 'high' | 'medium' | 'low') || 'medium',
          description: t.description || undefined,
        }));
        setTodos(mapped.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
      } catch (error) {
        console.error('Tidak dapat memuat todos. Pastikan server sudah berjalan.');
      }
    };
    load();
  }, [token]);

  // Helper functions
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isUpcoming = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  // CREATE - Tambah todo baru
  const addTodo = async () => {
    console.log('addTodo called!', { inputValue, token: !!token });
    if (inputValue.trim() === '') {
      showNotification(t('todo.notifEmptyTitle'), 'warning');
      return;
    }
    
    if (!token) {
      showNotification(t('todo.notifMustLogin'), 'error');
      return;
    }
    
    try {
      console.log('Adding todo:', { text: inputValue, category: selectedCategory, priority: selectedPriority });
      
      const created = await apiCreateTodo(token, {
        text: inputValue,
        completed: false,
        due_date: selectedDueDate ? new Date(selectedDueDate).toISOString() : null,
        category: selectedCategory || null,
        priority: selectedPriority,
        description: description || null,
      });
      
      console.log('Todo created:', created);
      
      const newTodo: Todo = {
        id: created.id,
        text: created.text,
        completed: created.completed,
        createdAt: new Date(created.created_at),
        dueDate: created.due_date ? new Date(created.due_date) : undefined,
        category: created.category || undefined,
        priority: (created.priority as 'high' | 'medium' | 'low') || 'medium',
        description: created.description || undefined,
      };
      
      setTodos([newTodo, ...todos]);
      setInputValue('');
      setSelectedDueDate('');
      setSelectedCategory('');
      setSelectedPriority('medium');
      setDescription('');
      
      showNotification(t('todo.notifSuccess'), 'success');
      console.log('Todo added successfully!');
    } catch (error) {
      console.error('Error adding todo:', error);
      showNotification(t('todo.notifError'), 'error');
    }
  };

  // UPDATE - Toggle status completed
  const toggleTodo = async (id: number) => {
    if (!token) return;
    const target = todos.find(t => t.id === id);
    if (!target) return;
    const updated = await apiUpdateTodo(token, id, { completed: !target.completed });
    setTodos(todos.map(todo =>
      todo.id === id
        ? {
            ...todo,
            text: updated.text,
            completed: updated.completed,
            dueDate: updated.due_date ? new Date(updated.due_date) : undefined,
          }
        : todo
    ));
  };

  // UPDATE - Edit todo text
  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = async (id: number) => {
    if (editingText.trim() === '' || !token) return;
    const updated = await apiUpdateTodo(token, id, { text: editingText });
    setTodos(todos.map(todo =>
      todo.id === id
        ? {
            ...todo,
            text: updated.text,
            completed: updated.completed,
            dueDate: updated.due_date ? new Date(updated.due_date) : undefined,
          }
        : todo
    ));
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  // DELETE - Hapus todo
  const deleteTodo = async (id: number) => {
    if (!token) return;
    await apiDeleteTodo(token, id);
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // DELETE ALL - Hapus semua completed todos
  const clearCompleted = async () => {
    if (!token) return;
    await apiClearCompleted(token);
    setTodos(todos.filter(todo => !todo.completed));
  };

  // Sort function
  const sortTodos = (todosToSort: Todo[]) => {
    return [...todosToSort].sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === 'deadline') {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  };

  // Filter todos berdasarkan search dan status
  const filteredTodos = sortTodos(todos.filter(todo => {
    // Filter berdasarkan status
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;

    // Filter berdasarkan search
    if (searchQuery && !todo.text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filter berdasarkan kategori
    if (categoryFilter !== 'all' && todo.category !== categoryFilter) return false;

    // Filter berdasarkan prioritas
    if (priorityFilter !== 'all' && todo.priority !== priorityFilter) return false;
    
    return true;
  }));

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  const getPriorityColor = (priority: string) => {
    const p = PRIORITIES.find(pr => pr.value === priority);
    return p ? p.color : '';
  };

  const getPriorityLabel = (priority: string) => {
    const p = PRIORITIES.find(pr => pr.value === priority);
    return p ? t(p.labelKey) : priority;
  };

  return (
    <div className="relative flex gap-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl overflow-hidden min-h-[700px] border border-gray-200/50 dark:border-gray-700/50">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl border-2 animate-slide-in-right flex items-center gap-3 ${
          notification.type === 'success' 
            ? 'bg-green-500 border-green-600 text-white' 
            : notification.type === 'error'
            ? 'bg-red-500 border-red-600 text-white'
            : 'bg-yellow-500 border-yellow-600 text-white'
        }`}>
          <span className="text-lg">
            {notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : '⚠️'}
          </span>
          <span className="font-semibold">{notification.message}</span>
        </div>
      )}
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-72' : 'w-0'} todo-sidebar overflow-hidden`}>
        <div className="todo-sidebar-content">
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('todo.searchPlaceholder')}
              className="search-input"
            />
          </div>

          {/* Navigation Menu */}
          <nav className="nav-menu">
            <div className="nav-item">
              <span className="nav-item-text">{t('todo.tasks')}</span>
              <span className="nav-item-count">{activeCount}</span>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 flex justify-center">
        <div className="todo-section w-full">
        {/* Header with Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:shadow-md group"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="todo-header">
              <div>
                <div className="todo-title">{t('todo.myTasks')}</div>
                <div className="todo-subtitle">{t('todo.allTasks')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="stats-bar">
          <div className="stat-item all">
            <span>📋</span>
            <span>{t('todo.filterAll')} ({todos.length})</span>
          </div>
          <div className="stat-item active">
            <span>🔥</span>
            <span>{t('todo.filterActive')} ({activeCount})</span>
          </div>
          <div className="stat-item completed">
            <span>✅</span>
            <span>{t('todo.filterCompleted')} ({completedCount})</span>
          </div>
        </div>

        {/* Input Section */}
        <div className="add-task-form">
            <div className="space-y-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                placeholder={`✨ ${t('todo.addTask')}...`}
                className="form-input"
              />
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t('todo.dueDate')}</label>
                  <input
                    type="date"
                    value={selectedDueDate}
                    onChange={(e) => setSelectedDueDate(e.target.value)}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">{t('todo.category')}</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="form-select"
                  >
                    <option value="">{t('todo.category')}</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">{t('todo.priority')}</label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value as 'high' | 'medium' | 'low')}
                    className="form-select"
                  >
                    {PRIORITIES.map(p => (
                      <option key={p.value} value={p.value}>{t(p.labelKey)}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Button clicked!');
                      addTodo();
                    }}
                    className="btn-add"
                  >
                    <span className="btn-icon">➕</span>
                    <span>{t('todo.addTask')}</span>
                  </button>
                </div>
              </div>
              
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={`📝 ${t('todo.description')}...`}
                className="form-textarea"
                rows={2}
              />
            </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            onClick={() => setFilter('all')}
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          >
            {t('todo.filterAll')} ({todos.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
          >
            {t('todo.filterActive')} ({activeCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
          >
            {t('todo.filterCompleted')} ({completedCount})
          </button>
        </div>

        {/* Advanced Filters and Sort */}
        <div className="filter-bar">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">{t('todo.allCategories')}</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">{t('todo.allPriorities')}</option>
            {PRIORITIES.map(p => (
              <option key={p.value} value={p.value}>{t(p.labelKey)}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'priority' | 'deadline')}
            className="filter-select"
          >
            <option value="date">{t('todo.sortNewest')}</option>
            <option value="priority">{t('todo.sortPriority')}</option>
            <option value="deadline">{t('todo.sortDeadline')}</option>
          </select>
        </div>

        {/* Todo List */}
        <div className="task-list mb-6">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-20 px-6">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
                <span className="text-5xl">
                  {filter === 'completed' && todos.length > 0
                    ? '🎉'
                    : filter === 'active' && todos.length > 0
                    ? '✨'
                    : '📝'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                {filter === 'completed' && todos.length > 0
                  ? t('todo.noCompletedTasks')
                  : filter === 'active' && todos.length > 0
                  ? t('todo.allTasksCompleted')
                  : t('todo.noTasks')}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {filter === 'completed' && todos.length > 0
                  ? t('todo.completeTasksToSee')
                  : filter === 'active' && todos.length > 0
                  ? t('todo.greatJobAllDone')
                  : t('todo.startByAdding')}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo, index) => {
              const categoryClass = 'task-badge badge-category';

              const priorityClass =
                todo.priority === 'high'
                  ? 'task-badge badge-priority tinggi'
                  : todo.priority === 'medium'
                  ? 'task-badge badge-priority sedang'
                  : 'task-badge badge-priority rendah';

              return (
                <div
                  key={todo.id}
                  className="task-item group"
                >
                  {/* Main content: checkbox, text, description, due date */}
                  <div className="task-content">
                    {editingId === todo.id ? (
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                        className="w-full px-4 py-3 border-2 border-blue-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:bg-gray-700 dark:text-white font-medium"
                        autoFocus
                      />
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                            className={`task-checkbox ${todo.completed ? 'checked' : ''}`}
                          />
                          <span
                            className={`text-base font-medium ${
                              todo.completed
                                ? 'line-through text-gray-500 dark:text-gray-400'
                                : 'text-gray-800 dark:text-white'
                            }`}
                          >
                            {todo.text}
                          </span>
                        </div>
                        {todo.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {todo.description}
                          </p>
                        )}
                        {todo.dueDate && (
                          <div className="task-date mt-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(todo.dueDate).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Category & Priority */}
                  <div className="task-meta">
                    {todo.category && (
                      <div className={categoryClass}>{todo.category}</div>
                    )}
                    <div className={priorityClass}>
                      {todo.priority === 'high'
                        ? t('todo.priorityHigh')
                        : todo.priority === 'medium'
                        ? t('todo.priorityMedium')
                        : t('todo.priorityLow')}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="task-actions opacity-0 group-hover:opacity-100 transition-opacity">
                    {editingId === todo.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(todo.id)}
                          className="px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-105"
                        >
                          ✔️ {t('todo.save')}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white text-xs font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-105"
                        >
                          ❌ {t('todo.cancel')}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(todo.id, todo.text)}
                          className="px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          disabled={todo.completed}
                        >
                          ✏️ {t('todo.edit')}
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-105"
                        >
                          🗑️ {t('todo.delete')}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        {todos.length > 0 && (
          <div className="footer-actions">
            <div className="active-count">
              <div className="active-indicator"></div>
              <span>{activeCount} {t('todo.activeTasks')}</span>
            </div>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="clear-completed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {t('todo.clearCompleted')} ({completedCount})
              </button>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
