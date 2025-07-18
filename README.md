# Unified Service Platform

## Description

This project is a comprehensive platform designed to integrate various services including e-commerce, ride-sharing, real estate, medical services, job listings, and more into a single, unified application. It aims to provide a seamless user experience across different domains, with dedicated interfaces for administrators, vendors, service providers, drivers, and property owners. The platform leverages modern web technologies and a robust backend for scalability and performance.

## Features

- **Multi-service Integration:** Combines diverse services like e-commerce, ride-sharing, real estate, and medical services.
- **Role-Based Dashboards:** Provides tailored interfaces for administrators, vendors, service providers, drivers, and property owners.
- **E-commerce Functionality:** Includes product listings, carts, checkout, payment processing (including MPesa), and vendor management.
- **Ride-Sharing System:** Features ride booking, real-time tracking, driver management, and ride history.
- **Real Estate Platform:** Supports property listings, search, filtering, inquiries, and property owner management.
- **Medical Services Integration:** Allows listing and management of medical providers and potentially medication listings.
- **Job Board:** Provides features for listing and applying to jobs, with employer management.
- **User Authentication and Authorization:** Secure user login, registration, and role-based access control.
- **Notifications:** Real-time and traditional notification systems.
- **Search and Filtering:** Advanced search and filtering capabilities across different service types.
- **Analytics:** Dashboards for tracking key metrics for administrators and vendors.
- **Image Uploads:** Functionality for uploading images for products, properties, etc.
- **SEO Optimization:** Components and hooks for managing SEO elements.
- **Responsive Design:** UI components designed for various screen sizes.

## Technologies Used

*   **Frontend:** React, TypeScript, Tailwind CSS, Shadcn UI
*   **Backend:** Node.js (implied by package.json and yarn.lock), Supabase (Database, Authentication, Functions)
*   **State Management:** React Context API (AuthContext, CartContext), Custom Hooks
*   **Routing:** React Router (implied by page structure)
*   **Payments:** MPesa Integration
*   **Mapping:** MapBox, Google Maps
*   **Database:** Supabase (PostgreSQL)
*   **Migrations:** Supabase Migrations
*   **Other Libraries:** Various dependencies listed in `package.json` and `yarn.lock` (e.g., eslint, postcss, vite)

## Setup

1.  **Clone the repository:**
    
```
bash
    git clone <repository-url>
    cd <project-directory>
    
```
2.  **Install dependencies:**
```
bash
    yarn install
    # or npm install
    # or bun install
    
```
3.  **Set up Supabase:**
    *   Create a new Supabase project.
    *   Configure the database schema using the migration files in `supabase/migrations`. You can use the Supabase CLI for this:
```
bash
        supabase link --project-ref your-project-ref
        supabase migrations up
        
```
*   Configure Supabase authentication and any necessary RLS policies.
    *   Deploy Supabase Functions located in `supabase/functions`.

4.  **Configure environment variables:**
    Create a `.env` file in the project root and add your Supabase URL, anon key, and any other necessary environment variables (e.g., for MPesa, MapBox, Google Maps).
```
env
    VITE_SUPABASE_URL=YOUR_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    # Add other environment variables as needed
    
```
5.  **Run the development server:**
```
bash
    yarn dev
    # or npm run dev
    # or bun dev
    
```
The application should now be running at the address provided in the terminal (usually `http://localhost:5173`).

## Usage

*   **For Users:** Users can browse products, book rides, find properties, search for medical providers, and apply for jobs through the respective sections of the platform. Account creation and login are required for most interactive features.
*   **For Vendors:** Vendors can register, manage their products, track sales, and view analytics through their dedicated dashboard.
*   **For Service Providers (Medical, General):** Service providers can register, list their services, manage bookings, and update their profiles.
*   **For Drivers:** Drivers can register, manage their availability, accept ride requests, and track their earnings.
*   **For Property Owners:** Property owners can register, list their properties, manage inquiries and viewings, and track revenue.
*   **For Administrators:** Administrators have access to a comprehensive dashboard to manage users, vendors, service providers, drivers, properties, orders, products, settings, and view analytics.

Navigate through the application using the sidebar and main content areas. Utilize the search and filter options to find specific items or services.

## Contributing

We welcome contributions to the Unified Service Platform! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bugfix.
3.  Make your changes and ensure they adhere to the project's coding style.
4.  Write clear and concise commit messages.
5.  Test your changes thoroughly.
6.  Push your branch to your fork.
7.  Open a pull request to the main repository's `main` branch.

Please include a detailed description of your changes in the pull request.
