import React, { useState, useMemo } from 'react';
import { Plus, Loader } from 'lucide-react';
import { useGoals } from '../../hooks/useGoals';
import type { GoalWithProgress } from '../../types/database';
import { GoalCard } from './GoalCard';
import { GoalForm } from './GoalForm';
import { GoalUpdateForm } from './GoalUpdateForm';
import { GoalFilters, SortOption } from './GoalFilters';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export function GoalsList() {
  const [showArchived, setShowArchived] = useState(false);
  const { goals, loading, error, createGoal, updateGoal, archiveGoal, addGoalUpdate } = useGoals(showArchived);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalWithProgress | null>(null);
  const [updatingGoal, setUpdatingGoal] = useState<GoalWithProgress | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('created_desc');

  const filteredAndSortedGoals = useMemo(() => {
    let filtered = goals;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (goal) =>
          goal.title.toLowerCase().includes(query) ||
          goal.description?.toLowerCase().includes(query)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'created_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'created_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'target_date_asc':
          return new Date(a.target_date).getTime() - new Date(b.target_date).getTime();
        case 'target_date_desc':
          return new Date(b.target_date).getTime() - new Date(a.target_date).getTime();
        case 'progress_desc':
          return b.completion_percentage - a.completion_percentage;
        case 'progress_asc':
          return a.completion_percentage - b.completion_percentage;
        default:
          return 0;
      }
    });

    return sorted;
  }, [goals, searchQuery, sortBy]);

  const handleCreateGoal = async (data: any) => {
    await createGoal(data);
    setIsCreateModalOpen(false);
  };

  const handleUpdateGoal = async (data: any) => {
    if (editingGoal) {
      await updateGoal(editingGoal.id, data);
      setEditingGoal(null);
    }
  };

  const handleAddUpdate = async (data: any) => {
    await addGoalUpdate(data);
    setUpdatingGoal(null);
  };

  const handleArchive = async (id: string) => {
    if (confirm('Are you sure you want to archive this goal?')) {
      await archiveGoal(id);
    }
  };

  if (loading && goals.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Financial Goals</h1>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus size={20} className="mr-2" />
              New Goal
            </Button>
          </div>

          <GoalFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            showArchived={showArchived}
            onShowArchivedChange={setShowArchived}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {filteredAndSortedGoals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              {searchQuery
                ? 'No goals found matching your search.'
                : showArchived
                ? 'No goals found. Create your first goal to get started!'
                : 'No active goals. Create your first goal to get started!'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus size={20} className="mr-2" />
                Create Your First Goal
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={setEditingGoal}
                onArchive={handleArchive}
                onAddUpdate={setUpdatingGoal}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Goal"
      >
        <GoalForm
          onSubmit={handleCreateGoal}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingGoal}
        onClose={() => setEditingGoal(null)}
        title="Edit Goal"
      >
        {editingGoal && (
          <GoalForm
            goal={editingGoal}
            onSubmit={handleUpdateGoal}
            onCancel={() => setEditingGoal(null)}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!updatingGoal}
        onClose={() => setUpdatingGoal(null)}
        title={`Update Progress: ${updatingGoal?.title}`}
      >
        {updatingGoal && (
          <GoalUpdateForm
            goal={updatingGoal}
            onSubmit={handleAddUpdate}
            onCancel={() => setUpdatingGoal(null)}
          />
        )}
      </Modal>
    </div>
  );
}
