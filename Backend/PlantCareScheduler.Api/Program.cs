using Microsoft.EntityFrameworkCore;
using PlantCareScheduler.Data;
using PlantCareScheduler.Data.Repositories;
using PlantCareScheduler.Core.Interfaces;
using PlantCareScheduler.Services.Interfaces;
using PlantCareScheduler.Services.Imp;

var builder = WebApplication.CreateBuilder(args);

// Configuración de base de datos en memoria
builder.Services.AddDbContext<PlantDbContext>(options =>
    options.UseInMemoryDatabase("PlantCareDB"));

// Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Registro de repositorios
builder.Services.AddScoped<IPlantRepository, PlantRepository>();
builder.Services.AddScoped<IPlantTypeRepository, PlantTypeRepository>();
builder.Services.AddScoped<ILocationRepository, LocationRepository>(); // Registro del repositorio de Location
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IPlantCareHistoryRepository, PlantCareHistoryRepository>();

// Registro de servicios
builder.Services.AddScoped<IPlantService, PlantService>();
builder.Services.AddScoped<IPlantTypeService, PlantTypeService>(); // Registro del servicio de PlantType
builder.Services.AddScoped<ILocationService, LocationService>();   // Registro del servicio de Location
builder.Services.AddScoped<IPlantCareHistoryService, PlantCareHistoryService>();

// Configuración de controladores y Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configuración del entorno de desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Configuración de CORS
app.UseCors("AllowFrontend");

// Asegurar que la base de datos esté creada
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<PlantDbContext>();
    context.Database.EnsureCreated();
}

// Configuración del pipeline de la aplicación
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();