using Microsoft.EntityFrameworkCore;
using PlantCareScheduler.Core.Entities;
using PlantCareScheduler.Core.Interfaces;

namespace PlantCareScheduler.Data.Repositories
{
    public class PlantCareHistoryRepository : Repository<PlantCareHistory>, IPlantCareHistoryRepository
    {
        private readonly PlantDbContext _context;

        public PlantCareHistoryRepository(PlantDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<PlantCareHistory>> GetHistoryByPlantIdAsync(Guid plantId)
        {
            return await _context.PlantCareHistories
                .Where(h => h.PlantId == plantId)
                .OrderByDescending(h => h.CareDate)
                .ToListAsync();
        }
    }
}