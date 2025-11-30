import * as TaskManager from "expo-task-manager";

export async function checkTasks() {
  const tasks = await TaskManager.getRegisteredTasksAsync();
  console.log("Registered tasks:", tasks);
}

checkTasks();
