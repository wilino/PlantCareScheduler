using Microsoft.EntityFrameworkCore;
using PlantCareScheduler.Core.Entities;
using PlantCareScheduler.Core.Interfaces;

namespace PlantCareScheduler.Data.Repositories
{
    public class LocationRepository : Repository<Location>, IRepository<Location>
    {
        private readonly PlantDbContext _context;

        public LocationRepository(PlantDbContext context) : base(context)
        {
            _context = context;
        }
}
}

