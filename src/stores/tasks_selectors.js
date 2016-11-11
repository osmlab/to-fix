const TasksSelectors = {
  getAllTasks: (state) => (
    // Sort by most recent
    state.allIds.map(id => state.byId[id])
      .sort((a, b) => b.value.updated - a.value.updated)
  ),

  getCompletedTasks: (state) => (
    getAllTasks(state)
      .filter(task => task.isCompleted)
  ),

  getActiveTasks: (state) => (
    getAllTasks(state)
      .filter(task => !task.isCompleted)
  ),

  getCurrentTask: (state) => (
    state.byId[state.currentId]
  ),

  getTaskSummary: (state) => (
    getCurrentTask(state).value.stats;
  ),
};

export default TasksSelectors;
