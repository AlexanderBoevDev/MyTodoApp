"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Pagination,
  Select,
  SelectItem,
  Spacer,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

type TaskStatus = "NEW" | "IN_PROGRESS" | "COMPLETED";

type Task = {
  id: number;
  title: string;
  description?: string;
  deadline?: string;
  createdAt: string;
  status: TaskStatus;
};

export default function TasksPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);

  // Поля для создания задачи
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState<TaskStatus>("NEW");

  // Фильтры
  const [filterTitle, setFilterTitle] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDeadline, setFilterDeadline] = useState("");

  // Пагинация
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  // Модальное окно для редактирования
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editedTask, setEditedTask] = useState<Task | null>(null);

  const openEditModal = (task: Task) => {
    setEditedTask(task);
    onOpen();
  };

  const closeEditModal = () => {
    setEditedTask(null);
    onClose();
  };

  // Обновляем задачу (PUT)
  const updateTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!editedTask) return;

    const { id, title, description, deadline, status } = editedTask;
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, deadline, status }),
    });
    if (res.ok) {
      fetchTasks();
      closeEditModal();
    } else {
      alert("Ошибка при обновлении задачи");
    }
  };

  // Проверяем авторизацию и загружаем задачи
  useEffect(() => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    fetchTasks();
  }, [session, router]);

  // Сброс страницы при изменении любого фильтра
  useEffect(() => {
    setPage(1);
  }, [filterTitle, filterStatus, filterDeadline]);

  // Загрузка списка задач (GET)
  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    if (res.ok) {
      const data = await res.json();
      setTasks(data);
    }
  };

  // Создаём задачу (POST)
  const createTask = async () => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, deadline, status }),
    });
    if (res.ok) {
      setTitle("");
      setDescription("");
      setDeadline("");
      setStatus("NEW");
      fetchTasks();
    }
  };

  // Удаляем задачу (DELETE)
  const deleteTask = async (id: number) => {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchTasks();
    }
  };

  // Фильтрация на клиенте
  const filteredTasks = tasks.filter((task) => {
    const matchTitle = task.title
      .toLowerCase()
      .includes(filterTitle.toLowerCase());

    const matchStatus = filterStatus ? task.status === filterStatus : true;

    let matchDeadline = true;
    if (filterDeadline) {
      const filterDate = new Date(filterDeadline);
      if (!task.deadline) {
        matchDeadline = false;
      } else {
        const taskDate = new Date(task.deadline);
        matchDeadline = taskDate <= filterDate;
      }
    }

    return matchTitle && matchStatus && matchDeadline;
  });

  // Пагинация
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const tasksOnPage = filteredTasks.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Мои задачи</h1>

      {/* Создание задачи */}
      <Card className="w-full mb-6">
        <CardHeader className="font-semibold text-lg">
          Создать новую задачу
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-4">
          <Input
            label="Название"
            placeholder="Введите название задачи"
            variant="bordered"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            label="Описание"
            placeholder="Опишите задачу..."
            variant="bordered"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            label="Дедлайн"
            variant="bordered"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <Select
            label="Статус"
            placeholder="Выберите статус"
            variant="bordered"
            className="w-full"
            selectedKeys={new Set([status])}
            onSelectionChange={(keys) => {
              const arr = Array.from(keys);
              setStatus(arr[0] as TaskStatus);
            }}
            items={[
              { key: "NEW", label: "Новая" },
              { key: "IN_PROGRESS", label: "В работе" },
              { key: "COMPLETED", label: "Завершено" },
            ]}
          >
            {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
          </Select>
          <Button color="primary" onPress={createTask}>
            Добавить задачу
          </Button>
        </CardBody>
      </Card>

      {/* Фильтры */}
      <Card className="w-full mb-6">
        <CardHeader className="font-semibold text-lg">Фильтры</CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-4">
          <Input
            label="Поиск по названию"
            placeholder="Введите ключевое слово..."
            variant="bordered"
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
          />
          <Select
            label="Фильтр по статусу"
            placeholder="Все статусы"
            variant="bordered"
            className="w-full"
            selectedKeys={filterStatus ? new Set([filterStatus]) : new Set([])}
            onSelectionChange={(keys) => {
              const arr = Array.from(keys);
              setFilterStatus(arr[0] ? String(arr[0]) : "");
            }}
            items={[
              { key: "", label: "Все" },
              { key: "NEW", label: "Новая" },
              { key: "IN_PROGRESS", label: "В работе" },
              { key: "COMPLETED", label: "Завершено" },
            ]}
          >
            {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
          </Select>
          <Input
            label="Фильтр по дедлайну (до)"
            variant="bordered"
            type="date"
            value={filterDeadline}
            onChange={(e) => setFilterDeadline(e.target.value)}
          />
        </CardBody>
      </Card>

      {/* Список задач */}
      <section className="w-full">
        {tasksOnPage.map((task) => (
          <Card key={task.id} className="mb-4">
            <CardHeader className="flex flex-col items-start">
              <h3 className="font-semibold text-lg">{task.title}</h3>
              {task.deadline && (
                <p className="text-sm text-default-400">
                  Дедлайн: {new Date(task.deadline).toLocaleDateString()}
                </p>
              )}
            </CardHeader>
            <Divider />
            <CardBody>
              {task.description && (
                <p className="text-sm text-default-600">{task.description}</p>
              )}
              <Spacer y={1} />
              <p className="text-sm text-default-500">
                Статус:{" "}
                <span className="font-semibold">
                  {task.status === "NEW"
                    ? "Новая"
                    : task.status === "IN_PROGRESS"
                      ? "В работе"
                      : "Завершено"}
                </span>
              </p>
              <Spacer y={1} />
              <div className="flex gap-3">
                <Button
                  color="warning"
                  variant="light"
                  onPress={() => openEditModal(task)}
                >
                  Редактировать
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => deleteTask(task.id)}
                >
                  Удалить
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination
              initialPage={1}
              total={totalPages}
              page={page}
              onChange={(newPage) => setPage(newPage)}
            />
          </div>
        )}
      </section>

      {/* Модальное окно "Редактировать задачу" */}
      <Modal
        isOpen={isOpen}
        backdrop="blur"
        size="5xl"
        scrollBehavior="inside"
        onClose={closeEditModal}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Редактировать задачу
              </ModalHeader>
              <form onSubmit={updateTask}>
                <ModalBody>
                  {editedTask && (
                    <div className="flex flex-col gap-4">
                      <Input
                        label="Название"
                        placeholder="Название..."
                        variant="bordered"
                        type="text"
                        value={editedTask.title}
                        onChange={(e) =>
                          setEditedTask({
                            ...editedTask,
                            title: e.target.value,
                          })
                        }
                      />
                      <Textarea
                        label="Описание"
                        placeholder="Описание..."
                        variant="bordered"
                        value={editedTask.description || ""}
                        onChange={(e) =>
                          setEditedTask({
                            ...editedTask,
                            description: e.target.value,
                          })
                        }
                      />
                      <Input
                        label="Дедлайн"
                        variant="bordered"
                        type="date"
                        value={editedTask.deadline || ""}
                        onChange={(e) =>
                          setEditedTask({
                            ...editedTask,
                            deadline: e.target.value,
                          })
                        }
                      />
                      <Select
                        label="Статус"
                        variant="bordered"
                        className="w-full"
                        selectedKeys={new Set([editedTask.status])}
                        onSelectionChange={(keys) => {
                          const arr = Array.from(keys);
                          const val = arr[0] as TaskStatus;
                          setEditedTask({ ...editedTask, status: val });
                        }}
                        items={[
                          { key: "NEW", label: "Новая" },
                          { key: "IN_PROGRESS", label: "В работе" },
                          { key: "COMPLETED", label: "Завершено" },
                        ]}
                      >
                        {(item) => (
                          <SelectItem key={item.key}>{item.label}</SelectItem>
                        )}
                      </Select>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={closeEditModal}
                  >
                    Отмена
                  </Button>
                  <Button color="primary" type="submit">
                    Сохранить
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
