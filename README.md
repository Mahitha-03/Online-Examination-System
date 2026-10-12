# Online Examination System

## 📌 Project Overview

The **Online Examination System** is a web-based application designed to simplify online examination management. It allows students to register, log in, view available examinations, answer questions, submit their responses, and view their examination results.

The application also provides an administrative dashboard for managing examination questions, including adding, editing, and deleting questions.

The frontend is developed using React.js, the backend uses Java and Spring Boot REST APIs, and MySQL is used for database management.

## 🚀 Features

### 👨‍🎓 Student Module
- User registration and login
- View available examinations
- View examination questions and answer options
- Select answers and submit examinations
- Automatic score calculation
- View examination results
- View previous examination results

### 🛠️ Admin Module
- Admin dashboard
- View examination questions
- Add new questions
- Edit existing questions
- Delete questions
- View questions with pagination

## 🧰 Technologies Used

### Frontend
- React.js
- JavaScript
- CSS

### Backend
- Java
- Spring Boot
- Spring Web (REST APIs)
- Spring Data JPA
- Hibernate

### Database
- MySQL

### Development Tools
- Eclipse IDE
- Visual Studio Code
- Maven
- Postman
- Git and GitHub

## 🏗️ Project Architecture

```text
Online-Examination-System/
│
├── Frontend - React.js
│   │
│   └── src/
│       ├── assets/
│       │
│       ├── pages/
│       │   ├── AdminDashboard.jsx
│       │   ├── Auth.css
│       │   ├── Exam.jsx
│       │   ├── Login.jsx
│       │   ├── MyResults.jsx
│       │   ├── Questions.jsx
│       │   └── Register.jsx
│       │
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
│
├── Backend - Spring Boot
│   │
│   └── src/main/java/com/example/online_examination/
│       │
│       ├── GlobalExceptionHandler.java
│       ├── OnlineExaminationApplication.java
│       │
│       ├── controller/
│       │   ├── ExamController.java
│       │   ├── ExamResultController.java
│       │   ├── MyResultsController.java
│       │   ├── QuestionController.java
│       │   └── UserController.java
│       │
│       ├── entity/
│       │   ├── Exam.java
│       │   ├── ExamResult.java
│       │   ├── Question.java
│       │   ├── QuestionResponse.java
│       │   └── User.java
│       │
│       ├── repository/
│       │   ├── ExamRepository.java
│       │   ├── ExamResultRepository.java
│       │   ├── QuestionRepository.java
│       │   └── UserRepository.java
│       │
│       └── service/
│           ├── ExamResultService.java
│           ├── ExamResultServiceImpl.java
│           ├── ExamService.java
│           ├── ExamServiceInterface.java
│           ├── QuestionService.java
│           ├── QuestionServiceImpl.java
│           ├── UserService.java
│           └── UserServiceImpl.java
│
├── Database - MySQL
│   ├── Users
│   ├── Exams
│   ├── Questions
│   └── Exam Results
│
├── pom.xml
├── package.json
└── README.md
```

*Note: The architecture illustrates the logical separation between the frontend, backend, and database. The actual source folders may be organized differently in the repository.*

## 🧩 Architecture Components

- **Frontend:** React components provide the user interface for authentication, examinations, question management, and results.
- **Controller Layer:** Handles HTTP requests and exposes REST API endpoints.
- **Service Layer:** Implements business logic for users, examinations, questions, and result evaluation.
- **Repository Layer:** Uses Spring Data JPA to perform database operations.
- **Entity Layer:** Defines the application's data models, including users, examinations, questions, and examination results.
- **QuestionResponse DTO:** Returns question information to students without exposing the correct answer in student-facing question APIs.
- **Exception Handling:** `GlobalExceptionHandler` handles application exceptions and returns appropriate error responses.
- **Database:** MySQL stores application data, including users, examinations, questions, and results.

## 🔄 Application Workflow

1. The user registers or logs in through the React frontend.
2. The frontend communicates with the backend using REST APIs.
3. The backend controllers receive requests and call the appropriate service methods.
4. The service layer processes business logic and interacts with repositories.
5. Spring Data JPA and Hibernate perform database operations with MySQL.
6. Students submit their examination answers.
7. The backend evaluates the answers, calculates the score, and saves the result.
8. The frontend displays the examination result and previously saved results.

## ⚙️ Prerequisites

Install the following software before running the project:

- Java JDK
- Node.js and npm
- MySQL Server
- Eclipse IDE or another Java IDE
- Visual Studio Code or another code editor
- Git

## 🗄️ Database Configuration

### 1. Create the Database

Open MySQL and execute:

```sql
CREATE DATABASE online_exam;
```

### 2. Configure the Backend

Open the Spring Boot `application.properties` file and configure the database connection.

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/online_exam
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your MySQL credentials.

**Security note:** Do not commit real database passwords or other secrets to GitHub.

## ▶️ How to Run the Project

### 1. Start the Backend

Open a terminal in the Spring Boot project directory and execute:

```bash
mvn spring-boot:run
```

Alternatively, open the project in Eclipse and run `OnlineExaminationApplication.java` as a Java application.

Make sure MySQL is running and the database configuration is correct.

### 2. Start the Frontend

Open a separate terminal in the React frontend directory and execute:

```bash
npm install
npm run dev
```

Open the local URL displayed in the terminal. The default Vite development URL is usually:

`http://localhost:5173`

Ensure that the frontend API requests point to the correct backend URL and port.

## 🔗 REST API Overview

The following endpoints are provided by the backend.

| Endpoint | Method | Description |
|---|---|---|
| `/api/exams` | GET | Retrieve available examinations |
| `/api/questions` | GET | Retrieve questions |
| `/api/questions/exam/{examId}` | GET | Retrieve questions for a particular examination |
| `/api/questions` | POST | Add a new question |
| `/api/questions/bulk` | POST | Add multiple questions |
| `/api/questions/{id}` | GET | Retrieve a question by ID |
| `/api/questions/{id}` | PUT | Update an existing question |
| `/api/questions/{id}` | DELETE | Delete a question |
| `/api/results/submit/{examId}/{userId}` | POST | Submit examination answers |
| `/api/my-results/{userId}` | GET | Retrieve previous examination results |

## 🧪 API Testing

Postman is used to test the backend REST APIs, including:

- Retrieving examinations and questions
- Adding, updating, and deleting questions
- Submitting examination answers
- Checking examination scores
- Retrieving saved results

## 🎯 Project Objective

The objective of this project is to provide a convenient web-based platform for conducting examinations, evaluating student responses, storing results, and managing examination questions through an administrative interface.

## 👩‍💻 Author

**Mahitha-03**

GitHub: [Mahitha-03](https://github.com/Mahitha-03)
