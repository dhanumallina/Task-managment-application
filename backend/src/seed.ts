import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from './config/env.js';
import User from './models/User.js';
import Task from './models/Task.js';
import Workspace from './models/Workspace.js';
import Notification from './models/Notification.js';
import Comment from './models/Comment.js';
import ActivityLog from './models/ActivityLog.js';

async function seed() {
  console.log('Connecting to database...');
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('MongoDB connected successfully.');

    // 1. Clear existing collections
    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Task.deleteMany({}),
      Workspace.deleteMany({}),
      Notification.deleteMany({}),
      Comment.deleteMany({}),
      ActivityLog.deleteMany({}),
    ]);
    console.log('Existing collections cleared.');

    // 2. Create demo user
    console.log('Creating demo user...');
    const hashedPassword = await bcrypt.hash('Password123', 12);
    const user = await User.create({
      name: 'Demo User',
      email: 'demo@lumio.app',
      password: hashedPassword,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
      role: 'user',
    });
    console.log(`Demo user created: ${user.email}`);

    // 3. Create default workspace
    console.log('Creating default workspace...');
    const workspace = await Workspace.create({
      name: 'Personal Space',
      description: 'Your default workspace for tracking personal projects and tasks.',
      ownerId: user._id,
      members: [
        {
          userId: user._id,
          role: 'owner',
        },
      ],
    });
    console.log(`Workspace "${workspace.name}" created.`);

    // 4. Update user workspaces reference
    user.workspaces.push(workspace._id as mongoose.Types.ObjectId);
    await user.save();

    // 5. Create realistic sample tasks
    console.log('Creating sample tasks...');
    const now = new Date();
    
    const taskData = [
      {
        title: 'Design Lumio Landing Page UI',
        description: 'Design a sleek, modern landing page with a Cream & Yellow warm theme. Focus on glassmorphism components, interactive buttons, and responsive grid layouts.',
        status: 'completed',
        priority: 'high',
        category: 'Design',
        labels: ['ui', 'design', 'v1'],
        dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // Due 2 days ago (completed)
        subtasks: [
          { title: 'Sketch wireframes and layout mapping', completed: true },
          { title: 'Define HSL color system in tailwind.config', completed: true },
          { title: 'Design high-fidelity mockups in Figma', completed: true },
        ],
        createdBy: user._id,
        workspaceId: workspace._id,
      },
      {
        title: 'Setup REST API Routing and Auth Gateways',
        description: 'Complete routing mounts for authentication, user profiles, and tasks CRUD. Secure access using double token authentication stored safely in HTTP-only cookies.',
        status: 'in-progress',
        priority: 'high',
        category: 'Backend',
        labels: ['api', 'auth', 'security'],
        dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // Due tomorrow
        subtasks: [
          { title: 'Implement JWT signing and cookie injection', completed: true },
          { title: 'Create register and login route controllers', completed: true },
          { title: 'Write secure custom authenticate middleware', completed: false },
        ],
        createdBy: user._id,
        workspaceId: workspace._id,
      },
      {
        title: 'Integrate WebSockets for Real-time Caching',
        description: 'Add Socket.io integration to automatically trigger cache invalidation. Sync task updates, list adjustments, comments, and alerts instantly.',
        status: 'pending',
        priority: 'urgent',
        category: 'Backend',
        labels: ['sockets', 'real-time'],
        dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // Due in 3 days
        subtasks: [
          { title: 'Initialize socket server connection in index.ts', completed: false },
          { title: 'Write socket event emitters and state mapping', completed: false },
          { title: 'Add dynamic TanStack Query cache invalidator hook', completed: false },
        ],
        createdBy: user._id,
        workspaceId: workspace._id,
      },
      {
        title: 'Deploy to Cloud Infrastructure',
        description: 'Configure and prepare Next.js configuration for deployment to Vercel, and the Express API server to Render/Railway. Add environment validation checks.',
        status: 'pending',
        priority: 'medium',
        category: 'DevOps',
        labels: ['deployment', 'cloud'],
        dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // Due in 5 days
        subtasks: [
          { title: 'Write next.config.js output trace config', completed: false },
          { title: 'Setup MongoAtlas production cluster connection', completed: false },
        ],
        createdBy: user._id,
        workspaceId: workspace._id,
      },
      {
        title: 'Write Jest and Supertest Endpoint Tests',
        description: 'Cover authorization flows, token refreshing, task validation boundaries, and error handler states. Aim for 80%+ test coverage.',
        status: 'pending',
        priority: 'low',
        category: 'Testing',
        labels: ['testing', 'qa'],
        dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
        subtasks: [
          { title: 'Write unit tests for token creation helpers', completed: false },
          { title: 'Add supertest integration suite for CRUD routes', completed: false },
        ],
        createdBy: user._id,
        workspaceId: workspace._id,
      },
    ];

    const tasks = await Task.insertMany(taskData);
    console.log(`${tasks.length} sample tasks created.`);

    // 6. Create activity logs
    console.log('Creating sample activity logs...');
    const activityLogs = [
      {
        userId: user._id,
        action: 'created task "Design Lumio Landing Page UI"',
        entityType: 'task',
        entityId: tasks[0]._id,
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user._id,
        action: 'completed task "Design Lumio Landing Page UI"',
        entityType: 'task',
        entityId: tasks[0]._id,
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user._id,
        action: 'created task "Setup REST API Routing and Auth Gateways"',
        entityType: 'task',
        entityId: tasks[1]._id,
        createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user._id,
        action: 'created task "Integrate WebSockets for Real-time Caching"',
        entityType: 'task',
        entityId: tasks[2]._id,
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
    ];
    await ActivityLog.insertMany(activityLogs);
    console.log('Activity logs created.');

    // 7. Create sample notifications
    console.log('Creating sample notifications...');
    const notifications = [
      {
        userId: user._id,
        type: 'workspace_invite',
        message: 'Welcome to Lumio! Get started by exploring your "Personal Space" workspace.',
        read: true,
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user._id,
        type: 'task_updated',
        message: 'Task "Design Lumio Landing Page UI" marked as completed! 🎉',
        referenceId: tasks[0]._id,
        read: false,
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user._id,
        type: 'due_date',
        message: 'Task "Setup REST API Routing and Auth Gateways" is approaching its due date tomorrow.',
        referenceId: tasks[1]._id,
        read: false,
        createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
    ];
    await Notification.insertMany(notifications);
    console.log('Notifications created.');

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Mongoose connection disconnected.');
    process.exit(0);
  }
}

seed();
