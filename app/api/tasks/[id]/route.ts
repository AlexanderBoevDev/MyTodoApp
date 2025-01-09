import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient, TaskStatus } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * PUT /api/tasks/[id]
 */
export async function PUT(req: Request, context: unknown) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    // Явно приводим context к ожидаемой структуре
    const { params } = context as { params: { id: string } };
    const recordId = Number(params.id);

    const body = await req.json();
    const { title, description, deadline, status } = body;

    const existingTask = await prisma.task.findUnique({
      where: { id: recordId },
    });
    if (!existingTask || existingTask.userId !== Number(session.user.id)) {
      return NextResponse.json(
        { error: "Нет доступа к задаче" },
        { status: 403 },
      );
    }

    const dataToUpdate: Record<string, unknown> = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;
    if (deadline !== undefined) {
      dataToUpdate.deadline = deadline ? new Date(deadline) : null;
    }
    if (status && Object.values(TaskStatus).includes(status as TaskStatus)) {
      dataToUpdate.status = status;
    }

    const updatedTask = await prisma.task.update({
      where: { id: recordId },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (err) {
    console.error("PUT /api/tasks/[id] error:", err);
    return NextResponse.json(
      { error: "Ошибка при обновлении задачи" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/tasks/[id]
 */
export async function DELETE(req: Request, context: unknown) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    // Снова приводим context к { params: { id: string } }
    const { params } = context as { params: { id: string } };
    const recordId = Number(params.id);

    const existingTask = await prisma.task.findUnique({
      where: { id: recordId },
    });
    if (!existingTask || existingTask.userId !== Number(session.user.id)) {
      return NextResponse.json(
        { error: "Нет доступа к задаче" },
        { status: 403 },
      );
    }

    await prisma.task.delete({ where: { id: recordId } });

    return NextResponse.json({ message: "Задача удалена" }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/tasks/[id] error:", err);
    return NextResponse.json(
      { error: "Ошибка при удалении задачи" },
      { status: 500 },
    );
  }
}
