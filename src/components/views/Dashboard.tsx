'use client';

import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import { useState, useEffect } from 'react';
import { apiGetTodos, ApiTodo } from '@/lib/api';

export default function Dashboard() {
  const { user, token } = useAuth();
  const { t } = usePreferences();
  const [todos, setTodos] = useState<ApiTodo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTodos = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiGetTodos(token);
        setTodos(data);
      } catch (error) {
        // Silently handle error - just set empty todos
        setTodos([]);
      } finally {
        setLoading(false);
      }
    };
    loadTodos();
  }, [token]);

  // Hitung statistik dari data real
  const totalTodos = todos.length;
  const completedTodos = todos.filter(t => t.completed).length;
  const inProgressTodos = todos.filter(t => !t.completed && !isOverdue(t.due_date)).length;
  const overdueTodos = todos.filter(t => !t.completed && isOverdue(t.due_date)).length;

  function isOverdue(dueDate: string | null): boolean {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  }

  const stats = [
    { labelKey: 'dashboard.totalTasks', value: totalTodos.toString(), icon: '✅', color: 'from-blue-500 to-blue-600' },
    { labelKey: 'dashboard.completed', value: completedTodos.toString(), icon: '🎉', color: 'from-green-500 to-green-600' },
    { labelKey: 'dashboard.inProgress', value: inProgressTodos.toString(), icon: '⏳', color: 'from-yellow-500 to-yellow-600' },
    { labelKey: 'dashboard.overdue', value: overdueTodos.toString(), icon: '⚠️', color: 'from-red-500 to-red-600' },
  ];

  // Ambil 5 tugas terbaru
  const recentTodos = [...todos]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-900/40 rounded-2xl shadow-lg p-8 space-y-8">
          {/* Welcome Section */}
          <div className="header mb-4">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              {t('dashboard.welcome')}, {user?.name}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('dashboard.summary')}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="stats grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`stat-icon w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
                <span className="text-3xl font-bold text-gray-800 dark:text-white">
                  {stat.value}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                {t(stat.labelKey)}
              </p>
            </div>
          ))}
          </div>

          {/* Recent Activities / Tugas Terbaru */}
          <div className="tugas-section">
            <div className="section-header">
              <span className="section-icon">📋</span>
              <span className="section-title">{t('dashboard.recentTasks')}</span>
            </div>
            {loading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {t('common.loading')}
              </div>
            ) : recentTodos.length === 0 ? (
              <div className="empty-state text-center py-8">
                <div className="empty-icon text-6xl mb-4">📝</div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {t('dashboard.noTasks')}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {t('dashboard.startAdding')}
                </p>
              </div>
            ) : (
              <div className="task-list">
                {recentTodos.map((todo, index) => {
                  const categoryClass = todo.category
                    ? `task-category ${todo.category.toLowerCase()}`
                    : 'task-category';

                  const priorityClass =
                    todo.priority === 'high'
                      ? 'task-priority tinggi'
                      : todo.priority === 'medium'
                      ? 'task-priority sedang'
                      : 'task-priority rendah';

                  return (
                    <div key={todo.id} className="task-item">
                      <div className="task-number">{index + 1}</div>
                      <div className="task-content">
                        <div className="task-title">{todo.text}</div>
                        <div className="task-status">
                          <span className="task-status-icon">
                            {todo.completed ? '✓' : '⏳'}
                          </span>
                          <span>
                            {todo.completed ? 'Selesai' : 'Belum selesai'}
                          </span>
                        </div>
                      </div>
                      {todo.category && (
                        <div className={categoryClass}>{todo.category}</div>
                      )}
                      {todo.priority && (
                        <div className={priorityClass}>
                          {todo.priority === 'high'
                            ? t('todo.priorityHigh')
                            : todo.priority === 'medium'
                            ? t('todo.priorityMedium')
                            : t('todo.priorityLow')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
