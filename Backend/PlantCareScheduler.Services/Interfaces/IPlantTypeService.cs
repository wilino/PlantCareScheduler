using PlantCareScheduler.Core.Entities;

namespace PlantCareScheduler.Services.Interfaces
{
    public interface IPlantTypeService
    {
        Task<List<PlantType>> GetAllPlantTypesAsync();
        Task AddPlantTypeAsync(PlantType plantType);
    }
}

