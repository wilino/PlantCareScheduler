using PlantCareScheduler.Core.Entities;
namespace PlantCareScheduler.Services.Interfaces
{
    public interface IPlantService
    {
        Task<DateTime> GetNextWateringDateAsync(Plant plant);
        Task<string> GetWateringStatusAsync(Plant plant);
        Task<List<Plant>> GetPlantsOrderedByUrgencyAsync();
        Task AddPlantAsync(Plant plant);
        Task UpdatePlantAsync(Plant plant);
        Task DeletePlantAsync(Guid id);
        Task<Plant> GetPlantByIdAsync(Guid id);
        Task<List<Plant>> GetAllPlantsAsync();
        Task<string?> GetPlantImageAsync(Guid plantId); 
        Task RecordWateringAsync(Guid plantId);
    }
}