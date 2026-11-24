const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@test.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@test.com',
      password,
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: 'Design new login screen',
        description: 'Create a modern login page with glassmorphism and strong visual hierarchy.',
        status: 'TODO',
        priority: 'HIGH',
        userId: user.id,
      },
      {
        title: 'Add Kanban drag and drop',
        description: 'Allow users to move tasks between To Do, In Progress and Done.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        userId: user.id,
      },
      {
        title: 'Create dashboard stats cards',
        description: 'Show total tasks, completed tasks, pending tasks and high priority tasks.',
        status: 'DONE',
        priority: 'MEDIUM',
        userId: user.id,
      },
      {
        title: 'Improve empty states',
        description: 'Make blank pages feel useful with CTA buttons and helpful text.',
        status: 'TODO',
        priority: 'MEDIUM',
        userId: user.id,
      },
      {
        title: 'Prepare portfolio screenshots',
        description: 'Capture clean screenshots for GitHub README and portfolio.',
        status: 'TODO',
        priority: 'LOW',
        userId: user.id,
      },
    ],
  });

  console.log('Demo user and tasks created');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());