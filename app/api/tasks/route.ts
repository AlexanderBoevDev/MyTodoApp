import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient, TaskStatus } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/tasks?title=...&status=...&deadline=...
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const userId = Number(session.user.id);

    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || undefined;
    const status = searchParams.get("status") || undefined;
    const deadlineParam = searchParams.get("deadline") || undefined;

    const whereClause: Record<string, unknown> = { userId };

    if (title) {
      whereClause.title = {
        contains: title,
        mode: "insensitive",
      };
    }

    if (status && Object.values(TaskStatus).includes(status as TaskStatus)) {
      whereClause.status = status;
    }

    if (deadlineParam) {
      const dateLimit = new Date(deadlineParam);
      whereClause.deadline = {
        lte: dateLimit,
      };
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tasks, { status: 200 });
  } catch (err) {
    console.error("GET /api/tasks error:", err);
    return NextResponse.json(
      { error: "Ошибка при получении задач" },
      { status: 500 },
    );
  }
}

// POST /api/tasks
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, deadline, status } = body;

    const userId = Number(session.user.id);

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        deadline: deadline ? new Date(deadline) : null,
        status: status || undefined,
        userId,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (err) {
    console.error("POST /api/tasks error:", err);
    return NextResponse.json(
      { error: "Ошибка при создании задачи" },
      { status: 500 },
    );
  }
}
