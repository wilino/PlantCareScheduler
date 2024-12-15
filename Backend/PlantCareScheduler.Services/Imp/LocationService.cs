using PlantCareScheduler.Core.Entities;
using PlantCareScheduler.Core.Interfaces;
using PlantCareScheduler.Services.Interfaces;

namespace PlantCareScheduler.Services.Imp
{
    public class LocationService : ILocationService
    {
        private readonly ILocationRepository _locationRepository;

        public LocationService(ILocationRepository locationRepository)
        {
            _locationRepository = locationRepository;
        }

        public async Task<List<Location>> GetAllLocationsAsync()
        {
            return await _locationRepository.GetAllAsync();
        }

        public async Task AddLocationAsync(Location location)
        {
            await _locationRepository.AddAsync(location);
        }
    }
}

