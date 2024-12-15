# 🌿 Plant Care Scheduler

## 🚀 **Description**  
Plant Care Scheduler is a web application that helps users track their plants, record care activities, and monitor upcoming watering schedules. The project includes a **Backend** built with **.NET 7** and a **Frontend** developed using **React 18**.  

---

## 🛠️ **Prerequisites**  
Before running the project, make sure the following are installed:  
- [Node.js](https://nodejs.org/) (recommended version 14+)  
- [.NET 7 SDK](https://dotnet.microsoft.com/download/dotnet/7.0)  
- [Visual Studio 2022](https://visualstudio.microsoft.com/) or [Visual Studio for Mac](https://visualstudio.microsoft.com/vs/mac/) with .NET 7 support.  

---

## 📁 **Installation and Execution**  

### 🔧 **Backend**  
#### Option 1: Using Command Line  
1. Open a terminal and navigate to the backend folder:  
   ```bash
   cd Backend/PlantCareScheduler.Api
   ```  
2. Restore dependencies and build the project:  
   ```bash
   dotnet restore
   dotnet build
   ```  
3. Run the server:  
   ```bash
   dotnet run
   ```  
4. The server will be available at:  
   - **Swagger**: [https://localhost:7018/swagger/index.html](https://localhost:7018/swagger/index.html)  

#### Option 2: Using Visual Studio 2022 or Visual Studio for Mac  
1. Open the solution file `Backend.sln` in **Visual Studio 2022** or **Visual Studio for Mac**.  
2. Set `PlantCareScheduler.Api` as the startup project.  
3. Press **F5** (or the "Run" button).  
4. Access **Swagger** at:  
   [https://localhost:7018/swagger/index.html](https://localhost:7018/swagger/index.html).  

---

### 💻 **Frontend**  
1. Open a terminal and navigate to the frontend folder:  
   ```bash
   cd frontend
   ```  
2. Install the required dependencies:  
   ```bash
   npm install
   ```  
3. Start the React application:  
   ```bash
   npm start
   ```  
4. The application will be available at:  
   - **Frontend**: [http://localhost:3000](http://localhost:3000)  

---

## 📋 **Main Endpoints (Backend)**  
- **GET /api/Plants**: List all plants  
- **POST /api/Plants**: Add a new plant  
- **PUT /api/Plants/{id}/water**: Record watering for a plant  
- **GET /api/Plants/due**: Get plants with pending watering  
- **POST /api/Location**: Add a new location  
- **GET /api/Location**: List available locations  
- **POST /api/PlantType**: Add a new plant type  
- **GET /api/PlantType**: List available plant types  

For more details, visit the **Swagger** documentation at:  
[https://localhost:7018/swagger/index.html](https://localhost:7018/swagger/index.html)  

---

## ✅ **Tests**  
The project includes unit tests for critical functionalities.  
To run the tests:  
1. Navigate to the test folder:  
   ```bash
   cd Backend/PlantCareScheduler.Tests
   ```  
2. Execute the tests:  
   ```bash
   dotnet test
   ```  

---

## ✨ **Important Notes**  
- Backend data is stored in memory, meaning all data will be lost when the server restarts.  
- The application automatically calculates watering dates and plant statuses:  
   - **"Overdue"**: Watering is past due.  
   - **"Due Soon"**: Watering is approaching.  
   - **"OK"**: No immediate watering required.  

---

## 🎉 **Contributing**  
Contributions are welcome! If you find an issue or have suggestions, please open an *issue* or submit a *Pull Request*.  

---

## 📝 **Contact**  
If you have any questions regarding the project, feel free to reach out.  

---

Happy coding! 🌱🚀  
