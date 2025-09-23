# 🚀 Jira Clone - Modern Project Management Tool

A full-featured project management application inspired by Atlassian Jira, built with modern web technologies.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.20-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🏢 Organization Management

- **Multi-tenant architecture** with Clerk Organizations
- **Role-based access control** (Admin/Member permissions)
- **Organization switching** with seamless context switching

### 📋 Project Management

- **Create and manage projects** with unique keys and descriptions
- **Project overview** with detailed statistics
- **Organization-scoped projects** for proper data isolation

### 🏃‍♂️ Sprint Management

- **Agile sprint planning** with start/end dates
- **Sprint status tracking** (Planned → Active → Completed)
- **Sprint board** with drag-and-drop functionality
- **Issue assignment** to sprints

### 🎫 Issue Tracking

- **Complete issue lifecycle** (TODO → In Progress → In Review → Done)
- **Priority levels** (Low, Medium, High, Urgent)
- **Issue assignment** to team members
- **Rich issue details** with descriptions
- **Issue filtering** by assignee, priority, and status
- **Drag-and-drop** issue management within sprint boards

### 👥 User Management

- **Authentication** powered by Clerk
- **User profiles** with avatars and details
- **Issue assignment** and ownership tracking
- **Personal issue dashboard** (Assigned to You / Reported by You)

### 🎨 Modern UI/UX

- **Responsive design** that works on all devices
- **Dark/Light theme** support
- **Beautiful animations** and transitions
- **Intuitive drag-and-drop** interface
- **Toast notifications** for user feedback

## 🛠️ Tech Stack

### Frontend

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://reactjs.org/)** - UI library with latest features
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful and accessible component library
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible UI primitives

### Backend & Database

- **[Prisma](https://www.prisma.io/)** - Next-generation ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Powerful relational database
- **[Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)** - Serverless backend

### Authentication & Authorization

- **[Clerk](https://clerk.com/)** - Complete authentication solution
- **Organization management** with role-based permissions
- **Session management** and user context

### Development Tools

- **[Bun](https://bun.sh/)** - Fast JavaScript runtime and package manager
- **[ESLint](https://eslint.org/)** - Code linting and formatting
- **[Prisma Studio](https://www.prisma.io/studio)** - Database visualization

### Additional Libraries

- **[@hello-pangea/dnd](https://github.com/hello-pangea/dnd)** - Drag and drop functionality
- **[React Hook Form](https://react-hook-form.com/)** - Performant forms with validation
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[Date-fns](https://date-fns.org/)** - Modern JavaScript date utility library
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** or **Bun 1.0+**
- **PostgreSQL database**
- **Clerk account** for authentication

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ThanhJamie/jira-clone.git
   cd jira-clone
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/jira_clone"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/onboarding
   NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/onboarding
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   bunx prisma generate

   # Run database migrations
   bunx prisma db push

   # (Optional) Seed the database
   bunx prisma db seed
   ```

5. **Start the development server**

   ```bash
   bun run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Getting Started

1. **Sign up** or **sign in** using Clerk authentication
2. **Create an organization** or join an existing one
3. **Create your first project** with a unique key
4. **Start a sprint** and begin adding issues
5. **Manage your team** by inviting members to your organization

### Project Management Workflow

1. **Create Issues** → Add tasks with descriptions, priorities, and assignees
2. **Plan Sprints** → Organize issues into time-boxed sprints
3. **Start Sprint** → Begin working with an active sprint board
4. **Track Progress** → Use drag-and-drop to move issues through workflow states
5. **Complete Sprint** → Finish sprint and review completed work

## 🏗️ Project Structure

```
jira-clone/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (main)/            # Main application routes
│   │   ├── organization/  # Organization management
│   │   └── project/       # Project and sprint management
│   ├── globals.css        # Global styles
│   └── layout.js          # Root layout
├── actions/               # Server actions
│   ├── issues.js         # Issue management actions
│   ├── projects.js       # Project management actions
│   └── organizations.js  # Organization actions
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── prisma/               # Database schema and migrations
│   └── schema.prisma     # Prisma schema definition
└── public/               # Static assets
```

## 🗄️ Database Schema

The application uses a relational database with the following core entities:

- **Users** - User profiles and authentication data
- **Projects** - Project information and organization association
- **Sprints** - Time-boxed work periods
- **Issues** - Individual work items with status and priority
- **Relationships** - Foreign keys connecting entities

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Atlassian Jira](https://www.atlassian.com/software/jira)** - Inspiration for the project management workflow
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful component library
- **[Clerk](https://clerk.com/)** - Authentication and user management
- **[Vercel](https://vercel.com/)** - Deployment platform

## 📞 Support

If you have any questions or need help, please:

- **Open an issue** on GitHub
- **Check the documentation** in the `/docs` folder
- **Join our community** discussions

---

**Built with ❤️ by [ThanhJamie](https://github.com/ThanhJamie)**
