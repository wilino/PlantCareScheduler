using PlantCareScheduler.Core.Entities;

namespace PlantCareScheduler.Core.Interfaces
{
    public interface IPlantCareHistoryRepository : IRepository<PlantCareHistory>
    {
        Task<List<PlantCareHistory>> GetHistoryByPlantIdAsync(Guid plantId);
    }
}