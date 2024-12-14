using Microsoft.EntityFrameworkCore;
using PlantCareScheduler.Data;
using PlantCareScheduler.Data.Repositories;
using PlantCareScheduler.Core.Interfaces;
using PlantCareScheduler.Services.Interfaces;
using PlantCareScheduler.Services.Imp;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<PlantDbContext>(options =>
    options.UseInMemoryDatabase("PlantCareDB"));

builder.Services.AddScoped<IPlantRepository, PlantRepository>();
builder.Services.AddScoped<IPlantTypeRepository, PlantTypeRepository>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IPlantCareHistoryRepository, PlantCareHistoryRepository>();


builder.Services.AddScoped<IPlantService, PlantService>();
builder.Services.AddScoped<IPlantCareHistoryService, PlantCareHistoryService>();


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<PlantDbContext>();
    context.Database.EnsureCreated();
}


app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();
app.Run();