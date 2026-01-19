import { TaskManager } from "@/components/TaskManager";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Tasks
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Organize your work and boost your productivity
        </p>
      </div>
      <TaskManager />
    </main>
  );
}
