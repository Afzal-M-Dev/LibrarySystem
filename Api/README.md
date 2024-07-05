
# .NET Core 6 Web API Project

## Getting Started

### Prerequisites

- [.NET SDK 6.0](https://dotnet.microsoft.com/download/dotnet/6.0)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/your-repository.git
    cd your-repository
    ```

2. Restore dependencies:
    ```bash
    dotnet restore
    ```

### Database Setup

1. Configure your database connection string in `appsettings.json`:
    ```json
    {
      "ConnectionStrings": {
        "DefaultConnection": "YourConnectionStringHere"
      }
    }
    ```

2. Note: You do not need to run any database migrations as they are already set up in `Program.cs`.

### Running the Application

- Development server:
    ```bash
    dotnet run
    ```
    The API will be available at `https://localhost:5001/` or `http://localhost:5000/`.

### Swagger Setup

- Swagger is enabled and configured with authorization in this project. 
- To access Swagger UI, navigate to `https://localhost:5001/swagger` or `http://localhost:5000/swagger`.
- You can test the API endpoints directly from the Swagger UI.

### Building the Application

- To build the project:
    ```bash
    dotnet build
    ```

### Testing the Application

- To run tests:
    ```bash
    dotnet test
    ```
