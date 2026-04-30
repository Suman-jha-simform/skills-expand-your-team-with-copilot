# Mergington High School Activities

A website application that allows students and teachers to view and manage extracurricular activities at Mergington High School.

## Features

- View all available extracurricular activities
- Filter activities by category (Sports, Arts, Academic, Community, Technology)
- Filter activities by day of week and time of day
- Search activities by name
- Switch between card view and calendar view
- Dark mode support
- Teacher login for authenticated actions
- Teachers can sign up students for activities
- Teachers can unregister students from activities

## Technology

- **Backend:** FastAPI (Python)
- **Database:** MongoDB (data is persisted across server restarts)
- **Authentication:** Argon2 password hashing
- **Frontend:** HTML, CSS, and JavaScript

## API Endpoints

| Method | Endpoint                                                              | Description                                              |
| ------ | --------------------------------------------------------------------- | -------------------------------------------------------- |
| GET    | `/activities`                                                         | Get all activities, with optional day/time filters       |
| GET    | `/activities/days`                                                    | Get a list of all days that have activities scheduled    |
| POST   | `/activities/{activity_name}/signup?email=student@mergington.edu`     | Sign up a student for an activity (teacher auth required)|
| POST   | `/activities/{activity_name}/unregister?email=student@mergington.edu` | Remove a student from an activity (teacher auth required)|
| POST   | `/auth/login`                                                         | Log in as a teacher                                      |
| GET    | `/auth/check-session`                                                 | Check if a teacher session is valid                      |

## Development Guide

For detailed setup and development instructions, please refer to our [Development Guide](../docs/how-to-develop.md).
