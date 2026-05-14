"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [tasks, setTasks] = useState<any[]>([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetch(`http://localhost:5000/api/tasks/${user.role}`)
      .then(res => res.json())
      .then(setTasks);
  }, []);

  const done = async (id: number) => {
    await fetch(`http://localhost:5000/api/tasks/${id}/done`, {
      method: "PUT",
    });

    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-bold mb-4">Công việc</h2>

      {tasks.map(t => (
        <div key={t.id} className="p-3 border mb-2 flex justify-between">
          {t.title}
          <button onClick={() => done(t.id)}>Done</button>
        </div>
      ))}
    </div>
  );
}