using Microsoft.EntityFrameworkCore;
using PlantCareScheduler.Core.Entities;
using PlantCareScheduler.Core.Interfaces;

namespace PlantCareScheduler.Data.Repositories
{
    public class PlantTypeRepository : Repository<PlantType>, IPlantTypeRepository
    {
        public PlantTypeRepository(PlantDbContext context) : base(context)
        {
        }
    }
}

