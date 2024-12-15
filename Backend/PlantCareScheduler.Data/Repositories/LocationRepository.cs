using PlantCareScheduler.Core.Entities;
using PlantCareScheduler.Core.Interfaces;

namespace PlantCareScheduler.Data.Repositories
{
    public class LocationRepository : Repository<Location>, ILocationRepository
    {
        public LocationRepository(PlantDbContext context) : base(context)
        {
        }

    }
}