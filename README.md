# BuiltWithCN - Showcase of Websites Built with shadcn/ui

A modern web application for showcasing websites and applications built with shadcn/ui. Users can submit their projects, and administrators can review and approve them for public display.

## Features

### 🏠 **Homepage**
- Grid layout displaying approved websites
- Search functionality by title, description, and tags
- Filter by categories, popularity, and sorting options
- Responsive design optimized for all devices

### 📝 **Website Submission**
- User-friendly form for submitting websites
- Required fields: title, description, live URL, screenshot, category, tags
- Optional source code URL
- Automatic moderation queue

### 👥 **User Management**
- **User Role**: Can submit websites and view approved submissions
- **Moderator Role**: Can approve/reject website submissions
- **Admin Role**: Full access to user management and website moderation

### 🛠 **Admin Panel**
- Dashboard with analytics and statistics
- Website review system with approve/reject functionality
- User management with role assignment
- Popular website highlighting
- Detailed submission tracking

### 🎨 **Design**
- Built with shadcn/ui components
- Modern, clean interface
- Dark/light mode support
- Mobile-first responsive design

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better-Auth
- **Form Handling**: React Hook Form with Zod validation
- **Type Safety**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd builtwithcn
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your database URL and other configuration.

4. **Set up the database**
   ```bash
   pnpm drizzle-kit generate
   pnpm drizzle-kit migrate
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

### Users
- User authentication and role management
- Roles: `user`, `moderator`, `admin`
- Email verification support

### Websites
- Website submissions with metadata
- Status tracking: `pending`, `approved`, `rejected`
- Categories, tags, and popularity flags
- View counts and engagement metrics

## Admin Features

### Website Management
- Review pending submissions
- Edit website details before approval
- Mark websites as popular
- Reject submissions with feedback

### User Management
- View all registered users
- Assign roles (user, moderator, admin)
- Suspend/activate user accounts
- Track user activity and submissions

### Analytics
- Total websites and users
- Submission trends
- Popular categories
- User engagement metrics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on GitHub or contact us at [support@builtwithcn.com](mailto:support@builtwithcn.com).

---

Built with ❤️ using shadcn/ui
