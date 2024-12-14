using PlantCareScheduler.Core.Entities;


namespace PlantCareScheduler.Services.Interfaces
{
    public interface IPlantCareHistoryService
    {
        Task<List<PlantCareHistory>> GetHistoryByPlantIdAsync(Guid plantId);
        Task AddCareHistoryAsync(Guid plantId, string careType, string notes);
        Task<int> GetPlantsWateredThisWeekAsync();
    }
}