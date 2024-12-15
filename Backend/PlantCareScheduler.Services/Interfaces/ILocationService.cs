using PlantCareScheduler.Core.Entities;

namespace PlantCareScheduler.Services.Interfaces
{
    public interface ILocationService
    {
        Task<List<Location>> GetAllLocationsAsync();
        Task AddLocationAsync(Location location);
    }
}

