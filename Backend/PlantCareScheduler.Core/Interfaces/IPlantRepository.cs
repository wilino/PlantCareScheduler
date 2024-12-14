using PlantCareScheduler.Core.Entities;


namespace PlantCareScheduler.Core.Interfaces
{
    public interface IPlantRepository : IRepository<Plant>
    {
        Task<List<Plant>> GetPlantsDueForWateringAsync();
    }
}