using Microsoft.EntityFrameworkCore;
using PlantCareScheduler.Core.Entities;
using PlantCareScheduler.Core.Interfaces;

namespace PlantCareScheduler.Data.Repositories
{
    public class PlantRepository : Repository<Plant>, IPlantRepository
    {
        private readonly PlantDbContext _context;

        public PlantRepository(PlantDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<Plant>> GetPlantsDueForWateringAsync()
        {
            var plants = await _context.Plants
                .Include(p => p.PlantType) 
                .Include(p => p.Location) 
                .ToListAsync(); 

            return plants.Where(p =>
                (DateTime.Now - p.LastWateredDate).TotalDays >= p.WateringFrequencyDays
            ).ToList();
        }
    }
}