'use client';

import { usePreferences } from '@/context/PreferencesContext';
import TodoList from '../TodoList';

export default function TodosView() {
  const { t } = usePreferences();
  
  return (
    <div className="p-8 min-h-screen">
      <div className="header mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          ✅ {t('todo.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('todo.subtitle')}
        </p>
      </div>

      <TodoList />
    </div>
  );
}
